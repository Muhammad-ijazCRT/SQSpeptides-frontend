import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ProductsModule } from "../products/products.module";
import { AdminController } from "./admin.controller";

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule],
  controllers: [AdminController],
})
export class AdminModule {}
