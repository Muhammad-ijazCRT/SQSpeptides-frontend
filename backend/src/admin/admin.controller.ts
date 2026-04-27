import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AffiliateService } from "../affiliate/affiliate.service";
import { AdminJwtGuard } from "../auth/guards/admin-jwt.guard";
import { CreateCouponDto } from "../coupons/dto/create-coupon.dto";
import { UpdateCouponDto } from "../coupons/dto/update-coupon.dto";
import { CouponsService } from "../coupons/coupons.service";
import type { Prisma } from "../generated/prisma-client";
import { PrismaService } from "../prisma/prisma.service";
import { AffiliatePayoutResolveDto } from "./dto/affiliate-payout-resolve.dto";
import { UpdateAffiliateSettingsDto } from "./dto/affiliate-settings.dto";
import { OrdersService } from "../orders/orders.service";
import { UpdatePaymentSettingsDto } from "./dto/update-payment-settings.dto";
import { ZelleVerifyOrderDto } from "./dto/zelle-verify-order.dto";
import { CreateProductDto } from "../products/dto/create-product.dto";
import { UpdateProductDto } from "../products/dto/update-product.dto";
import { ProductsService } from "../products/products.service";

@Controller("admin")
@UseGuards(AdminJwtGuard)
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly products: ProductsService,
    private readonly affiliate: AffiliateService,
    private readonly coupons: CouponsService,
    private readonly orders: OrdersService
  ) {}

  @Get("overview")
  async overview() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const [
      orderCount,
      productCount,
      customerCount,
      revenueAll,
      ordersToday,
      ordersThisMonth,
      pendingOrders,
      completedOrderCount,
      completedRevenue,
      customersNewToday,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.customer.count(),
      this.prisma.order.aggregate({ _sum: { total: true } }),
      this.prisma.order.count({
        where: { createdAt: { gte: startOfDay, lt: endOfDay } },
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      this.prisma.order.count({ where: { status: "pending" } }),
      this.prisma.order.count({
        where: { OR: [{ status: "completed" }, { status: "shipped" }] },
      }),
      this.prisma.order.aggregate({
        where: { OR: [{ status: "completed" }, { status: "shipped" }] },
        _sum: { total: true },
      }),
      this.prisma.customer.count({
        where: { createdAt: { gte: startOfDay, lt: endOfDay } },
      }),
    ]);

    return {
      orderCount,
      productCount,
      customerCount,
      revenueTotal: Number(revenueAll._sum.total ?? 0),
      ordersToday,
      ordersThisMonth,
      pendingOrders,
      completedOrderCount,
      revenueFromCompleted: Number(completedRevenue._sum.total ?? 0),
      customersNewToday,
    };
  }

  @Get("customers")
  listCustomers() {
    return this.prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  @Get("products")
  listProducts() {
    return this.products.findAll();
  }

  @Post("products")
  createProduct(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Patch("products/:id")
  updateProduct(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.products.update(id, dto);
  }

  @Delete("products/:id")
  deleteProduct(@Param("id") id: string) {
    return this.products.remove(id);
  }

  @Get("affiliate/settings")
  getAffiliateSettings() {
    return this.affiliate.getSettings();
  }

  @Patch("affiliate/settings")
  patchAffiliateSettings(@Body() dto: UpdateAffiliateSettingsDto) {
    return this.affiliate.updateCommissionPercent(dto.affiliateCommissionPercent);
  }

  private maskSecret(v: string | null | undefined): string | null {
    const t = v?.trim();
    if (!t) return null;
    if (t.length <= 4) return "••••";
    return `••••${t.slice(-4)}`;
  }

  @Get("payment-settings")
  async getPaymentSettings() {
    await this.affiliate.ensureSiteSettings();
    const s = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: "default" } });
    return {
      nowpaymentsApiKeyMasked: this.maskSecret(s.nowpaymentsApiKey),
      nowpaymentsPublicKeyMasked: this.maskSecret(s.nowpaymentsPublicKey),
      nowpaymentsSandbox: s.nowpaymentsSandbox,
      nowpaymentsConfigured: Boolean(s.nowpaymentsApiKey?.trim() && s.nowpaymentsPublicKey?.trim()),
      zelleEmail: s.zelleEmail?.trim() || null,
      zellePhone: s.zellePhone?.trim() || null,
      zelleConfigured: Boolean(s.zelleEmail?.trim() || s.zellePhone?.trim()),
      mailHost: s.mailHost?.trim() || null,
      mailPort: s.mailPort ?? null,
      mailSecure: s.mailSecure,
      mailUser: s.mailUser?.trim() || null,
      mailPasswordMasked: this.maskSecret(s.mailPassword),
      mailFrom: s.mailFrom?.trim() || null,
      mailConfigured: Boolean(s.mailHost?.trim() && s.mailFrom?.trim()),
    };
  }

  @Patch("payment-settings")
  async patchPaymentSettings(@Body() dto: UpdatePaymentSettingsDto) {
    await this.affiliate.ensureSiteSettings();
    const data: Prisma.SiteSettingsUpdateInput = {};
    if (dto.nowpaymentsApiKey !== undefined) {
      data.nowpaymentsApiKey = dto.nowpaymentsApiKey.trim() || null;
    }
    if (dto.nowpaymentsPublicKey !== undefined) {
      data.nowpaymentsPublicKey = dto.nowpaymentsPublicKey.trim() || null;
    }
    if (dto.nowpaymentsSandbox !== undefined) {
      data.nowpaymentsSandbox = dto.nowpaymentsSandbox;
    }
    if (dto.zelleEmail !== undefined) {
      data.zelleEmail = dto.zelleEmail.trim() || null;
    }
    if (dto.zellePhone !== undefined) {
      data.zellePhone = dto.zellePhone.trim() || null;
    }
    if (dto.mailHost !== undefined) {
      data.mailHost = dto.mailHost?.trim() ? dto.mailHost.trim() : null;
    }
    if (dto.mailPort !== undefined) {
      data.mailPort = dto.mailPort;
    }
    if (dto.mailSecure !== undefined) {
      data.mailSecure = dto.mailSecure;
    }
    if (dto.mailUser !== undefined) {
      data.mailUser = dto.mailUser.trim() || null;
    }
    if (dto.mailPassword !== undefined) {
      const p = dto.mailPassword.trim();
      data.mailPassword = p ? p : null;
    }
    if (dto.mailFrom !== undefined) {
      data.mailFrom = dto.mailFrom?.trim() ? dto.mailFrom.trim() : null;
    }
    await this.prisma.siteSettings.update({ where: { id: "default" }, data });
    return this.getPaymentSettings();
  }

  @Patch("orders/:id/zelle")
  verifyZelleOrder(@Param("id") id: string, @Body() dto: ZelleVerifyOrderDto) {
    return this.orders.adminVerifyZelle(id, dto);
  }

  @Get("affiliate/payout-requests")
  listAffiliatePayoutRequests() {
    return this.affiliate.listPayoutRequestsAdmin();
  }

  @Patch("affiliate/payout-requests/:id")
  resolveAffiliatePayout(@Param("id") id: string, @Body() dto: AffiliatePayoutResolveDto) {
    return this.affiliate.updatePayoutRequestAdmin(id, dto);
  }

  @Get("coupons/analytics")
  couponAnalytics() {
    return this.coupons.analytics();
  }

  @Get("coupons")
  listCoupons() {
    return this.coupons.listAdmin();
  }

  @Post("coupons")
  createCoupon(@Body() dto: CreateCouponDto) {
    return this.coupons.createAdmin(dto);
  }

  @Patch("coupons/:id")
  updateCoupon(@Param("id") id: string, @Body() dto: UpdateCouponDto) {
    return this.coupons.updateAdmin(id, dto);
  }
}
