import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? "surabank_token";

export function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = req.nextUrl;

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isProtected = pathname === "/" || pathname.startsWith("/movements");
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/movements/:path*"],
};
