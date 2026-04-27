import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminAuthController } from "./admin-auth.controller";
import { AuthService } from "./auth.service";
import { CustomerAuthController } from "./customer-auth.controller";
import { AdminJwtGuard } from "./guards/admin-jwt.guard";
import { CustomerJwtGuard } from "./guards/customer-jwt.guard";
import { OptionalCustomerJwtGuard } from "./guards/optional-customer-jwt.guard";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? "dev-only-change-in-production",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" },
    }),
  ],
  controllers: [AdminAuthController, CustomerAuthController],
  providers: [AuthService, AdminJwtGuard, CustomerJwtGuard, OptionalCustomerJwtGuard],
  exports: [AuthService, AdminJwtGuard, CustomerJwtGuard, OptionalCustomerJwtGuard],
})
export class AuthModule {}
