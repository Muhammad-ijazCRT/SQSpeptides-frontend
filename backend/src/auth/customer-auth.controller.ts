import { Body, Controller, Get, NotFoundException, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { CustomerLoginDto } from "./dto/customer-login.dto";
import { CustomerRegisterDto } from "./dto/customer-register.dto";
import { CustomerJwtGuard } from "./guards/customer-jwt.guard";
import type { AccessTokenPayload } from "./jwt-payload.interface";
import { PrismaService } from "../prisma/prisma.service";

@Controller("auth/customer")
export class CustomerAuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Post("register")
  register(@Body() dto: CustomerRegisterDto) {
    return this.auth.registerCustomer(dto);
  }

  @Post("login")
  login(@Body() dto: CustomerLoginDto) {
    return this.auth.loginCustomer(dto);
  }

  @Get("me")
  @UseGuards(CustomerJwtGuard)
  async me(@Req() req: Request & { user: AccessTokenPayload }) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: req.user.sub },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    if (!customer) throw new NotFoundException();
    return { ...customer, role: "CUSTOMER" as const };
  }
}
