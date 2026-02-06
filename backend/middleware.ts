import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // 1. Setup CORS Headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // 2. Handle Preflight Request (OPTIONS)
  if (method === "OPTIONS") {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  // 3. Tentukan Route yang Benar-benar Publik
  const isAuthRoute = pathname.startsWith("/api/auth");
  
  // GET untuk endpoint di bawah ini dibuat publik agar pelanggan bisa checkout
  const isPublicGet = (
    pathname.startsWith("/api/obat") || 
    pathname.startsWith("/api/jenis-obat") || 
    pathname.startsWith("/api/pengiriman") || 
    pathname.startsWith("/api/metode-bayar") ||
    pathname.startsWith("/api/penjualan") ||
    pathname.startsWith("/api/ekspedisi")
  ) && method === "GET";

  // Jika Route Publik, Langsung Loloskan
  if (isAuthRoute || isPublicGet) {
    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  }

  // 4. Proteksi Token (Wajib Login untuk POST, PUT, DELETE, atau route Private)
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

    const userRole = String(payload.jabatan || payload.role);

    // 5. Proteksi Berdasarkan Role (Hanya jalan jika bukan Public GET)

    // Khusus Admin/Pemilik: Kelola User & Setup Metode Bayar (POST/PUT/DELETE)
    if (pathname.startsWith("/api/users") || pathname.startsWith("/api/metode-bayar")) {
      if (userRole !== "admin" && userRole !== "pemilik") {
        return NextResponse.json({ success: false, message: "Terlarang: Hanya Admin/Pemilik" }, { status: 403, headers: corsHeaders });
      }
    }

    // Kasir/Admin/Pemilik: Transaksi Penjualan & Data Pelanggan
    if (pathname.startsWith("/api/penjualan") || pathname.startsWith("/api/pelanggan")) {
      const allowed = ["kasir", "admin", "pemilik"];
      if (!allowed.includes(userRole)) {
        return NextResponse.json({ success: false, message: "Terlarang: Akses terbatas Kasir/Admin" }, { status: 403, headers: corsHeaders });
      }
    }

    // Apoteker/Admin/Pemilik: Kelola Stok Obat & Distributor
    if (pathname.startsWith("/api/distributor") || pathname.startsWith("/api/restock") || (pathname.startsWith("/api/obat") && method !== "GET")) {
      const allowed = ["apoteker", "admin", "pemilik"];
      if (!allowed.includes(userRole)) {
        return NextResponse.json({ success: false, message: "Terlarang: Akses terbatas Apoteker/Admin" }, { status: 403, headers: corsHeaders });
      }
    }

    // 6. Loloskan dengan Header Tambahan (User Info)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload.id));
    requestHeaders.set("x-user-role", userRole);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;

  } catch (error) {
    return NextResponse.json({ success: false, message: "Token tidak valid atau kedaluwarsa!" }, { status: 401, headers: corsHeaders });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};