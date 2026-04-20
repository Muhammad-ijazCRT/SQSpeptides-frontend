import { jwtVerify } from "jose";

export type JwtRole = "ADMIN" | "CUSTOMER";

export async function verifyTokenRole(
  token: string | undefined,
  secret: string,
  role: JwtRole
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === role;
  } catch {
    return false;
  }
}
