import { getNestBaseUrl } from "@/lib/api/api-base";

/** Server-side Fastify base URL (BFF routes; same resolution as apiUrl()). */
export function getBackendUrl(): string {
  return getNestBaseUrl();
}
