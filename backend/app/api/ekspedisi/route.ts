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

// --- GET: PUBLIK ---
export async function GET() {
  try {
    const data = await prisma.jenisPengiriman.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(serialize({ success: true, data }));
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

// --- POST: TAMBAH DATA ---
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("nama_ekspedisi") as string;
    const type = formData.get("jenis_kirim") as any;
    const file = formData.get("logo_ekspedisi") as File; // Pakai nama kolom DB

    let logoUrl = ""; 
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "ekspedisi_logo" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        ).end(buffer);
      });
      logoUrl = uploadResponse.secure_url;
    }

    const newExp = await prisma.jenisPengiriman.create({
      data: {
        nama_ekspedisi: name,
        jenis_kirim: type,
        logo_ekspedisi: logoUrl,
      },
    });

    return NextResponse.json(serialize({ success: true, data: newExp }), { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal simpan data" }, { status: 500 });
  }
}