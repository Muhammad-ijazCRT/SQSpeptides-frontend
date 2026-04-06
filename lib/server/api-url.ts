import { getNestBaseUrl } from "@/lib/api/api-base";

/** Server-side NestJS base URL (BFF routes use this; not exposed to the browser). */
export function getBackendUrl(): string {
  return getNestBaseUrl();
}
