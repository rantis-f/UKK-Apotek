import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { jwtVerify } from "jose";

// 1. Helper agar BigInt tidak error saat dikirim ke frontend
const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

export async function POST(req: NextRequest) {
  try {
    // 2. Validasi Token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = BigInt(payload.id as string);

    // 3. Ambil Data Body
    const body = await req.json();
    const { 
      id_jenis_kirim, 
      id_metode_bayar, 
      ongkos_kirim, 
      biaya_app, 
      total_bayar, 
      details 
    } = body;

    // 4. Transaksi Database
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Simpan ke tabel Penjualan (Sesuai model Penjualan di schema)
      const newOrder = await tx.penjualan.create({
        data: {
          tgl_penjualan: new Date(),
          ongkos_kirim: Number(ongkos_kirim) || 0,
          biaya_app: Number(biaya_app) || 0,
          total_bayar: Number(total_bayar) || 0,
          status_order: "Diproses", // Menggunakan enum StatusOrderEnum
          
          // Menggunakan 'connect' untuk relasi wajib (MetodeBayar, JenisPengiriman, Pelanggan)
          pelanggan: { connect: { id: userId } },
          metode_bayar: { connect: { id: BigInt(id_metode_bayar) } },
          jenis_pengiriman: { connect: { id: BigInt(id_jenis_kirim) } },
        },
      });

      // B. Simpan ke tabel DetailPenjualan (Sesuai model DetailPenjualan di schema)
      const detailPromises = details.map((item: any) => {
        return tx.detailPenjualan.create({
          data: {
            // Hubungkan ke Penjualan dan Obat
            penjualan: { connect: { id: newOrder.id } },
            obat: { connect: { id: BigInt(item.id_obat) } },
            
            jumlah_beli: Number(item.jumlah_beli),
            harga_beli: Number(item.harga_beli),
            subtotal: Number(item.subtotal),
          },
        });
      });

      await Promise.all(detailPromises);
      return newOrder;
    });

    return NextResponse.json(serialize({
      success: true,
      message: "Pesanan berhasil dibuat!",
      data: result
    }), { status: 201 });

  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal memproses pesanan: " + error.message 
    }, { status: 500 });
  }
}