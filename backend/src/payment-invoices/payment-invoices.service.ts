import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { randomBytes } from "crypto";
import type { Prisma } from "../generated/prisma-client";
import { Decimal } from "../generated/prisma-client/runtime/library";
import { MailService } from "../mail/mail.service";
import { NowpaymentsService } from "../nowpayments/nowpayments.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentInvoiceDto } from "./dto/create-payment-invoice.dto";
import { MarkExternalPaidDto } from "./dto/mark-external-paid.dto";
import { SubmitPaymentInvoiceZelleProofDto } from "./dto/submit-payment-invoice-zelle-proof.dto";

const SETTINGS_ID = "default";

function newPublicToken(): string {
  return randomBytes(18).toString("base64url");
}

function storefrontOrigin(): string {
  return (process.env.FRONTEND_ORIGIN ?? "http://localhost:3000").replace(/\/$/, "");
}

@Injectable()
export class PaymentInvoicesService {
  private readonly log = new Logger(PaymentInvoicesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly nowpayments: NowpaymentsService
  ) {}

  async listForAdmin() {
    const rows = await this.prisma.paymentInvoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return rows.map((r) => this.toAdminResponse(r));
  }

  async notificationsForAdmin() {
    const rows = await this.prisma.paymentInvoice.findMany({
      where: { status: "paid", paidAt: { not: null } },
      orderBy: { paidAt: "desc" },
      take: 25,
      select: {
        id: true,
        publicToken: true,
        customerEmail: true,
        amount: true,
        currency: true,
        gatewayLabel: true,
        paidAt: true,
        gatewayType: true,
      },
    });
    return rows.map((r) => ({
      id: r.id,
      type: "invoice_paid" as const,
      paidAt: r.paidAt!.toISOString(),
      amount: Number(r.amount),
      currency: r.currency,
      customerEmail: r.customerEmail,
      gatewayLabel: r.gatewayLabel,
      gatewayType: r.gatewayType,
      publicToken: r.publicToken,
    }));
  }

  async create(dto: CreatePaymentInvoiceDto) {
    const currency = (dto.currency ?? "usd").toLowerCase().trim();
    if (!/^[a-z]{3}$/.test(currency)) {
      throw new BadRequestException("currency must be a 3-letter ISO code.");
    }

    const publicToken = newPublicToken();
    const amount = new Decimal(dto.amount);

    if (dto.gatewayType === "external") {
      const url = dto.externalCheckoutUrl?.trim() ?? "";
      if (!/^https:\/\//i.test(url)) {
        throw new BadRequestException("externalCheckoutUrl must be an https:// payment link.");
      }
      const inv = await this.prisma.paymentInvoice.create({
        data: {
          publicToken,
          gatewayType: "external",
          gatewayLabel: dto.gatewayLabel.trim(),
          amount,
          currency,
          description: dto.description?.trim() || null,
          customerEmail: dto.customerEmail.toLowerCase().trim(),
          customerName: dto.customerName?.trim() || null,
          checkoutUrl: url,
          status: "pending",
        },
      });
      return this.toAdminResponse(inv);
    }

    if (dto.gatewayType === "zelle") {
      await this.prisma.siteSettings.upsert({
        where: { id: SETTINGS_ID },
        create: { id: SETTINGS_ID, affiliateCommissionPercent: 10 },
        update: {},
      });
      const s = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
      const hasZelle = Boolean(s.zelleEmail?.trim() || s.zellePhone?.trim());
      if (!hasZelle) {
        throw new BadRequestException("Configure Zelle email and/or phone in Store settings before creating a Zelle invoice link.");
      }
      const inv = await this.prisma.paymentInvoice.create({
        data: {
          publicToken,
          gatewayType: "zelle",
          gatewayLabel: dto.gatewayLabel.trim(),
          amount,
          currency,
          description: dto.description?.trim() || null,
          customerEmail: dto.customerEmail.toLowerCase().trim(),
          customerName: dto.customerName?.trim() || null,
          status: "pending",
        },
      });
      return this.toAdminResponse(inv);
    }

    // nowpayments
    if (currency !== "usd") {
      throw new BadRequestException("NOWPayments invoice links currently support USD only.");
    }
    const npOk = await this.nowpayments.isConfigured();
    if (!npOk) {
      throw new BadRequestException("NOWPayments is not configured (API key and public key required in Store settings).");
    }

    const origin = storefrontOrigin();
    const invRow = await this.prisma.paymentInvoice.create({
      data: {
        publicToken,
        gatewayType: "nowpayments",
        gatewayLabel: dto.gatewayLabel.trim(),
        amount,
        currency,
        description: dto.description?.trim() || null,
        customerEmail: dto.customerEmail.toLowerCase().trim(),
        customerName: dto.customerName?.trim() || null,
        status: "pending",
      },
    });

    const desc = dto.description?.trim() || `Payment ${invRow.publicToken.slice(0, 8)}`;
    const successUrl = `${origin}/pay/${invRow.publicToken}/crypto-success?confirmEmail=${encodeURIComponent(invRow.customerEmail)}`;
    const cancelUrl = `${origin}/pay/${invRow.publicToken}?cancelled=1`;

    try {
      const { invoiceUrl, npInvoiceId } = await this.nowpayments.createPaymentLinkInvoice({
        amountUsd: Number(dto.amount),
        orderDescription: desc,
        orderIdForNp: `payinv_${invRow.id}`,
        successUrl,
        cancelUrl,
      });

      const inv = await this.prisma.paymentInvoice.update({
        where: { id: invRow.id },
        data: {
          checkoutUrl: invoiceUrl,
          nowpaymentsInvoiceId: npInvoiceId,
        },
      });
      return this.toAdminResponse(inv);
    } catch (e) {
      await this.prisma.paymentInvoice.delete({ where: { id: invRow.id } }).catch(() => undefined);
      throw e;
    }
  }

  private toAdminResponse(inv: {
    id: string;
    publicToken: string;
    gatewayType: string;
    gatewayLabel: string;
    amount: Prisma.Decimal;
    currency: string;
    description: string | null;
    customerEmail: string;
    customerName: string | null;
    checkoutUrl: string | null;
    nowpaymentsInvoiceId: string | null;
    zelleTransactionId: string | null;
    zelleProofUrl: string | null;
    zelleSubmittedAt: Date | null;
    status: string;
    paidAt: Date | null;
    paymentDetails: Prisma.JsonValue | null;
    confirmationEmailSentAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const shareUrl = `${storefrontOrigin()}/pay/${inv.publicToken}`;
    return {
      id: inv.id,
      publicToken: inv.publicToken,
      gatewayType: inv.gatewayType,
      gatewayLabel: inv.gatewayLabel,
      amount: Number(inv.amount),
      currency: inv.currency,
      description: inv.description,
      customerEmail: inv.customerEmail,
      customerName: inv.customerName,
      checkoutUrl: inv.checkoutUrl,
      nowpaymentsInvoiceId: inv.nowpaymentsInvoiceId,
      zelleTransactionId: inv.zelleTransactionId,
      zelleProofUrl: inv.zelleProofUrl,
      zelleSubmittedAt: inv.zelleSubmittedAt?.toISOString() ?? null,
      status: inv.status,
      paidAt: inv.paidAt,
      paymentDetails: inv.paymentDetails,
      confirmationEmailSentAt: inv.confirmationEmailSentAt,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt,
      shareUrl,
    };
  }

  async getPublicByToken(token: string) {
    const inv = await this.prisma.paymentInvoice.findUnique({
      where: { publicToken: token },
    });
    if (!inv) throw new NotFoundException("Invoice link not found.");

    const base = {
      publicToken: inv.publicToken,
      status: inv.status,
      amount: Number(inv.amount),
      currency: inv.currency,
      gatewayLabel: inv.gatewayLabel,
      gatewayType: inv.gatewayType,
      description: inv.description,
      checkoutUrl: inv.status === "pending" ? inv.checkoutUrl : null,
      customerEmailMasked: maskEmail(inv.customerEmail),
    };

    if (inv.gatewayType === "zelle" && inv.status === "pending") {
      await this.prisma.siteSettings.upsert({
        where: { id: SETTINGS_ID },
        create: { id: SETTINGS_ID, affiliateCommissionPercent: 10 },
        update: {},
      });
      const s = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
      return {
        ...base,
        zellePayeeEmail: s.zelleEmail?.trim() || null,
        zellePayeePhone: s.zellePhone?.trim() || null,
        memoReference: `PAY-${inv.publicToken.slice(-10).toUpperCase()}`,
        zelleProofSubmitted: Boolean(inv.zelleSubmittedAt),
      };
    }

    return base;
  }

  async submitZelleProof(publicToken: string, dto: SubmitPaymentInvoiceZelleProofDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const proofUrl = dto.proofUrl.trim();
    if (!proofUrl.startsWith("/uploads/zelle/")) {
      throw new BadRequestException("Invalid payment proof URL.");
    }

    const inv = await this.prisma.paymentInvoice.findUnique({ where: { publicToken } });
    if (!inv) throw new NotFoundException("Invoice link not found.");
    if (inv.gatewayType !== "zelle") {
      throw new BadRequestException("This link is not a Zelle invoice.");
    }
    if (inv.status !== "pending") {
      throw new BadRequestException("This invoice is not awaiting payment.");
    }
    if (inv.customerEmail.toLowerCase() !== normalizedEmail) {
      throw new BadRequestException("Email does not match this payment link.");
    }
    if (inv.zelleSubmittedAt) {
      throw new BadRequestException("Payment proof was already submitted for this invoice.");
    }

    await this.prisma.paymentInvoice.update({
      where: { id: inv.id },
      data: {
        zelleTransactionId: dto.transactionId.trim(),
        zelleProofUrl: proofUrl,
        zelleSubmittedAt: new Date(),
      },
    });

    return { ok: true as const };
  }

  async syncNowpayments(token: string, email: string) {
    const inv = await this.prisma.paymentInvoice.findUnique({ where: { publicToken: token } });
    if (!inv) throw new NotFoundException("Invoice link not found.");
    if (inv.gatewayType !== "nowpayments") {
      throw new BadRequestException("This invoice is not a NOWPayments link.");
    }
    if (inv.customerEmail.toLowerCase() !== email.toLowerCase().trim()) {
      throw new BadRequestException("Email does not match this payment link.");
    }
    if (inv.status === "paid") {
      return { status: "paid" as const, updated: false };
    }

    const npId = inv.nowpaymentsInvoiceId?.trim();
    if (!npId) {
      return { status: inv.status, updated: false, message: "No NOWPayments invoice is linked yet." };
    }

    const { ok, paid, payload, message } = await this.nowpayments.getInvoicePaidStatus(npId);
    if (!ok) {
      return { status: inv.status, updated: false, message: message ?? "Could not reach NOWPayments." };
    }
    if (!paid) {
      return { status: "awaiting_payment", updated: false, message: "Payment not completed yet." };
    }

    const details = {
      source: "nowpayments_sync",
      nowpaymentsInvoiceId: npId,
      payload,
    };

    const updated = await this.tryMarkPaid(inv.id, details);
    return { status: updated ? "paid" : inv.status, updated };
  }

  async markExternalPaid(id: string, dto: MarkExternalPaidDto) {
    const inv = await this.prisma.paymentInvoice.findUnique({ where: { id } });
    if (!inv) throw new NotFoundException("Invoice not found.");
    if (inv.gatewayType !== "external" && inv.gatewayType !== "zelle") {
      throw new BadRequestException("Only external payment links or Zelle instructions can be marked paid manually.");
    }
    if (inv.status !== "pending") {
      throw new BadRequestException("This invoice is not awaiting payment.");
    }

    const details = {
      source: inv.gatewayType === "zelle" ? "zelle_admin" : "external_admin",
      referenceNote: dto.referenceNote?.trim() || null,
      recordedAt: new Date().toISOString(),
    };

    const updated = await this.tryMarkPaid(inv.id, details);
    if (!updated) throw new BadRequestException("Could not update invoice.");
    return this.toAdminResponse(await this.prisma.paymentInvoice.findUniqueOrThrow({ where: { id } }));
  }

  private async tryMarkPaid(invoiceId: string, paymentDetails: object): Promise<boolean> {
    const paidAt = new Date();
    const upd = await this.prisma.paymentInvoice.updateMany({
      where: { id: invoiceId, status: "pending" },
      data: {
        status: "paid",
        paidAt,
        paymentDetails: paymentDetails as Prisma.InputJsonValue,
      },
    });

    if (upd.count === 0) return false;

    const fresh = await this.prisma.paymentInvoice.findUnique({ where: { id: invoiceId } });
    if (!fresh) return false;

    if (!fresh.confirmationEmailSentAt) {
      try {
        await this.mail.sendPaymentInvoiceConfirmation(fresh);
        await this.prisma.paymentInvoice.update({
          where: { id: invoiceId },
          data: { confirmationEmailSentAt: new Date() },
        });
      } catch (e) {
        this.log.error(`Failed to send confirmation email: ${(e as Error).message}`);
      }
    }

    return true;
  }
}

function maskEmail(email: string): string {
  const [u, domain] = email.split("@");
  if (!domain) return "•••";
  const left = u.length <= 2 ? "••" : `${u.slice(0, 2)}…`;
  return `${left}@${domain}`;
}
