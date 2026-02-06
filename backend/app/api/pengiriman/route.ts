import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// 1. Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Helper untuk menangani BigInt agar bisa di-JSON-kan
const serialize = (data: any) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  ));
};

/**
 * GET: Mengambil semua data pengiriman (Public/Tanpa Login)
 */
export async function GET() {
  try {
    const data = await prisma.pengiriman.findMany({
      include: {
        penjualan: true, // Menyertakan detail penjualan (no_invoice, status_order, dll)
      },
      orderBy: {
        tgl_kirim: "desc", // Menampilkan kiriman terbaru di atas
      },
    });

    return NextResponse.json(serialize({ 
      success: true, 
      data: data 
    }));
  } catch (error: any) {
    console.error("GET ALL ERROR:", error.message);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * POST: Membuat data pengiriman baru & Update Status Order
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const idPenjualan = BigInt(formData.get("id_penjualan") as string);
    
    // Proses Upload Foto ke Cloudinary
    const imageFile = formData.get("bukti_foto") as File;
    let fotoUrl = "";

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadRes: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "bukti_pengiriman" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        ).end(buffer);
      });
      fotoUrl = uploadRes.secure_url;
    }

    // Database Transaction: Membuat Pengiriman & Update Status Penjualan
    const result = await prisma.$transaction(async (tx) => {
      const newPengiriman = await tx.pengiriman.create({
        data: {
          id_penjualan: idPenjualan,
          no_invoice: formData.get("no_invoice") as string,
          tgl_kirim: new Date(),
          nama_kurir: formData.get("nama_kurir") as string,
          telpon_kurir: formData.get("telpon_kurir") as string,
          status_kirim: "Sedang_Dikirim", 
          bukti_foto: fotoUrl,
          keterangan: formData.get("keterangan") as string || "Pesanan sedang diantar",
        },
      });

      // Update status di tabel penjualan
      await tx.penjualan.update({
        where: { id: idPenjualan },
        data: { status_order: "Menunggu_Kurir" } 
      });

      return newPengiriman;
    });

    return NextResponse.json(serialize({ success: true, data: result }));
  } catch (error: any) {
    console.error("POST ERROR:", error.message);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}