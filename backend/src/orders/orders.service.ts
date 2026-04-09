import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Decimal } from "../generated/prisma-client/runtime/library";
import { AffiliateService } from "../affiliate/affiliate.service";
import { CouponsService } from "../coupons/coupons.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";

function serializeOrder(o: {
  id: string;
  email: string;
  fullName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  researchUseAttestation: string;
  total: unknown;
  storeCreditUsed?: unknown;
  couponDiscountAmount?: unknown;
  couponCodeSnapshot?: string | null;
  status: string;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: unknown;
    product: { id: string; name: string; slug: string; imageUrl: string | null };
  }[];
}) {
  const total = Number(o.total);
  const storeCreditUsed = Number(o.storeCreditUsed ?? 0);
  const couponDiscountAmount = Number(o.couponDiscountAmount ?? 0);
  return {
    id: o.id,
    email: o.email,
    fullName: o.fullName,
    addressLine1: o.addressLine1,
    city: o.city,
    postalCode: o.postalCode,
    country: o.country,
    researchUseAttestation: o.researchUseAttestation,
    total,
    storeCreditUsed,
    couponDiscountAmount,
    couponCodeSnapshot: o.couponCodeSnapshot ?? null,
    cardAmountDue: Math.max(0, Math.round((total - storeCreditUsed) * 100) / 100),
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      price: Number(i.price),
      product: i.product,
    })),
  };
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly affiliate: AffiliateService,
    private readonly coupons: CouponsService
  ) {}

  async create(dto: CreateOrderDto, customerId?: string | null) {
    const creates: { productId: string; quantity: number; price: Decimal }[] = [];
    let subtotal = 0;

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Unknown product: ${item.productId}`);
      }
      const unit = Number(product.price);
      subtotal += unit * item.quantity;
      creates.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;

    let affiliateReferrerId: string | null = null;
    const refRaw = dto.affiliateRef?.trim();
    if (refRaw) {
      const ref = refRaw.toLowerCase();
      const referrer = await this.prisma.customer.findFirst({
        where: { affiliateCode: { equals: ref, mode: "insensitive" } },
      });
      if (referrer) {
        const buyerEmail = dto.email.toLowerCase();
        const selfPurchase = referrer.email.toLowerCase() === buyerEmail;
        const selfAccount = Boolean(customerId && referrer.id === customerId);
        if (!selfPurchase && !selfAccount) {
          affiliateReferrerId = referrer.id;
        }
      }
    }

    await this.affiliate.ensureSiteSettings();
    const { affiliateCommissionPercent: rate } = await this.affiliate.getSettings();

    const order = await this.prisma.$transaction(async (tx) => {
      const couponPart = await this.coupons.resolveForOrder(dto.couponCode, subtotal, tx);
      const couponDiscount = couponPart.couponDiscountAmount;
      const merchandiseTotal = Math.round((subtotal - couponDiscount) * 100) / 100;

      let storeCredit = dto.storeCreditToUse ?? 0;
      if (storeCredit < 0) throw new BadRequestException("Invalid store credit amount.");
      storeCredit = Math.round(storeCredit * 100) / 100;
      if (storeCredit > merchandiseTotal) storeCredit = merchandiseTotal;

      if (storeCredit > 0) {
        if (!customerId) {
          throw new BadRequestException("Sign in to pay with affiliate earnings balance.");
        }
        const buyer = await tx.customer.findUniqueOrThrow({ where: { id: customerId } });
        const dec = new Decimal(storeCredit);
        if (buyer.affiliateBalance.lessThan(dec)) {
          throw new BadRequestException("Insufficient affiliate balance.");
        }
        await tx.customer.update({
          where: { id: customerId },
          data: { affiliateBalance: { decrement: dec } },
        });
      }

      const commissionRaw = affiliateReferrerId ? (merchandiseTotal * rate) / 100 : 0;
      const commission = Math.round(commissionRaw * 100) / 100;

      const created = await tx.order.create({
        data: {
          customerId: customerId ?? undefined,
          email: dto.email.toLowerCase(),
          fullName: dto.fullName,
          addressLine1: dto.addressLine1,
          city: dto.city,
          postalCode: dto.postalCode,
          country: dto.country,
          researchUseAttestation: dto.researchUseAttestation,
          total: merchandiseTotal,
          storeCreditUsed: new Decimal(storeCredit),
          affiliateReferrerId,
          couponId: couponPart.couponId ?? undefined,
          couponCodeSnapshot: couponPart.couponCodeSnapshot ?? undefined,
          couponDiscountAmount: new Decimal(couponDiscount),
          items: {
            create: creates.map((c) => ({
              productId: c.productId,
              quantity: c.quantity,
              price: c.price,
            })),
          },
        },
      });

      if (affiliateReferrerId && commission > 0) {
        await tx.affiliateEarning.create({
          data: {
            affiliateId: affiliateReferrerId,
            orderId: created.id,
            orderSubtotal: merchandiseTotal,
            commissionPercent: rate,
            amount: commission,
          },
        });
        await tx.customer.update({
          where: { id: affiliateReferrerId },
          data: { affiliateBalance: { increment: new Decimal(commission) } },
        });
      }

      return { created, merchandiseTotal, storeCredit, commission };
    });

    const cardDue = order.merchandiseTotal - order.storeCredit;

    return {
      id: order.created.id,
      email: order.created.email,
      total: order.merchandiseTotal,
      storeCreditUsed: order.storeCredit,
      couponDiscountAmount: Number(order.created.couponDiscountAmount),
      couponCodeSnapshot: order.created.couponCodeSnapshot,
      cardAmountDue: Math.max(0, Math.round(cardDue * 100) / 100),
      status: order.created.status,
      createdAt: order.created.createdAt.toISOString(),
    };
  }

  async findAll() {
    const rows = await this.prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, imageUrl: true } },
          },
        },
      },
    });
    return rows.map((o) => serializeOrder(o));
  }

  async findMyOrders(customerId: string, email: string) {
    const normalized = email.toLowerCase();
    const rows = await this.prisma.order.findMany({
      where: {
        OR: [
          { customerId },
          {
            AND: [
              { customerId: null },
              { email: { equals: normalized, mode: "insensitive" } },
            ],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, imageUrl: true } },
          },
        },
      },
    });
    return rows.map((o) => serializeOrder(o));
  }

  async findOneForCustomer(orderId: string, customerId: string, email: string) {
    const normalized = email.toLowerCase();
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, imageUrl: true } },
          },
        },
      },
    });
    if (!order) throw new NotFoundException();
    const byAccount = order.customerId === customerId;
    const byGuestEmail =
      order.customerId == null && order.email.toLowerCase() === normalized;
    if (!byAccount && !byGuestEmail) throw new ForbiddenException();
    return serializeOrder(order);
  }
}
