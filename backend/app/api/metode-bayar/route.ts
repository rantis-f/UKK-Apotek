import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

export async function GET() {
  try {
    const data = await prisma.metodeBayar.findMany({
      orderBy: { id: "desc" }
    });
    
    return NextResponse.json(serialize({ 
      success: true, 
      data 
    }));
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Gagal mengambil data" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("metode_pembayaran") as string;
    const platform = formData.get("tempat_bayar") as string;
    const account = formData.get("no_rekening") as string;
    const file = formData.get("logo") as File;

    let logoUrl = ""; 

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { upload_preset: process.env.CLOUDINARY_PRESET },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      logoUrl = uploadResponse.secure_url;
    }

    const newPayment = await prisma.metodeBayar.create({
      data: {
        metode_pembayaran: name,
        tempat_bayar: platform,
        no_rekening: account || "",
        url_logo: logoUrl,
      },
    });

    return NextResponse.json(serialize({ 
      success: true,
      message: "Metode pembayaran berhasil disimpan!", 
      data: newPayment 
    }), { status: 201 });

  } catch (error: any) {
    console.error("Error POST:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Terjadi kesalahan server saat menyimpan data" 
    }, { status: 500 });
  }
}