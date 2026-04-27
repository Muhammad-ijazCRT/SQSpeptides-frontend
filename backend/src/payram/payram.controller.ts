import { Body, Controller, HttpCode, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { verifyApiKey } from "payram";
import { CreatePayramPaymentDto } from "./dto/create-payram-payment.dto";
import { PayramService } from "./payram.service";

@Controller("api")
export class PayramController {
  constructor(private readonly payramService: PayramService) {}

  @Post("create-payment")
  async createPayment(@Body() dto: CreatePayramPaymentDto) {
    return this.payramService.createPayment(dto);
  }

  /** @deprecated Prefer POST /api/payram/webhook (matches PayRam dashboard URL). */
  @Post("payram-webhook")
  @HttpCode(200)
  async payramWebhookLegacy(@Body() payload: Record<string, unknown>, @Req() req: Request) {
    return this.verifyAndHandleWebhook(req, payload);
  }

  @Post("payram/webhook")
  @HttpCode(200)
  async payramWebhook(@Body() payload: Record<string, unknown>, @Req() req: Request) {
    return this.verifyAndHandleWebhook(req, payload);
  }

  private verifyAndHandleWebhook(req: Request, payload: Record<string, unknown>) {
    const apiKey = process.env.PAYRAM_API_KEY?.trim() ?? "";
    if (!apiKey || !verifyApiKey(req.headers, apiKey)) {
      return { ok: false, message: "invalid-key" };
    }
    return this.payramService.handleWebhook(payload);
  }
}
