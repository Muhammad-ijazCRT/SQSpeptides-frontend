import { Module } from "@nestjs/common";
import { NowpaymentsModule } from "../nowpayments/nowpayments.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminPaymentInvoicesController } from "./admin-payment-invoices.controller";
import { PublicPaymentInvoicesController } from "./public-payment-invoices.controller";
import { PaymentInvoicesService } from "./payment-invoices.service";

@Module({
  imports: [PrismaModule, NowpaymentsModule],
  controllers: [AdminPaymentInvoicesController, PublicPaymentInvoicesController],
  providers: [PaymentInvoicesService],
})
export class PaymentInvoicesModule {}
