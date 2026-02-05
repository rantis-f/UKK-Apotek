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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const imageFile = formData.get("bukti_foto") as File;
    let fotoUrl = "";

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadRes: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "bukti_diterima" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        ).end(buffer);
      });
      fotoUrl = uploadRes.secure_url;
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.pengiriman.update({
        where: { id: BigInt(id) },
        data: {
          status_kirim: "Tiba_Di_Tujuan",
          tgl_tiba: new Date(),
          bukti_foto: fotoUrl || undefined,
        },
      });

      await tx.penjualan.update({
        where: { id: updated.id_penjualan },
        data: { status_order: "Selesai" }
      });

      return updated;
    });

    return NextResponse.json(serialize({ success: true, data: result }));
  } catch (error: any) {
    console.error("PUT ERROR:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await prisma.pengiriman.findFirst({
      where: {
        OR: [
          { id: BigInt(id) },
          { id_penjualan: BigInt(id) }
        ]
      },
      include: {
        penjualan: {
          include: { 
            pelanggan: true,
            details: { include: { obat: true } }
          }
        }
      }
    });

    if (!data) return NextResponse.json({ success: false, message: "Tidak ditemukan" }, { status: 404 });
    return NextResponse.json(serialize({ success: true, data }));
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}