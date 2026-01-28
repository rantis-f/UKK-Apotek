import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };


  if (request.method === "OPTIONS") {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  if (pathname.startsWith("/api/auth")) {
    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

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
    console.error("❌ FATAL: JWT_SECRET belum di-setting di file .env!");
    return NextResponse.json(
      { success: false, message: "Server Error: Konfigurasi keamanan belum lengkap." },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    await jwtVerify(token, secret);
    
    const response = NextResponse.next();
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