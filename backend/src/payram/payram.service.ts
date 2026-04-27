import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { Payram, isPayramSDKError } from "payram";
import { Decimal } from "../generated/prisma-client/runtime/library";
import { AffiliateService } from "../affiliate/affiliate.service";
import { PrismaService } from "../prisma/prisma.service";

type PayramStoredStatus = "pending" | "paid" | "failed" | "cancelled";

type PayramPaymentRecord = {
  referenceId: string;
  orderId: string;
  customerEmail: string;
  amount: number;
  mode: "crypto" | "onramp";
  status: PayramStoredStatus;
  checkoutUrl: string;
  providerPayload?: unknown;
  createdAt: string;
  updatedAt: string;
};

type PayramStore = {
  payments: Record<string, PayramPaymentRecord>;
};

@Injectable()
export class PayramService {
  private readonly logger = new Logger(PayramService.name);
  private readonly storeFilePath = join(process.cwd(), "data", "payram-payments.json");

  constructor(
    private readonly prisma: PrismaService,
    private readonly affiliate: AffiliateService
  ) {}

  private normalizeBaseUrl(raw: string): string {
    const value = raw.trim().replace(/\/+$/, "");
    try {
      const u = new URL(value);
      // PayRam SDK appends /api/v1/payment itself; keep only origin.
      u.pathname = "";
      u.search = "";
      u.hash = "";
      return u.toString().replace(/\/+$/, "");
    } catch {
      return value;
    }
  }

  private buildEndpointCandidates(baseUrl: string): string[] {
    const normalized = this.normalizeBaseUrl(baseUrl);
    const explicit = process.env.PAYRAM_PAYMENT_ENDPOINT?.trim();
    const out = new Set<string>();

    if (explicit) out.add(explicit.replace(/\/+$/, ""));
    out.add(`${normalized}/api/v1/payment`);
    out.add(`${normalized}/project/all/api/v1/payment`);

    // Some deployments expose API on 8080 while dashboard is on 80.
    try {
      const parsed = new URL(normalized);
      if (!parsed.port) {
        parsed.port = "8080";
        out.add(`${parsed.toString().replace(/\/+$/, "")}/api/v1/payment`);
      }
    } catch {
      /* ignore */
    }

    return Array.from(out);
  }

  private async tryDirectCreatePayment(input: {
    amount: number;
    orderId: string;
    customerEmail: string;
  }): Promise<{ referenceId: string; checkoutUrl: string; raw: unknown; endpoint: string }> {
    const { apiKey, baseUrl } = this.getConfig();
    const payload = {
      amountInUSD: input.amount,
      customerEmail: input.customerEmail,
      customerID: input.orderId,
    };

    const endpoints = this.buildEndpointCandidates(baseUrl);
    const failures: string[] = [];

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "API-Key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        if (!res.ok) {
          const msg =
            typeof data.message === "string"
              ? data.message
              : typeof data.error === "string"
                ? data.error
                : `HTTP ${res.status}`;
          failures.push(`${endpoint} -> ${msg}`);
          continue;
        }

        const referenceId = typeof data.reference_id === "string" ? data.reference_id : "";
        const checkoutUrl = typeof data.url === "string" ? data.url : "";
        if (!referenceId || !checkoutUrl) {
          failures.push(`${endpoint} -> success response missing reference_id or url`);
          continue;
        }

        return { referenceId, checkoutUrl, raw: data, endpoint };
      } catch (error) {
        const em = (error as Error).message;
        failures.push(`${endpoint} -> network: ${em}`);
        this.logger.warn(`PayRam direct POST network error ${endpoint}: ${em}`);
      }
    }

    throw new BadRequestException(
      `PayRam endpoint discovery failed. Tried: ${failures.join(" | ")}. Configure PAYRAM_BASE_URL or PAYRAM_PAYMENT_ENDPOINT.`
    );
  }

  private getClient(): Payram {
    const apiKey = process.env.PAYRAM_API_KEY?.trim();
    const baseUrl = this.normalizeBaseUrl(process.env.PAYRAM_BASE_URL ?? process.env.PAYRAM_API_URL ?? "");
    if (!apiKey || !baseUrl) {
      throw new BadRequestException("PayRam is not configured. Set PAYRAM_API_KEY and PAYRAM_API_URL.");
    }
    return new Payram({
      apiKey,
      baseUrl,
      config: {
        timeoutMs: 12_000,
        maxRetries: 2,
        allowInsecureHttp: baseUrl.startsWith("http://"),
      },
    });
  }

  private getConfig() {
    const apiKey = process.env.PAYRAM_API_KEY?.trim();
    const baseUrl = this.normalizeBaseUrl(process.env.PAYRAM_BASE_URL ?? process.env.PAYRAM_API_URL ?? "");
    if (!apiKey || !baseUrl) {
      throw new BadRequestException("PayRam is not configured. Set PAYRAM_API_KEY and PAYRAM_BASE_URL.");
    }
    return { apiKey, baseUrl };
  }

  private ensureStoreDir() {
    const dir = join(process.cwd(), "data");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }

  private async readStore(): Promise<PayramStore> {
    this.ensureStoreDir();
    try {
      const raw = await readFile(this.storeFilePath, "utf8");
      const parsed = JSON.parse(raw) as Partial<PayramStore>;
      return { payments: parsed.payments ?? {} };
    } catch {
      return { payments: {} };
    }
  }

  private async writeStore(store: PayramStore): Promise<void> {
    this.ensureStoreDir();
    await writeFile(this.storeFilePath, JSON.stringify(store, null, 2), "utf8");
  }

  private async recordPayramCheckoutStarted(input: {
    orderId: string;
    referenceId: string;
    amount: number;
    mode: "crypto" | "onramp";
    checkoutUrl: string;
    raw: unknown;
  }) {
    const dup = await this.prisma.orderPayment.findFirst({
      where: { orderId: input.orderId, provider: "payram", externalId: input.referenceId },
    });
    if (dup) return;
    await this.prisma.orderPayment.create({
      data: {
        orderId: input.orderId,
        provider: "payram",
        externalId: input.referenceId,
        amountUsd: new Decimal(input.amount),
        status: "checkout_created",
        rawPayload: { mode: input.mode, checkoutUrl: input.checkoutUrl, provider: input.raw } as object,
      },
    });
  }

  async createPayment(input: {
    amount: number;
    orderId: string;
    customerEmail: string;
    mode?: "crypto" | "onramp";
  }): Promise<{ checkoutUrl: string; referenceId: string }> {
    const mode = input.mode ?? "crypto";
    let baseForLog = "";
    try {
      baseForLog = this.getConfig().baseUrl;
    } catch (e) {
      const msg = e instanceof BadRequestException ? e.message : String(e);
      this.logger.error(`PayRam createPayment: invalid configuration — ${msg}`);
      throw e;
    }
    this.logger.log(
      `PayRam createPayment start: orderId=${input.orderId} amountUSD=${input.amount} mode=${mode} PAYRAM_BASE_URL=${baseForLog}`
    );
    const client = this.getClient();

    try {
      const checkout = await client.payments.initiatePayment({
        amountInUSD: input.amount,
        customerEmail: input.customerEmail,
        customerId: input.orderId,
      });

      const referenceId = checkout.reference_id;
      const checkoutUrl = checkout.url;
      if (!referenceId || !checkoutUrl) {
        throw new InternalServerErrorException("PayRam did not return a checkout URL.");
      }

      const store = await this.readStore();
      const nowIso = new Date().toISOString();
      store.payments[referenceId] = {
        referenceId,
        orderId: input.orderId,
        customerEmail: input.customerEmail,
        amount: input.amount,
        mode,
        status: "pending",
        checkoutUrl,
        providerPayload: checkout,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      await this.writeStore(store);
      await this.recordPayramCheckoutStarted({
        orderId: input.orderId,
        referenceId,
        amount: input.amount,
        mode,
        checkoutUrl,
        raw: checkout,
      });

      return { checkoutUrl, referenceId };
    } catch (error) {
      if (isPayramSDKError(error)) {
        this.logger.warn(
          `PayRam create payment failed (${error.status ?? "unknown"}): ${error.message ?? error.error ?? "no-message"}`
        );

        if (error.status === 404) {
          const fallback = await this.tryDirectCreatePayment(input);

          const store = await this.readStore();
          const nowIso = new Date().toISOString();
          store.payments[fallback.referenceId] = {
            referenceId: fallback.referenceId,
            orderId: input.orderId,
            customerEmail: input.customerEmail,
            amount: input.amount,
            mode,
            status: "pending",
            checkoutUrl: fallback.checkoutUrl,
            providerPayload: fallback.raw,
            createdAt: nowIso,
            updatedAt: nowIso,
          };
          await this.writeStore(store);
          await this.recordPayramCheckoutStarted({
            orderId: input.orderId,
            referenceId: fallback.referenceId,
            amount: input.amount,
            mode,
            checkoutUrl: fallback.checkoutUrl,
            raw: fallback.raw,
          });

          this.logger.log(`PayRam fallback endpoint used: ${fallback.endpoint}`);
          return { checkoutUrl: fallback.checkoutUrl, referenceId: fallback.referenceId };
        }

        throw new BadRequestException(error.message || error.error || "Could not create PayRam payment.");
      }
      this.logger.error("Unexpected PayRam create payment failure", error as Error);
      throw new InternalServerErrorException("Could not create PayRam payment.");
    }
  }

  async handleWebhook(payload: Record<string, unknown>): Promise<{ ok: true }> {
    const referenceId = String(payload.reference_id ?? payload.referenceId ?? "");
    if (!referenceId) {
      throw new BadRequestException("Missing webhook reference id.");
    }

    const stateRaw = String(payload.payment_state ?? payload.paymentState ?? payload.status ?? "").toLowerCase();
    const nextStatus: PayramStoredStatus =
      stateRaw === "paid" || stateRaw === "completed" || stateRaw === "confirmed"
        ? "paid"
        : stateRaw === "cancelled"
          ? "cancelled"
          : stateRaw === "failed"
            ? "failed"
            : "pending";

    const store = await this.readStore();
    const existing = store.payments[referenceId];
    const nowIso = new Date().toISOString();
    store.payments[referenceId] = {
      referenceId,
      orderId: existing?.orderId ?? "",
      customerEmail: existing?.customerEmail ?? "",
      amount: existing?.amount ?? 0,
      mode: existing?.mode ?? "crypto",
      status: nextStatus,
      checkoutUrl: existing?.checkoutUrl ?? "",
      providerPayload: payload,
      createdAt: existing?.createdAt ?? nowIso,
      updatedAt: nowIso,
    };
    await this.writeStore(store);

    if (nextStatus === "pending") {
      return { ok: true };
    }

    let orderId = (existing?.orderId ?? "").trim();
    if (!orderId) {
      const row = await this.prisma.orderPayment.findFirst({
        where: { provider: "payram", externalId: referenceId },
        select: { orderId: true },
      });
      orderId = row?.orderId ?? "";
    }
    if (!orderId) {
      orderId = String(
        payload.customer_id ?? payload.customerId ?? payload.customerID ?? payload.order_id ?? ""
      ).trim();
    }

    if (!orderId) {
      this.logger.warn(`PayRam webhook: no orderId for reference ${referenceId}`);
      return { ok: true };
    }

    if (!store.payments[referenceId].orderId) {
      store.payments[referenceId].orderId = orderId;
      await this.writeStore(store);
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.paymentProvider !== "payram") {
      this.logger.warn(`PayRam webhook: order ${orderId} missing or not payram`);
      return { ok: true };
    }

    if (nextStatus === "paid") {
      await this.prisma.$transaction(async (tx) => {
        const o = await tx.order.findUnique({ where: { id: orderId } });
        if (!o || o.paymentProvider !== "payram") return;
        if (o.paymentCompletion === "paid") return;

        const dupPaid = await tx.orderPayment.findFirst({
          where: { orderId, provider: "payram", externalId: referenceId, status: "paid" },
        });
        if (dupPaid) return;

        await tx.orderPayment.create({
          data: {
            orderId,
            provider: "payram",
            externalId: referenceId,
            amountUsd: new Decimal(Number(o.total)),
            status: "paid",
            rawPayload: payload as object,
          },
        });
        await tx.order.update({
          where: { id: orderId },
          data: { paymentCompletion: "paid" },
        });
        await this.affiliate.applyReferralCommissionForOrder(orderId, tx);
      });
    } else if (nextStatus === "failed" || nextStatus === "cancelled") {
      const dup = await this.prisma.orderPayment.findFirst({
        where: {
          orderId,
          provider: "payram",
          externalId: referenceId,
          status: { in: ["failed", "cancelled"] },
        },
      });
      if (!dup) {
        await this.prisma.orderPayment.create({
          data: {
            orderId,
            provider: "payram",
            externalId: referenceId,
            amountUsd: new Decimal(Number(order.total)),
            status: nextStatus,
            rawPayload: payload as object,
          },
        });
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            paymentCompletion: nextStatus === "cancelled" ? "cancelled" : "payment_failed",
            status: "cancelled",
          },
        });
      }
    }

    return { ok: true };
  }
}
