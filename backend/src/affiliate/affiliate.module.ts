import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AffiliateService } from "./affiliate.service";

@Module({
  imports: [PrismaModule],
  providers: [AffiliateService],
  exports: [AffiliateService],
})
export class AffiliateModule {}
