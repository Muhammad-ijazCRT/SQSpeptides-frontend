import { Module } from "@nestjs/common";
import { AffiliateModule } from "../affiliate/affiliate.module";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { CustomerPortalController } from "./customer-portal.controller";
import { CustomerPortalService } from "./customer-portal.service";

@Module({
  imports: [PrismaModule, AuthModule, AffiliateModule],
  controllers: [CustomerPortalController],
  providers: [CustomerPortalService],
})
export class CustomerPortalModule {}
