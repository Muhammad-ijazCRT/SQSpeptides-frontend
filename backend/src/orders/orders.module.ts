import { Module } from "@nestjs/common";
import { AffiliateModule } from "../affiliate/affiliate.module";
import { AuthModule } from "../auth/auth.module";
import { CouponsModule } from "../coupons/coupons.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [AuthModule, AffiliateModule, CouponsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
