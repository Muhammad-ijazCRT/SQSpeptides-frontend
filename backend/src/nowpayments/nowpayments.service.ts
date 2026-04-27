import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Decimal } from "../generated/prisma-client/runtime/library";
import { AffiliateService } from "../affiliate/affiliate.service";
import { PrismaService } from "../prisma/prisma.service";

const SETTINGS_ID = "default";

function npBaseUrl(sandbox: boolean): string {
  return sandbox ? "https://api-sandbox.nowpayments.io/v1" : "https://api.nowpayments.io/v1";
}

function statusHints(value: unknown): string[] {
  if (value == null) return [];
  if (typeof value === "string" || typeof value === "number") return [String(value).toLowerCase()];
  if (typeof value === "object" && !Array.isArray(value)) {
    const o = value as Record<string, unknown>;
    return [
      o.status,
      o.invoice_status,
      o.payment_status,
      o.state,
      o.invoice_state,
    ]
      .filter((x) => x != null)
      .map((x) => String(x).toLowerCase());
  }
  return [];
}

function indicatesPaid(statuses: string[]): boolean {
  return statuses.some((s) => ["finished", "paid", "completed", "confirmed"].includes(s));
}

@Injectable()
export class NowpaymentsService {
  private readonly log = new Logger(NowpaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly affiliate: AffiliateService
  ) {}

  async isConfigured(): Promise<boolean> {
    await this.prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, affiliateCommissionPercent: 10 },
      update: {},
    });
    const s = await this.prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
    return Boolean(s?.nowpaymentsApiKey?.trim() && s?.nowpaymentsPublicKey?.trim());
  }

  /** Returns masked-safe public key for storefront (optional). */
  async getPublicKeyForStorefront(): Promise<string | null> {
    const s = await this.prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
    const k = s?.nowpaymentsPublicKey?.trim();
    return k || null;
  }

  private async resolvePaidFromNowpayments(
    invoicePayload: Record<string, unknown>,
    base: string,
    apiKey: string
  ): Promise<boolean> {
    const fromInvoice = [
      ...statusHints(invoicePayload),
      ...statusHints(invoicePayload.payment),
      ...statusHints(invoicePayload.invoice),
    ];
    if (indicatesPaid(fromInvoice)) return true;

    const paymentId =
      invoicePayload.payment_id ??
      (invoicePayload.payment && typeof invoicePayload.payment === "object"
        ? (invoicePayload.payment as Record<string, unknown>).payment_id
        : undefined) ??
      invoicePayload.iid;
    if (paymentId == null) return false;

    const res = await fetch(`${base}/payment/${encodeURIComponent(String(paymentId))}`, {
      headers: { "x-api-key": apiKey },
    });
    const pay = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return false;
    const ps = String(pay.payment_status ?? pay.status ?? "").toLowerCase();
    return ps === "finished" || ps === "confirmed";
  }

  async createInvoiceForOrder(orderId: string, email: string): Promise<{ invoiceUrl: string }> {
    const configured = await this.isConfigured();
    if (!configured) {
      throw new BadRequestException("Cryptocurrency checkout is not configured yet (API key and public key required).");
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payments: {
          where: { provider: "nowpayments", status: "invoice_created" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    if (!order) throw new BadRequestException("Order not found.");
    if (order.email.toLowerCase() !== email.toLowerCase()) {
      throw new BadRequestException("Email does not match this order.");
    }
    if (order.paymentProvider !== "nowpayments") {
      throw new BadRequestException("This order is not awaiting cryptocurrency payment.");
    }
    if (order.paymentCompletion !== "awaiting_payment") {
      throw new BadRequestException("This order is not awaiting payment.");
    }

    const existing = order.payments[0];
    if (existing?.rawPayload && typeof existing.rawPayload === "object" && existing.rawPayload !== null) {
      const url = (existing.rawPayload as { invoice_url?: string }).invoice_url;
      if (url) return { invoiceUrl: url };
    }

    const settings = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
    const apiKey = settings.nowpaymentsApiKey!.trim();

    const storefront = (process.env.FRONTEND_ORIGIN ?? "http://localhost:3000").replace(/\/$/, "");
    const success_url = `${storefront}/checkout/crypto-success?orderId=${encodeURIComponent(orderId)}&confirmEmail=${encodeURIComponent(email)}`;
    const cancel_url = `${storefront}/checkout?crypto_cancel=1`;

    const amountUsd = Number(order.total);
    const body = {
      price_amount: amountUsd,
      price_currency: "usd",
      order_id: orderId,
      order_description: `Order ${orderId.slice(0, 8)}…`.slice(0, 200),
      success_url,
      cancel_url,
    };

    const res = await fetch(`${npBaseUrl(settings.nowpaymentsSandbox)}/invoice`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const msg =
        typeof data.message === "string"
          ? data.message
          : typeof data.error === "string"
            ? data.error
            : `NOWPayments error (HTTP ${res.status})`;
      this.log.warn(`Invoice create failed: ${msg}`);
      throw new BadRequestException(msg);
    }

    const invoiceUrl =
      (typeof data.invoice_url === "string" && data.invoice_url) ||
      (typeof data.invoiceUrl === "string" && data.invoiceUrl) ||
      "";
    if (!invoiceUrl) {
      this.log.warn(`Unexpected NOWPayments response: ${JSON.stringify(data)}`);
      throw new BadRequestException("NOWPayments did not return an invoice URL.");
    }

    const npId = data.id != null ? String(data.id) : null;

    await this.prisma.$transaction(async (tx) => {
      await tx.orderPayment.create({
        data: {
          orderId,
          provider: "nowpayments",
          externalId: npId,
          amountUsd: new Decimal(amountUsd),
          status: "invoice_created",
          rawPayload: { ...data, invoice_url: invoiceUrl } as object,
        },
      });
      await tx.order.update({
        where: { id: orderId },
        data: { nowpaymentsInvoiceId: npId },
      });
    });

    return { invoiceUrl };
  }

  /**
   * Polls NOWPayments for invoice/payment status (no IPN). Call from the success page after the customer returns.
   */
  async syncOrderPaymentStatus(
    orderId: string,
    email: string
  ): Promise<{ paymentCompletion: string; updated: boolean; message?: string }> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new BadRequestException("Order not found.");
    if (order.email.toLowerCase() !== email.toLowerCase()) {
      throw new BadRequestException("Email does not match this order.");
    }
    if (order.paymentProvider !== "nowpayments") {
      return { paymentCompletion: order.paymentCompletion, updated: false };
    }
    if (order.paymentCompletion === "paid") {
      return { paymentCompletion: "paid", updated: false };
    }

    const invoiceId = order.nowpaymentsInvoiceId?.trim();
    if (!invoiceId) {
      return {
        paymentCompletion: order.paymentCompletion,
        updated: false,
        message: "No invoice is linked to this order yet.",
      };
    }

    const settings = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
    const apiKey = settings.nowpaymentsApiKey?.trim();
    if (!apiKey) {
      throw new BadRequestException("NOWPayments API key is not configured.");
    }

    const base = npBaseUrl(settings.nowpaymentsSandbox);
    const invRes = await fetch(`${base}/invoice/${encodeURIComponent(invoiceId)}`, {
      headers: { "x-api-key": apiKey },
    });
    const invData = (await invRes.json().catch(() => ({}))) as Record<string, unknown>;
    if (!invRes.ok) {
      this.log.warn(`GET invoice failed HTTP ${invRes.status}: ${JSON.stringify(invData)}`);
      return {
        paymentCompletion: order.paymentCompletion,
        updated: false,
        message: "Could not load invoice status from NOWPayments.",
      };
    }

    const paid = await this.resolvePaidFromNowpayments(invData, base, apiKey);
    if (!paid) {
      return { paymentCompletion: "awaiting_payment", updated: false };
    }

    await this.prisma.$transaction(async (tx) => {
      const o = await tx.order.findUnique({ where: { id: orderId } });
      if (!o || o.paymentCompletion !== "awaiting_payment") return;

      await tx.orderPayment.create({
        data: {
          orderId,
          provider: "nowpayments",
          externalId: invoiceId,
          amountUsd: new Decimal(Number(o.total)),
          status: "sync_finished",
          rawPayload: invData as object,
        },
      });
      await tx.order.update({
        where: { id: orderId },
        data: { paymentCompletion: "paid" },
      });
      await this.affiliate.applyReferralCommissionForOrder(orderId, tx);
    });

    return { paymentCompletion: "paid", updated: true };
  }

  /**
   * Standalone NOWPayments invoice (admin payment links — not tied to an Order).
   */
  async createPaymentLinkInvoice(input: {
    amountUsd: number;
    orderDescription: string;
    orderIdForNp: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ invoiceUrl: string; npInvoiceId: string }> {
    const configured = await this.isConfigured();
    if (!configured) {
      throw new BadRequestException("Cryptocurrency checkout is not configured yet (API key and public key required).");
    }

    const settings = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
    const apiKey = settings.nowpaymentsApiKey!.trim();

    const body = {
      price_amount: input.amountUsd,
      price_currency: "usd",
      order_id: input.orderIdForNp.slice(0, 120),
      order_description: input.orderDescription.slice(0, 200),
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    };

    const res = await fetch(`${npBaseUrl(settings.nowpaymentsSandbox)}/invoice`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const msg =
        typeof data.message === "string"
          ? data.message
          : typeof data.error === "string"
            ? data.error
            : `NOWPayments error (HTTP ${res.status})`;
      this.log.warn(`Payment-link invoice create failed: ${msg}`);
      throw new BadRequestException(msg);
    }

    const invoiceUrl =
      (typeof data.invoice_url === "string" && data.invoice_url) ||
      (typeof data.invoiceUrl === "string" && data.invoiceUrl) ||
      "";
    if (!invoiceUrl) {
      this.log.warn(`Unexpected NOWPayments response: ${JSON.stringify(data)}`);
      throw new BadRequestException("NOWPayments did not return an invoice URL.");
    }

    const npId = data.id != null ? String(data.id) : "";
    if (!npId) {
      throw new BadRequestException("NOWPayments did not return an invoice id.");
    }

    return { invoiceUrl, npInvoiceId: npId };
  }

  /** Poll NOWPayments invoice status (same rules as order crypto sync). */
  async getInvoicePaidStatus(npInvoiceId: string): Promise<{
    ok: boolean;
    paid: boolean;
    payload: Record<string, unknown>;
    message?: string;
  }> {
    const settings = await this.prisma.siteSettings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
    const apiKey = settings.nowpaymentsApiKey?.trim();
    if (!apiKey) {
      return { ok: false, paid: false, payload: {}, message: "NOWPayments API key is not configured." };
    }

    const base = npBaseUrl(settings.nowpaymentsSandbox);
    const invRes = await fetch(`${base}/invoice/${encodeURIComponent(npInvoiceId)}`, {
      headers: { "x-api-key": apiKey },
    });
    const invData = (await invRes.json().catch(() => ({}))) as Record<string, unknown>;
    if (!invRes.ok) {
      this.log.warn(`GET payment-link invoice failed HTTP ${invRes.status}: ${JSON.stringify(invData)}`);
      return {
        ok: false,
        paid: false,
        payload: invData,
        message: "Could not load invoice status from NOWPayments.",
      };
    }

    const paid = await this.resolvePaidFromNowpayments(invData, base, apiKey);
    return { ok: true, paid, payload: invData };
  }
}
