import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";
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
    const data = await prisma.jenisObat.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(serialize({ success: true, data }));
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");

    if (role !== 'admin' && role !== 'pemilik') {
      return NextResponse.json(
        { success: false, message: "Akses Ditolak!" },
        { status: 403 }
      );
    }

    // 1. Ambil data via FormData
    const formData = await request.formData();
    const nama_jenis = formData.get("nama_jenis") as string;
    const deskripsi_jenis = formData.get("deskripsi_jenis") as string;
    const imageFile = formData.get("image") as File; // 'image' adalah name di input frontend

    if (!nama_jenis) {
      return NextResponse.json({ success: false, message: "Nama jenis wajib diisi" }, { status: 400 });
    }

    let image_url = "";

    // 2. Proses Upload ke Cloudinary jika ada file
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            upload_preset: process.env.CLOUDINARY_PRESET
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      image_url = uploadResponse.secure_url;
    }

    // 3. Simpan ke Database
    const data = await prisma.jenisObat.create({
      data: {
        jenis: nama_jenis,
        deskripsi_jenis: deskripsi_jenis || "",
        image_url: image_url, // Link dari Cloudinary masuk sini
      }
    });
    
    return NextResponse.json(serialize({ 
      success: true, 
      message: "Berhasil tambah jenis obat dengan gambar", 
      data 
    }), { status: 201 });

  } catch (error: any) {
    console.error("POST KATEGORI ERROR:", error.message);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}