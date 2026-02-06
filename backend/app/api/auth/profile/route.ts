import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { jwtVerify } from "jose";

// --- 1. HELPER SERIALIZER (WAJIB ADA) ---
// Tanpa ini, ID yang bertipe BigInt akan membuat API error 500
const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Pastikan userId sesuai dengan tipe di Database (BigInt vs Number)
    const userId = BigInt(payload.id as string); 
    const userRole = payload.role as string;

    let userData = null;

    if (userRole === "pelanggan") {
      userData = await prisma.pelanggan.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nama_pelanggan: true,
          email: true,
          no_telp: true,
          foto: true,
          url_ktp: true,
          // Alamat lengkap kamu sudah di-select di sini
          alamat1: true, kota1: true, propinsi1: true, kodepos1: true,
          alamat2: true, kota2: true, propinsi2: true, kodepos2: true,
          alamat3: true, kota3: true, propinsi3: true, kodepos3: true,
        },
      });
    } else {
      userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          jabatan: true,
        },
      });
    }

    if (!userData) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    }

    // --- 2. GUNAKAN SERIALIZE DI SINI ---
    return NextResponse.json(serialize({
      success: true,
      data: userData,
    }));

  } catch (error: any) {
    console.error("Profile Error:", error.message);
    // Bedakan error token expired dengan error server lainnya
    const message = error.name === "JWTExpired" ? "Token Expired" : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 401 });
  }
}