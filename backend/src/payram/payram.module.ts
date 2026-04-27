import { Module } from "@nestjs/common";
import { AffiliateModule } from "../affiliate/affiliate.module";
import { PayramController } from "./payram.controller";
import { PayramService } from "./payram.service";

@Module({
  imports: [AffiliateModule],
  controllers: [PayramController],
  providers: [PayramService],
  exports: [PayramService],
})
export class PayramModule {}
