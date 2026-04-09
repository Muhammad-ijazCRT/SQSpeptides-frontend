import { Module } from "@nestjs/common";
import { AffiliateModule } from "../affiliate/affiliate.module";
import { AuthModule } from "../auth/auth.module";
import { CouponsModule } from "../coupons/coupons.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ProductsModule } from "../products/products.module";
import { AdminController } from "./admin.controller";

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule, AffiliateModule, CouponsModule],
  controllers: [AdminController],
})
export class AdminModule {}
