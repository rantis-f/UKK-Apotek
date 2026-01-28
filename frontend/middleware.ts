import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. AMBIL TOKEN DAN ROLE DARI COOKIE
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;
  
  let role = "";
  try {
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      role = parsedUser.role; // 'admin' atau 'pelanggan'
    }
  } catch (e) {
    // Cookie tidak valid atau kosong
  }

  // 2. DEFINISI RUTE
  const isAuthPage = pathname === "/login" || pathname === "/admin/login" || pathname.startsWith("/auth/register");
  const isDashboardAdmin = pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/shop");
  const isMemberArea = pathname.startsWith("/dashboard/shop");
  const isPublicPage = pathname === "/" || pathname.startsWith("/catalogue");

  // --- LOGIKA SATPAM ---

  // A. Jika sudah login, jangan biarkan masuk ke halaman LOGIN lagi
  if (isAuthPage && token) {
    return role === "admin" 
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.redirect(new URL("/", request.url));
  }

  // B. Proteksi Area DASHBOARD ADMIN
  if (isDashboardAdmin) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (role !== "admin") {
      // Pelanggan coba masuk ke dashboard admin? Lempar ke landing page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // C. Proteksi Area MEMBER/BELANJA (Jika butuh login untuk akses shop)
  if (isMemberArea) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role === "admin") {
      // Admin nyasar ke area belanja? Lempar balik ke dashboard admin
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// MATCHING CONFIG
export const config = {
  matcher: [
    /*
     * Mengecualikan:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};