import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateNowpaymentsInvoiceDto } from "./dto/create-nowpayments-invoice.dto";
import { NowpaymentsService } from "./nowpayments.service";

@Controller("checkout")
export class CheckoutNowpaymentsController {
  constructor(private readonly nowpayments: NowpaymentsService) {}

  @Get("nowpayments/availability")
  async availability() {
    const enabled = await this.nowpayments.isConfigured();
    const publicKey = enabled ? await this.nowpayments.getPublicKeyForStorefront() : null;
    return { enabled, publicKey };
  }

  @Post("nowpayments/invoice")
  createInvoice(@Body() dto: CreateNowpaymentsInvoiceDto) {
    return this.nowpayments.createInvoiceForOrder(dto.orderId, dto.email);
  }

  @Post("nowpayments/sync")
  sync(@Body() dto: CreateNowpaymentsInvoiceDto) {
    return this.nowpayments.syncOrderPaymentStatus(dto.orderId, dto.email);
  }
}
