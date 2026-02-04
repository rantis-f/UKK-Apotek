import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  let role = "";
  try {
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      role = parsedUser.role;
    }
  } catch (e) {
  }

  const isAuthPage = pathname === "/login" || pathname === "/admin/login" || pathname.startsWith("/auth/register");
  const isDashboardAdmin = pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/shop");
  const isMemberArea = pathname.startsWith("/dashboard/shop");
  const isPublicPage = pathname === "/" || pathname.startsWith("/catalogue");

  if (isAuthPage && token) {
    return role === "admin"
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.redirect(new URL("/", request.url));
  }

  if (isDashboardAdmin) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isMemberArea) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};