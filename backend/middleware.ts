import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }


  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Akses Ditolak: Token tidak ditemukan!" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia-negara");

  try {
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.next();

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Akses Ditolak: Token kadaluarsa atau tidak valid!" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};