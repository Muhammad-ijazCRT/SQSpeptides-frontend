import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminJwtGuard } from "./guards/admin-jwt.guard";
import type { AccessTokenPayload } from "./jwt-payload.interface";
import { PrismaService } from "../prisma/prisma.service";

@Controller("auth/admin")
export class AdminAuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AdminLoginDto) {
    return this.auth.loginAdmin(dto);
  }

  @Get("me")
  @UseGuards(AdminJwtGuard)
  async me(@Req() req: Request & { user: AccessTokenPayload }) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: req.user.sub },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    if (!admin) throw new NotFoundException();
    return { ...admin, role: "ADMIN" as const };
  }
}
