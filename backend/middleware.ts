import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE, CUSTOMER_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { verifyTokenRole } from "@/lib/auth/verify-jwt";

function getJwtSecret(): string | null {
  const s = process.env.JWT_SECRET;
  return s && s.length > 0 ? s : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy URLs: `/products` and `/products/:slug` → `/products-catalog`, but never touch static files under `public/products/images/`.
  if (pathname === "/products" || pathname === "/products/") {
    return NextResponse.redirect(new URL("/products-catalog", request.url), 308);
  }
  if (pathname.startsWith("/products/images")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/products/")) {
    const dest = pathname.replace(/^\/products/, "/products-catalog");
    return NextResponse.redirect(new URL(dest, request.url), 308);
  }

  const secret = getJwtSecret();

  if (!secret) {
    if (pathname.startsWith("/admin/dashboard") || pathname.startsWith("/account/dashboard")) {
      return new NextResponse("Set JWT_SECRET in .env (must match the API server).", { status: 500 });
    }
    return NextResponse.next();
  }

  const adminToken = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  const customerToken = request.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value;

  if (pathname.startsWith("/admin/dashboard")) {
    const ok = await verifyTokenRole(adminToken, secret, "ADMIN");
    if (!ok) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/account/dashboard")) {
    const ok = await verifyTokenRole(customerToken, secret, "CUSTOMER");
    if (!ok) {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (await verifyTokenRole(adminToken, secret, "ADMIN")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/account/login" || pathname === "/account/signup") {
    if (await verifyTokenRole(customerToken, secret, "CUSTOMER")) {
      return NextResponse.redirect(new URL("/account/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products",
    "/products/:path*",
    "/admin/dashboard/:path*",
    "/admin/login",
    "/account/dashboard/:path*",
    "/account/login",
    "/account/signup",
  ],
};
