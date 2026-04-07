import { Module } from "@nestjs/common";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { CustomerPortalModule } from "./customer-portal/customer-portal.module";
import { OrdersModule } from "./orders/orders.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule,
    ProductsModule,
    OrdersModule,
    CustomerPortalModule,
  ],
})
export class AppModule {}
