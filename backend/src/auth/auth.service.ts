import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import type { AccessTokenPayload } from "./jwt-payload.interface";
import type { AdminLoginDto } from "./dto/admin-login.dto";
import type { CustomerLoginDto } from "./dto/customer-login.dto";
import type { CustomerRegisterDto } from "./dto/customer-register.dto";

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async loginAdmin(dto: AdminLoginDto) {
    let admin;
    try {
      admin = await this.prisma.adminUser.findUnique({ where: { email: dto.email.toLowerCase() } });
    } catch (err) {
      console.error("[AuthService.loginAdmin] database error", err);
      throw new ServiceUnavailableException(
        "Could not query the database. Check DATABASE_URL, run migrations, and ensure PostgreSQL is running.",
      );
    }
    if (!admin) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    const accessToken = await this.signAccessToken({
      sub: admin.id,
      email: admin.email,
      role: "ADMIN",
    });
    return {
      accessToken,
      user: { id: admin.id, email: admin.email, name: admin.name, role: "ADMIN" as const },
    };
  }

  async loginCustomer(dto: CustomerLoginDto) {
    const customer = await this.prisma.customer.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!customer) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(dto.password, customer.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    const accessToken = await this.signAccessToken({
      sub: customer.id,
      email: customer.email,
      role: "CUSTOMER",
    });
    return {
      accessToken,
      user: { id: customer.id, email: customer.email, name: customer.name, role: "CUSTOMER" as const },
    };
  }

  async registerCustomer(dto: CustomerRegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.customer.findUnique({ where: { email } });
    if (existing) throw new ConflictException("An account with this email already exists");
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const customer = await this.prisma.customer.create({
      data: { email, passwordHash, name: dto.name.trim() },
    });
    const accessToken = await this.signAccessToken({
      sub: customer.id,
      email: customer.email,
      role: "CUSTOMER",
    });
    return {
      accessToken,
      user: { id: customer.id, email: customer.email, name: customer.name, role: "CUSTOMER" as const },
    };
  }

  private signAccessToken(payload: AccessTokenPayload) {
    return this.jwt.signAsync(payload);
  }
}
