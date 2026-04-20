import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { NowpaymentsSyncDto } from "./dto/nowpayments-sync.dto";
import { SubmitPaymentInvoiceZelleProofDto } from "./dto/submit-payment-invoice-zelle-proof.dto";
import { PaymentInvoicesService } from "./payment-invoices.service";

@Controller("public/payment-invoices")
export class PublicPaymentInvoicesController {
  constructor(private readonly invoices: PaymentInvoicesService) {}

  @Get(":token")
  getOne(@Param("token") token: string) {
    return this.invoices.getPublicByToken(token);
  }

  @Post(":token/nowpayments-sync")
  nowpaymentsSync(@Param("token") token: string, @Body() dto: NowpaymentsSyncDto) {
    return this.invoices.syncNowpayments(token, dto.email);
  }

  @Post(":token/zelle-proof")
  submitZelleProof(@Param("token") token: string, @Body() dto: SubmitPaymentInvoiceZelleProofDto) {
    return this.invoices.submitZelleProof(token, dto);
  }
}
