import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Coupon, Prisma } from "../generated/prisma-client";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateCouponDto } from "./dto/create-coupon.dto";
import type { PreviewCouponDto } from "./dto/preview-coupon.dto";
import type { UpdateCouponDto } from "./dto/update-coupon.dto";

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  normalizeCode(code: string): string {
    return code.trim().toUpperCase();
  }

  discountAmount(subtotal: number, percentOff: number): number {
    return Math.round(((subtotal * percentOff) / 100) * 100) / 100;
  }

  async computeSubtotalFromItems(items: { productId: string; quantity: number }[]): Promise<number> {
    let subtotal = 0;
    for (const item of items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Unknown product: ${item.productId}`);
      }
      subtotal += Number(product.price) * item.quantity;
    }
    return Math.round(subtotal * 100) / 100;
  }

  async preview(dto: PreviewCouponDto) {
    const subtotal = await this.computeSubtotalFromItems(dto.items);
    const normalized = this.normalizeCode(dto.code);
    const coupon = await this.prisma.coupon.findFirst({
      where: { code: { equals: normalized, mode: "insensitive" }, active: true },
    });
    if (!coupon) {
      return { valid: false as const, message: "Invalid or inactive coupon code." };
    }
    const discount = this.discountAmount(subtotal, Number(coupon.percentOff));
    if (discount <= 0) {
      return { valid: false as const, message: "This coupon does not apply to your cart." };
    }
    if (coupon.maxUses != null) {
      const used = await this.prisma.order.count({ where: { couponId: coupon.id } });
      if (used >= coupon.maxUses) {
        return { valid: false as const, message: "This coupon has reached its usage limit." };
      }
    }
    const totalAfterDiscount = Math.round((subtotal - discount) * 100) / 100;
    return {
      valid: true as const,
      code: coupon.code,
      percentOff: Number(coupon.percentOff),
      subtotal,
      discountAmount: discount,
      totalAfterDiscount,
    };
  }

  /**
   * Validates coupon inside a transaction (usage limits are race-safe with order insert).
   */
  async resolveForOrder(
    code: string | undefined,
    subtotal: number,
    tx: Prisma.TransactionClient
  ): Promise<{
    couponId: string | null;
    couponCodeSnapshot: string | null;
    couponDiscountAmount: number;
  }> {
    if (!code?.trim()) {
      return { couponId: null, couponCodeSnapshot: null, couponDiscountAmount: 0 };
    }
    const normalized = this.normalizeCode(code);
    const coupon = await tx.coupon.findFirst({
      where: { code: { equals: normalized, mode: "insensitive" }, active: true },
    });
    if (!coupon) {
      throw new BadRequestException("Invalid or inactive coupon code.");
    }
    if (coupon.maxUses != null) {
      const used = await tx.order.count({ where: { couponId: coupon.id } });
      if (used >= coupon.maxUses) {
        throw new BadRequestException("This coupon has reached its usage limit.");
      }
    }
    const discount = this.discountAmount(subtotal, Number(coupon.percentOff));
    if (discount <= 0) {
      throw new BadRequestException("This coupon does not apply to your cart.");
    }
    const merchandiseTotal = Math.round((subtotal - discount) * 100) / 100;
    if (merchandiseTotal < 0) {
      throw new BadRequestException("Invalid coupon discount.");
    }
    return {
      couponId: coupon.id,
      couponCodeSnapshot: coupon.code,
      couponDiscountAmount: discount,
    };
  }

  listAdmin() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  }

  async createAdmin(dto: CreateCouponDto): Promise<Coupon> {
    const code = this.normalizeCode(dto.code);
    const exists = await this.prisma.coupon.findUnique({ where: { code } });
    if (exists) {
      throw new ConflictException("A coupon with this code already exists.");
    }
    return this.prisma.coupon.create({
      data: {
        code,
        percentOff: dto.percentOff,
        active: dto.active ?? true,
        maxUses: dto.maxUses ?? null,
      },
    });
  }

  async updateAdmin(id: string, dto: UpdateCouponDto): Promise<Coupon> {
    await this.prisma.coupon.findUniqueOrThrow({ where: { id } });
    const data: Prisma.CouponUpdateInput = {};
    if (dto.percentOff !== undefined) data.percentOff = dto.percentOff;
    if (dto.active !== undefined) data.active = dto.active;
    if (dto.maxUses !== undefined) data.maxUses = dto.maxUses;
    return this.prisma.coupon.update({ where: { id }, data });
  }

  async analytics() {
    const [agg, byCouponRows, recent] = await Promise.all([
      this.prisma.order.aggregate({
        where: { couponId: { not: null } },
        _sum: { couponDiscountAmount: true },
        _count: true,
      }),
      this.prisma.order.groupBy({
        by: ["couponId"],
        where: { couponId: { not: null } },
        _sum: { couponDiscountAmount: true },
        _count: true,
      }),
      this.prisma.order.findMany({
        where: { couponId: { not: null }, couponDiscountAmount: { gt: 0 } },
        select: {
          id: true,
          email: true,
          couponDiscountAmount: true,
          couponCodeSnapshot: true,
          couponId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    ]);

    const couponIds = byCouponRows.map((r) => r.couponId).filter(Boolean) as string[];
    const coupons = await this.prisma.coupon.findMany({
      where: { id: { in: couponIds } },
    });
    const couponMap = new Map(coupons.map((c) => [c.id, c]));

    const byCoupon = byCouponRows.map((row) => {
      const c = row.couponId ? couponMap.get(row.couponId) : undefined;
      return {
        couponId: row.couponId,
        code: c?.code ?? "—",
        percentOff: c != null ? Number(c.percentOff) : null,
        active: c?.active ?? null,
        redemptionCount: row._count,
        totalDiscount: Number(row._sum.couponDiscountAmount ?? 0),
      };
    });

    return {
      summary: {
        totalDiscountAllTime: Number(agg._sum.couponDiscountAmount ?? 0),
        totalRedemptions: agg._count,
      },
      byCoupon,
      recentRedemptions: recent.map((o) => ({
        orderId: o.id,
        email: o.email,
        code: o.couponCodeSnapshot,
        discount: Number(o.couponDiscountAmount),
        createdAt: o.createdAt.toISOString(),
      })),
    };
  }
}
