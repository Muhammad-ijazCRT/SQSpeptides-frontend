"use server";

import { CreateOrderResponse, ApiErrorResponse } from "./types";

const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY ?? "";
const SERVER_API_KEY = process.env.CROSSMINT_SERVER_SIDE_API_KEY ?? "";
const CROSSMINT_ENV = process.env.NEXT_PUBLIC_CROSSMINT_ENV || "staging";
const USDC_STAGING = "solana:4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
const USDC_PROD = "solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

function crossmintBaseUrl(): string {
  return CROSSMINT_ENV === "production"
    ? "https://www.crossmint.com"
    : "https://staging.crossmint.com";
}

/** Turns thrown fetch errors into a message the UI can show (avoids opaque 500 + "fetch failed"). */
function describeFetchFailure(err: unknown): string {
  if (!(err instanceof Error)) {
    return "Could not reach Crossmint. Check your network and firewall, then try again.";
  }
  const bits: string[] = [err.message];
  const c = err.cause;
  if (c instanceof Error) bits.push(c.message);
  else if (c && typeof c === "object" && "code" in c) bits.push(String((c as { code: unknown }).code));
  else if (c != null) bits.push(String(c));
  const detail = bits.filter(Boolean).join(" — ");
  return `Could not reach Crossmint (${detail}). Check VPN/firewall, DNS, and that ${crossmintBaseUrl()} is reachable from this machine.`;
}

export async function linkWallet(
  email: string,
  walletAddress: string
): Promise<void | ApiErrorResponse> {
  if (!SERVER_API_KEY) {
    return { error: "CROSSMINT_SERVER_SIDE_API_KEY is not set (required for wallet link)." };
  }
  const baseUrl = crossmintBaseUrl();

  const userLocator = `email:${email}`;

  let res: Response;
  try {
    res = await fetch(
      `${baseUrl}/api/2025-06-09/users/${encodeURIComponent(userLocator)}/linked-wallets/${encodeURIComponent(walletAddress)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SERVER_API_KEY,
        },
        body: JSON.stringify({
          chain: "solana",
        }),
      }
    );
  } catch (e) {
    return { error: describeFetchFailure(e) };
  }

  if (!res.ok) {
    let message = "Failed to link wallet";
    try {
      const data = (await res.json()) as { message?: string; error?: string };
      message = data?.message || data?.error || message;
    } catch {
      /* non-JSON error body */
    }
    return { error: message } as ApiErrorResponse;
  }
}

export async function createCrossmintOrder(
  amountUsd: string,
  email: string,
  walletAddress: string
): Promise<CreateOrderResponse | ApiErrorResponse> {
  if (!CLIENT_API_KEY) {
    return { error: "NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY is not set." };
  }
  const baseUrl = crossmintBaseUrl();
  const tokenLocator = CROSSMINT_ENV === "production" ? USDC_PROD : USDC_STAGING;

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/2022-06-09/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLIENT_API_KEY,
      },
      body: JSON.stringify({
        lineItems: [
          {
            tokenLocator,
            executionParameters: {
              mode: "exact-in",
              amount: amountUsd,
            },
          },
        ],
        payment: {
          method: "card",
          receiptEmail: email,
        },
        recipient: {
          walletAddress,
        },
      }),
    });
  } catch (e) {
    return { error: describeFetchFailure(e) };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { error: `Crossmint returned a non-JSON response (HTTP ${res.status}).` };
  }
  if (!res.ok) {
    const body = data as { message?: string; error?: string };
    return {
      error: body?.message || body?.error || `Order creation failed (HTTP ${res.status}).`,
    } as ApiErrorResponse;
  }
  return data as CreateOrderResponse;
}
