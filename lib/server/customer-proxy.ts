import { cookies } from "next/headers";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { bffFetch } from "@/lib/server/nest-bff-fetch";

export async function customerBearerHeader(): Promise<Record<string, string>> {
  const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Proxies to Nest with optional customer JWT from httpOnly cookie. */
export async function proxyBackend(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const auth = await customerBearerHeader();
  if (auth.Authorization) headers.set("Authorization", auth.Authorization);
  const p = path.startsWith("/") ? path : `/${path}`;
  return bffFetch(p, { ...init, headers });
}
