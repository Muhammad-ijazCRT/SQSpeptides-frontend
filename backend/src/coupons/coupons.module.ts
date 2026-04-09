import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CouponsService } from "./coupons.service";

@Module({
  imports: [PrismaModule],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
