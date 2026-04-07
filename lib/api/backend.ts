import { getNestBaseUrl } from "@/lib/api/api-base";

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getNestBaseUrl()}${p}`;
}
