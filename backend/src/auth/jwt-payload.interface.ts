export type JwtRole = "ADMIN" | "CUSTOMER";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: JwtRole;
}
