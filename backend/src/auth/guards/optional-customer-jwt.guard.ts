import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import type { AccessTokenPayload } from "../jwt-payload.interface";

@Injectable()
export class OptionalCustomerJwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: AccessTokenPayload }>();
    req.user = undefined;
    const token = extractBearer(req);
    if (!token) return true;
    try {
      const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token);
      if (payload.role === "CUSTOMER") req.user = payload;
    } catch {
      /* invalid or expired — checkout still allowed as guest */
    }
    return true;
  }
}

function extractBearer(req: Request): string | null {
  const h = req.headers.authorization;
  if (h?.startsWith("Bearer ")) return h.slice(7).trim();
  return null;
}
