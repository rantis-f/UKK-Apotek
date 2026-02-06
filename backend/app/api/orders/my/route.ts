import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { jwtVerify } from "jose";

// 1. Helper agar BigInt bisa di-render di Frontend
const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

export async function GET(req: NextRequest) {
  try {
    // 2. Ambil & Validasi Token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Pastikan userId di-convert ke BigInt agar cocok dengan kolom DB
    const userId = BigInt(payload.id as string);

    // 3. Ambil data dari tabel Penjualan
    const myOrders = await prisma.penjualan.findMany({
      where: {
        id_pelanggan: userId,
      },
      include: {
        // Ambil rincian produk di setiap pesanan
        details: {
          include: {
            obat: true, // Supaya bisa muncul Nama Obat & Foto
          },
        },
        // Ambil info ekspedisi dan pembayaran
        jenis_pengiriman: true,
        metode_bayar: true,
        pengiriman: true, // Jika sudah ada data kurir/no_invoice
      },
      orderBy: {
        tgl_penjualan: "desc", // Urutkan dari yang terbaru
      },
    });

    return NextResponse.json(
      serialize({
        success: true,
        data: myOrders,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET MY ORDERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil riwayat: " + error.message },
      { status: 500 }
    );
  }
}