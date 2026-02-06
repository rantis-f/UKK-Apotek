import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper agar BigInt tidak bikin error 500 saat dikirim ke browser
const serialize = (data: any) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  ));
};

export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Standard Next.js 15
) {
  try {
    const { id } = await params; // Wajib di-await!
    const formData = await req.formData();
    const name = formData.get("nama_ekspedisi") as string;
    const type = formData.get("jenis_kirim") as any; 
    const logoData = formData.get("logo_ekspedisi"); // Bisa File atau String URL

    let finalLogoUrl = "";

    // Logika Logo: Cek apakah upload file baru atau pakai URL lama
    if (logoData instanceof File && logoData.size > 0) {
      const arrayBuffer = await logoData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "ekspedisi_logo" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        ).end(buffer);
      });
      finalLogoUrl = uploadResponse.secure_url;
    } else {
      finalLogoUrl = logoData as string; 
    }

    const updated = await prisma.jenisPengiriman.update({
      where: { id: BigInt(id) },
      data: {
        nama_ekspedisi: name,
        jenis_kirim: type, // Prisma nge-map 'same_day' otomatis ke 'same day'
        logo_ekspedisi: finalLogoUrl,
      },
    });

    return NextResponse.json(serialize({ success: true, data: updated }));
  } catch (error: any) {
    console.error("🚨 API ERROR:", error.message);
    return NextResponse.json({ success: false, message: "Gagal update server" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.jenisPengiriman.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true, message: "Dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}