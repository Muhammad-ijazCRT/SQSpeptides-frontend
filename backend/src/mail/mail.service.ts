import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import type { PaymentInvoice } from "../generated/prisma-client";
import { PrismaService } from "../prisma/prisma.service";

const SETTINGS_ID = "default";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const BRAND = "SQSpeptides";

type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
};

@Injectable()
export class MailService {
  private readonly log = new Logger(MailService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Resolves SMTP from SiteSettings first, then process.env fallback. */
  private async resolveMailConfig(): Promise<MailConfig | null> {
    await this.prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, affiliateCommissionPercent: 10 },
      update: {},
    });
    const s = await this.prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });

    const host = (s?.mailHost ?? process.env.MAIL_HOST)?.trim();
    const from = (s?.mailFrom ?? process.env.MAIL_FROM)?.trim();
    if (!host || !from) return null;

    const portRaw = s?.mailPort ?? (process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587);
    const port = Number.isFinite(Number(portRaw)) ? Number(portRaw) : 587;
    const secure =
      s?.mailSecure === true ||
      process.env.MAIL_SECURE === "1" ||
      port === 465;
    const user = (s?.mailUser ?? process.env.MAIL_USER)?.trim() || undefined;
    const pass = (s?.mailPassword ?? process.env.MAIL_PASSWORD)?.trim() || undefined;

    return { host, port, secure, user, pass, from };
  }

  async isConfigured(): Promise<boolean> {
    const c = await this.resolveMailConfig();
    return c != null;
  }

  async sendPaymentInvoiceConfirmation(invoice: PaymentInvoice): Promise<void> {
    const cfg = await this.resolveMailConfig();
    if (!cfg) {
      this.log.warn("Mail is not configured (Store settings or MAIL_HOST / MAIL_FROM) — skipping payment confirmation email.");
      return;
    }

    const transport = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.user && cfg.pass ? { user: cfg.user, pass: cfg.pass } : undefined,
    });

    const amountNum = Number(invoice.amount);
    const amountStr = amountNum.toLocaleString("en-US", { style: "currency", currency: invoice.currency.toUpperCase() });
    const paidAt = invoice.paidAt ? new Date(invoice.paidAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—";
    const gateway = escapeHtml(invoice.gatewayLabel);
    const desc = invoice.description ? escapeHtml(invoice.description) : "";
    const name = invoice.customerName ? escapeHtml(invoice.customerName) : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Payment received</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr>
<td style="background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);padding:28px 32px;text-align:center;border-bottom:3px solid #c9a227;">
<p style="margin:0;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#c9a227;font-family:system-ui,sans-serif;">${BRAND}</p>
<h1 style="margin:12px 0 0;font-size:22px;font-weight:600;color:#fafafa;font-family:system-ui,sans-serif;">Payment confirmation</h1>
</td>
</tr>
<tr><td style="padding:32px 32px 8px;font-family:system-ui,-apple-system,sans-serif;">
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">${name ? `Dear ${name},` : "Hello,"}</p>
<p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#3f3f46;">Thank you. We have recorded your payment successfully. A summary appears below for your records.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafafa;border-radius:10px;border:1px solid #e4e4e7;margin:8px 0 24px;">
<tr><td style="padding:20px 22px;">
<p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#71717a;font-family:system-ui,sans-serif;">Amount paid</p>
<p style="margin:0;font-size:28px;font-weight:700;color:#18181b;letter-spacing:-0.02em;">${escapeHtml(amountStr)}</p>
<p style="margin:16px 0 0;font-size:13px;color:#52525b;line-height:1.5;"><strong style="color:#18181b;">Gateway:</strong> ${gateway}<br/>
<strong style="color:#18181b;">Confirmed:</strong> ${escapeHtml(paidAt)}</p>
${desc ? `<p style="margin:14px 0 0;font-size:13px;color:#52525b;line-height:1.5;"><strong style="color:#18181b;">Reference:</strong> ${desc}</p>` : ""}
</td></tr></table>
<p style="margin:0 0 20px;font-size:14px;line-height:1.65;color:#52525b;">If you did not authorize this payment, contact us immediately using the details on our website.</p>
<p style="margin:0;font-size:13px;color:#a1a1aa;">This message was sent because a payment was completed for an invoice issued to this email address.</p>
</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid #f4f4f5;font-family:system-ui,sans-serif;text-align:center;">
<p style="margin:0;font-size:11px;color:#a1a1aa;letter-spacing:0.02em;">${BRAND} · Research supplies</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>`;

    await transport.sendMail({
      from: cfg.from,
      to: invoice.customerEmail,
      subject: `${BRAND} — Payment received (${amountStr})`,
      html,
    });
    this.log.log(`Payment confirmation email sent to ${invoice.customerEmail}`);
  }
}
