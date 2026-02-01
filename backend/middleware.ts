import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // 1. Handle Preflight OPTIONS (Untuk CORS)
  if (method === "OPTIONS") {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  // 2. Tentukan Rute Publik (Boleh diakses tanpa login)
  const isAuthRoute = pathname.startsWith("/api/auth");
  
  // Tambahkan /api/jenis-obat di sini agar muncul di Landing Page
  const isPublicGet = 
    (pathname.startsWith("/api/obat") || pathname.startsWith("/api/jenis-obat")) 
    && method === "GET";

  if (isAuthRoute || isPublicGet) {
    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // 3. Proteksi Rute Sisa (Wajib Token)
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Akses Ditolak: Token tidak ditemukan!" },
      { status: 401, headers: corsHeaders }
    );
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return NextResponse.json(
      { success: false, message: "Server Error: JWT_SECRET belum disetting." },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload.id));
    requestHeaders.set("x-user-role", String(payload.role));
    requestHeaders.set("x-user-email", String(payload.email));

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Akses Ditolak: Token kadaluarsa atau tidak valid!" },
      { status: 401, headers: corsHeaders }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};