import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

// 1. Konfigurasi Cloudinary (Server-side)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Helper: Serialize BigInt agar tidak error saat dikirim ke Frontend
const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// 3. Helper: Ambil Public ID dari URL Cloudinary untuk penghapusan
const getPublicIdFromUrl = (url: string) => {
  if (!url) return null;
  // Contoh: .../image/upload/v123/jenis_obat/nama_file.jpg -> "jenis_obat/nama_file"
  const parts = url.split("/");
  const fileNameWithExtension = parts.pop(); // "nama_file.jpg"
  const folder = parts.pop(); // "jenis_obat"
  const publicId = `${folder}/${fileNameWithExtension?.split(".")[0]}`;
  return publicId;
};

async function getParams(context: any) { 
  return await context.params; 
}

// ==========================================
// [PUT] - UPDATE KATEGORI & GAMBAR
// ==========================================
export async function PUT(request: NextRequest, context: any) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");

    if (role !== 'admin' && role !== 'pemilik') {
      return NextResponse.json({ success: false, message: "Akses Ditolak!" }, { status: 403 });
    }

    const { id } = await getParams(context);
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    // A. Cari data lama untuk cek apakah ada gambar lama
    const oldData = await prisma.jenisObat.findUnique({
      where: { id: BigInt(id) }
    });

    if (!oldData) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    let updateData: any = {
      jenis: formData.get("nama_jenis") as string,
      deskripsi_jenis: formData.get("deskripsi_jenis") as string || ""
    };

    // B. Logika Upload Gambar Baru & Hapus Gambar Lama
    if (imageFile && imageFile.size > 0) {
      // 1. Hapus gambar lama di Cloudinary jika ada
      if (oldData.image_url) {
        const publicId = getPublicIdFromUrl(oldData.image_url);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      // 2. Upload gambar baru menggunakan Preset
      const arrayBuffer = await imageFile.arrayBuffer();
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
      
      updateData.image_url = uploadResponse.secure_url;
    }

    // C. Update Database
    const data = await prisma.jenisObat.update({
      where: { id: BigInt(id) },
      data: updateData
    });
    
    return NextResponse.json(serialize({ success: true, message: "Berhasil update kategori", data }));

  } catch (error: any) {
    console.error("PUT ERROR:", error);
    return NextResponse.json({ success: false, message: "Gagal update data" }, { status: 500 });
  }
}

// ==========================================
// [DELETE] - HAPUS KATEGORI & GAMBAR
// ==========================================
export async function DELETE(request: NextRequest, context: any) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");

    if (role !== 'admin' && role !== 'pemilik') {
      return NextResponse.json({ success: false, message: "Akses Ditolak!" }, { status: 403 });
    }

    const { id } = await getParams(context);

    // A. Cari data untuk mengambil URL gambarnya
    const dataToDelete = await prisma.jenisObat.findUnique({
      where: { id: BigInt(id) }
    });

    if (!dataToDelete) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    // B. Hapus gambar di Cloudinary
    if (dataToDelete.image_url) {
      const publicId = getPublicIdFromUrl(dataToDelete.image_url);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    // C. Hapus dari database
    await prisma.jenisObat.delete({ 
      where: { id: BigInt(id) } 
    });

    return NextResponse.json({ success: true, message: "Kategori dan gambar berhasil dihapus" });

  } catch (error: any) {
    console.error("DELETE ERROR:", error);

    if (error.code === 'P2003') {
      return NextResponse.json({ 
        success: false, 
        message: "Gagal hapus! Masih ada produk yang menggunakan kategori ini." 
      }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: "Gagal hapus data" }, { status: 500 });
  }
}