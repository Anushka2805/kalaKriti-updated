import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;

  // ✅ ALWAYS allow auth pages
  if (
    pathname.startsWith("/artisan/signin") ||
    pathname.startsWith("/artisan/signup") ||
    pathname.startsWith("/buyer/signin") ||
    pathname.startsWith("/buyer/signup")
  ) {
    return NextResponse.next();
  }

  // 🔒 Protect artisan routes
  if (pathname.startsWith("/artisan")) {
    if (!userId || role !== "ARTISAN") {
      return NextResponse.redirect(new URL("/artisan/signin", req.url));
    }
  }

  // 🔒 Protect buyer routes
  if (pathname.startsWith("/buyer")) {
    if (!userId || role !== "BUYER") {
      return NextResponse.redirect(new URL("/buyer/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/artisan/:path*", "/buyer/:path*"],
};
