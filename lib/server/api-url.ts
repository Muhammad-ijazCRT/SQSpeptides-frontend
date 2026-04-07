/** Server-side NestJS base URL (BFF routes use this; not exposed to the browser). */
export function getBackendUrl(): string {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
}
