import { NextResponse, type NextRequest } from "next/server";

import {
  applySecurityHeaders,
  generateNonce,
  shouldApplySecurityHeaders,
} from "@/middleware/security-headers";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (!shouldApplySecurityHeaders(pathname)) {
    return NextResponse.next();
  }

  const nonce = generateNonce();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  applySecurityHeaders(response.headers, nonce);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|android-chrome-|apple-touch-icon).*)",
  ],
};
