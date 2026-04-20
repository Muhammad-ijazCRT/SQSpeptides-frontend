import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/guards/admin-jwt.guard";
import { CreatePaymentInvoiceDto } from "./dto/create-payment-invoice.dto";
import { MarkExternalPaidDto } from "./dto/mark-external-paid.dto";
import { PaymentInvoicesService } from "./payment-invoices.service";

@Controller("admin/payment-invoices")
@UseGuards(AdminJwtGuard)
export class AdminPaymentInvoicesController {
  constructor(private readonly invoices: PaymentInvoicesService) {}

  @Get()
  list() {
    return this.invoices.listForAdmin();
  }

  @Get("notifications")
  notifications() {
    return this.invoices.notificationsForAdmin();
  }

  @Post()
  create(@Body() dto: CreatePaymentInvoiceDto) {
    return this.invoices.create(dto);
  }

  @Patch(":id/mark-external-paid")
  markExternalPaid(@Param("id") id: string, @Body() dto: MarkExternalPaidDto) {
    return this.invoices.markExternalPaid(id, dto);
  }
}
