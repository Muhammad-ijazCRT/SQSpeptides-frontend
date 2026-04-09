import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Decimal } from "../generated/prisma-client/runtime/library";
import { AffiliatePayoutResolveDto } from "../admin/dto/affiliate-payout-resolve.dto";
import { AffiliatePayoutRequestDto } from "../customer-portal/dto/affiliate-payout-request.dto";
import { PrismaService } from "../prisma/prisma.service";

const SETTINGS_ID = "default";
export const MIN_AFFILIATE_COMMISSION_PERCENT = 10;
const MAX_AFFILIATE_COMMISSION_PERCENT = 100;

@Injectable()
export class AffiliateService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureSiteSettings() {
    await this.prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, affiliateCommissionPercent: 10 },
      update: {},
    });
  }

  async getSettings() {
    await this.ensureSiteSettings();
    const s = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
    return { affiliateCommissionPercent: Number(s.affiliateCommissionPercent) };
  }

  async updateCommissionPercent(percent: number) {
    if (percent < MIN_AFFILIATE_COMMISSION_PERCENT || percent > MAX_AFFILIATE_COMMISSION_PERCENT) {
      throw new BadRequestException(
        `Commission must be between ${MIN_AFFILIATE_COMMISSION_PERCENT}% and ${MAX_AFFILIATE_COMMISSION_PERCENT}%.`,
      );
    }
    await this.ensureSiteSettings();
    await this.prisma.siteSettings.update({
      where: { id: SETTINGS_ID },
      data: { affiliateCommissionPercent: percent },
    });
    return this.getSettings();
  }

  private genAffiliateCode(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  async ensureAffiliateCode(customerId: string): Promise<string> {
    const c = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!c) throw new NotFoundException();
    if (c.affiliateCode) return c.affiliateCode;
    for (let i = 0; i < 25; i++) {
      const code = this.genAffiliateCode();
      try {
        const updated = await this.prisma.customer.update({
          where: { id: customerId },
          data: { affiliateCode: code },
        });
        return updated.affiliateCode!;
      } catch {
        /* unique collision */
      }
    }
    throw new BadRequestException("Could not assign affiliate code");
  }

  async getAffiliateMe(customerId: string) {
    const code = await this.ensureAffiliateCode(customerId);
    const [customer, earnings, payoutRequests, settings] = await Promise.all([
      this.prisma.customer.findUniqueOrThrow({
        where: { id: customerId },
        select: { affiliateBalance: true },
      }),
      this.prisma.affiliateEarning.findMany({
        where: { affiliateId: customerId },
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { order: { select: { id: true, email: true, createdAt: true, total: true } } },
      }),
      this.prisma.affiliatePayoutRequest.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      this.getSettings(),
    ]);

    const balance = Number(customer.affiliateBalance);
    const totalEarned = earnings.reduce((s, e) => s + Number(e.amount), 0);
    const startMonth = new Date();
    startMonth.setDate(1);
    startMonth.setHours(0, 0, 0, 0);
    const thisMonthEarned = earnings
      .filter((e) => e.createdAt >= startMonth)
      .reduce((s, e) => s + Number(e.amount), 0);

    const pendingAgg = await this.prisma.affiliatePayoutRequest.aggregate({
      where: { customerId, status: "pending" },
      _sum: { amount: true },
    });
    const pendingPayoutHold = Number(pendingAgg._sum.amount ?? 0);

    return {
      affiliateCode: code,
      shareUrlPath: `/?ref=${encodeURIComponent(code)}`,
      balance,
      availableAfterPending: Math.max(0, balance - pendingPayoutHold),
      pendingPayoutHold,
      commissionPercentGlobal: settings.affiliateCommissionPercent,
      analytics: {
        totalEarned,
        referralOrderCount: earnings.length,
        thisMonthEarned,
      },
      earnings: earnings.map((e) => ({
        id: e.id,
        orderId: e.orderId,
        amount: Number(e.amount),
        commissionPercent: Number(e.commissionPercent),
        orderSubtotal: Number(e.orderSubtotal),
        createdAt: e.createdAt.toISOString(),
        orderEmail: e.order.email,
      })),
      payoutRequests: payoutRequests.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        status: p.status,
        note: p.note,
        cryptoNetwork: p.cryptoNetwork ?? "",
        cryptoAddress: p.cryptoAddress ?? "",
        rejectionReason: p.status === "rejected" ? p.rejectionReason : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    };
  }

  async createPayoutRequest(customerId: string, dto: AffiliatePayoutRequestDto) {
    const amount = dto.amount;
    const cryptoNetwork = dto.cryptoNetwork.trim();
    const cryptoAddress = dto.cryptoAddress.trim();
    if (!cryptoNetwork || !cryptoAddress) {
      throw new BadRequestException("Crypto network and address are required.");
    }
    if (!(amount > 0)) throw new BadRequestException("Amount must be positive");
    const c = await this.prisma.customer.findUniqueOrThrow({ where: { id: customerId } });
    const bal = Number(c.affiliateBalance);
    const pendingAgg = await this.prisma.affiliatePayoutRequest.aggregate({
      where: { customerId, status: "pending" },
      _sum: { amount: true },
    });
    const pending = Number(pendingAgg._sum.amount ?? 0);
    const available = bal - pending;
    if (amount > available + 1e-9) {
      throw new BadRequestException("Amount exceeds available balance (after pending requests).");
    }
    return this.prisma.affiliatePayoutRequest.create({
      data: {
        customerId,
        amount: new Decimal(amount),
        note: dto.note?.trim() || null,
        cryptoNetwork,
        cryptoAddress,
      },
    });
  }

  async listPayoutRequestsAdmin() {
    const rows = await this.prisma.affiliatePayoutRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        customer: { select: { id: true, email: true, name: true, affiliateBalance: true, affiliateCode: true } },
      },
    });
    return rows.map((r) => ({
      id: r.id,
      customerId: r.customerId,
      amount: Number(r.amount),
      status: r.status,
      note: r.note,
      adminNote: r.adminNote,
      cryptoNetwork: r.cryptoNetwork,
      cryptoAddress: r.cryptoAddress,
      rejectionReason: r.rejectionReason,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      customer: r.customer
        ? {
            id: r.customer.id,
            email: r.customer.email,
            name: r.customer.name,
            affiliateCode: r.customer.affiliateCode,
            affiliateBalance: Number(r.customer.affiliateBalance),
          }
        : null,
    }));
  }

  async updatePayoutRequestAdmin(id: string, dto: AffiliatePayoutResolveDto) {
    const { status } = dto;
    const row = await this.prisma.affiliatePayoutRequest.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    if (row.status !== "pending") throw new BadRequestException("Request already resolved");

    const adminNote = dto.adminNote?.trim() || null;

    if (status === "paid") {
      await this.prisma.$transaction(async (tx) => {
        const cust = await tx.customer.findUniqueOrThrow({ where: { id: row.customerId } });
        const amt = new Decimal(row.amount);
        if (cust.affiliateBalance.lessThan(amt)) {
          throw new BadRequestException("Customer balance is insufficient to mark this payout paid.");
        }
        await tx.customer.update({
          where: { id: row.customerId },
          data: { affiliateBalance: { decrement: amt } },
        });
        await tx.affiliatePayoutRequest.update({
          where: { id },
          data: { status: "paid", adminNote },
        });
      });
      return this.prisma.affiliatePayoutRequest.findUnique({ where: { id } });
    }

    if (status === "rejected") {
      const rejectionReason = dto.rejectionReason?.trim();
      if (!rejectionReason) {
        throw new BadRequestException("Rejection reason is required (shown to the affiliate).");
      }
      return this.prisma.affiliatePayoutRequest.update({
        where: { id },
        data: { status: "rejected", rejectionReason, adminNote },
      });
    }

    throw new BadRequestException('Use status "paid" or "rejected".');
  }
}
