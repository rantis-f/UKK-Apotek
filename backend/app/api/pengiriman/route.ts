import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const serialize = (data: any) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  ));
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const idPenjualan = BigInt(formData.get("id_penjualan") as string);
    
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

    const result = await prisma.$transaction(async (tx) => {
      const newPengiriman = await tx.pengiriman.create({
        data: {
          id_penjualan: idPenjualan,
          no_invoice: formData.get("no_invoice") as string,
          tgl_kirim: new Date(),
          nama_kurir: formData.get("nama_kurir") as string,
          telpon_kurir: formData.get("telpon_kurir") as string,
          status_kirim: "Sedang_Dikirim", // Sesuai StatusKirimEnum
          bukti_foto: fotoUrl,
          keterangan: formData.get("keterangan") as string || "Pesanan sedang diantar",
        },
      });

      await tx.penjualan.update({
        where: { id: idPenjualan },
        data: { status_order: "Menunggu_Kurir" } 
      });

      return newPengiriman;
    });

    return NextResponse.json(serialize({ success: true, data: result }));
  } catch (error: any) {
    console.error("POST ERROR:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}