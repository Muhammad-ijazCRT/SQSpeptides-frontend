import { Module } from "@nestjs/common";
import { AffiliateModule } from "../affiliate/affiliate.module";
import { PrismaModule } from "../prisma/prisma.module";
import { CheckoutNowpaymentsController } from "./checkout-nowpayments.controller";
import { NowpaymentsService } from "./nowpayments.service";

@Module({
  imports: [PrismaModule, AffiliateModule],
  controllers: [CheckoutNowpaymentsController],
  providers: [NowpaymentsService],
  exports: [NowpaymentsService],
})
export class NowpaymentsModule {}
