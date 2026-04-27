import { Module } from "@nestjs/common";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { CustomerPortalModule } from "./customer-portal/customer-portal.module";
import { MailModule } from "./mail/mail.module";
import { NowpaymentsModule } from "./nowpayments/nowpayments.module";
import { OrdersModule } from "./orders/orders.module";
import { PaymentInvoicesModule } from "./payment-invoices/payment-invoices.module";
import { PayramModule } from "./payram/payram.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [
    PrismaModule,
    MailModule,
    AuthModule,
    AdminModule,
    ProductsModule,
    OrdersModule,
    CustomerPortalModule,
    NowpaymentsModule,
    PaymentInvoicesModule,
    PayramModule,
  ],
})
export class AppModule {}
