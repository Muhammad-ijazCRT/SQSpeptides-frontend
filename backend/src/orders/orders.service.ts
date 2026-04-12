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
import { ZelleVerifyOrderDto } from "../admin/dto/zelle-verify-order.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { SubmitZelleProofDto } from "./dto/submit-zelle-proof.dto";

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
  paymentProvider?: string | null;
  paymentCompletion?: string;
  zelleTransactionId?: string | null;
  zelleProofUrl?: string | null;
  zelleSubmittedAt?: Date | null;
  zelleRejectionNote?: string | null;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: unknown;
    product: { id: string; name: string; slug: string; imageUrl: string | null };
  }[];
  payments?: {
    id: string;
    provider: string;
    externalId: string | null;
    amountUsd: unknown;
    status: string;
    createdAt: Date;
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
    paymentProvider: o.paymentProvider ?? null,
    paymentCompletion: o.paymentCompletion ?? "paid",
    zelleTransactionId: o.zelleTransactionId ?? null,
    zelleProofUrl: o.zelleProofUrl ?? null,
    zelleSubmittedAt: o.zelleSubmittedAt?.toISOString() ?? null,
    zelleRejectionNote: o.zelleRejectionNote ?? null,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      price: Number(i.price),
      product: i.product,
    })),
    payments: (o.payments ?? []).map((p) => ({
      id: p.id,
      provider: p.provider,
      externalId: p.externalId,
      amountUsd: Number(p.amountUsd),
      status: p.status,
      createdAt: p.createdAt.toISOString(),
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
    const payProvider = dto.paymentProvider ?? "crossmint";
    if (payProvider === "zelle") {
      await this.affiliate.ensureSiteSettings();
      const s = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: "default" } });
      const zelleOk = Boolean(s.zelleEmail?.trim() || s.zellePhone?.trim());
      if (!zelleOk) {
        throw new BadRequestException("Zelle checkout is not configured. Contact the store.");
      }
    }
    if ((payProvider === "nowpayments" || payProvider === "zelle") && (dto.storeCreditToUse ?? 0) > 0) {
      throw new BadRequestException(
        "Affiliate balance cannot be used with this payment method. Choose card payment or remove the balance amount."
      );
    }

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
          paymentProvider: payProvider,
          paymentCompletion:
            payProvider === "nowpayments" || payProvider === "zelle" ? "awaiting_payment" : "paid",
          items: {
            create: creates.map((c) => ({
              productId: c.productId,
              quantity: c.quantity,
              price: c.price,
            })),
          },
        },
      });

      if (payProvider !== "nowpayments" && payProvider !== "zelle") {
        await this.affiliate.applyReferralCommissionForOrder(created.id, tx);
      }

      return { created, merchandiseTotal, storeCredit };
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
      paymentProvider: order.created.paymentProvider,
      paymentCompletion: order.created.paymentCompletion,
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
        payments: { orderBy: { createdAt: "desc" }, take: 10 },
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
        payments: { orderBy: { createdAt: "desc" }, take: 20 },
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
        payments: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
    if (!order) throw new NotFoundException();
    const byAccount = order.customerId === customerId;
    const byGuestEmail =
      order.customerId == null && order.email.toLowerCase() === normalized;
    if (!byAccount && !byGuestEmail) throw new ForbiddenException();
    return serializeOrder(order);
  }

  async getZelleStorefrontConfig() {
    await this.affiliate.ensureSiteSettings();
    const s = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: "default" } });
    const zelleEmail = s.zelleEmail?.trim() || null;
    const zellePhone = s.zellePhone?.trim() || null;
    return {
      enabled: Boolean(zelleEmail || zellePhone),
      zelleEmail,
      zellePhone,
    };
  }

  async submitZelleProof(dto: SubmitZelleProofDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const proofUrl = dto.proofUrl.trim();
    if (!proofUrl.startsWith("/uploads/zelle/")) {
      throw new BadRequestException("Invalid payment proof URL.");
    }
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId.trim() } });
    if (!order) throw new NotFoundException("Order not found.");
    if (order.email.toLowerCase() !== normalizedEmail) {
      throw new ForbiddenException("Email does not match this order.");
    }
    if (order.paymentProvider !== "zelle") {
      throw new BadRequestException("This order does not use Zelle.");
    }
    if (order.paymentCompletion !== "awaiting_payment") {
      throw new BadRequestException("This order is not waiting for Zelle payment proof.");
    }
    if (order.zelleSubmittedAt) {
      throw new BadRequestException("Payment proof was already submitted for this order.");
    }
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        zelleTransactionId: dto.transactionId.trim(),
        zelleProofUrl: proofUrl,
        zelleSubmittedAt: new Date(),
        paymentCompletion: "zelle_pending_review",
      },
    });
    return { ok: true as const };
  }

  async adminVerifyZelle(orderId: string, dto: ZelleVerifyOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException();
    if (order.paymentProvider !== "zelle") {
      throw new BadRequestException("Not a Zelle order.");
    }
    if (order.paymentCompletion !== "zelle_pending_review") {
      throw new BadRequestException(
        "Order is not awaiting Zelle verification (current status: " + order.paymentCompletion + ")."
      );
    }
    if (dto.action === "approve") {
      await this.prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: { paymentCompletion: "paid", zelleRejectionNote: null },
        });
        await this.affiliate.applyReferralCommissionForOrder(orderId, tx);
      });
      return { ok: true as const, paymentCompletion: "paid" as const };
    }
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentCompletion: "zelle_rejected",
        zelleRejectionNote: dto.note?.trim() || null,
        status: "cancelled",
      },
    });
    return { ok: true as const, paymentCompletion: "zelle_rejected" as const };
  }
}
