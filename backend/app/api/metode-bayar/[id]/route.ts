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

const getPublicIdFromUrl = (url: string | null) => {
  if (!url || !url.includes("cloudinary")) return null;
  const parts = url.split("/");
  const fileNameWithExt = parts.pop();
  return fileNameWithExt?.split(".")[0] || null;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = BigInt(rawId);

    const oldData = await prisma.metodeBayar.findUnique({ where: { id } });
    if (!oldData) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get("metode_pembayaran") as string;
    const platform = formData.get("tempat_bayar") as string;
    const account = formData.get("no_rekening") as string;
    const imageFile = formData.get("logo") as File;

    let logoUrl = oldData.url_logo;

    if (imageFile && imageFile.size > 0) {
      const oldPublicId = getPublicIdFromUrl(oldData.url_logo);
      if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadRes: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { upload_preset: process.env.CLOUDINARY_PRESET },
          (error, result) => { if (error) reject(error); else resolve(result); }
        ).end(buffer);
      });
      logoUrl = uploadRes.secure_url;
    }

    const updated = await prisma.metodeBayar.update({
      where: { id },
      data: {
        metode_pembayaran: name ? name.substring(0, 30) : "",
        tempat_bayar: platform || null,
        no_rekening: account || null,
        url_logo: logoUrl,
      },
    });

    return NextResponse.json(serialize({ 
      success: true, 
      message: "Berhasil update data!", 
      data: updated 
    }));

  } catch (error: any) {
    console.error("⛔ ERROR BACKEND:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = BigInt(rawId);

    const data = await prisma.metodeBayar.findUnique({ where: { id } });
    if (data?.url_logo) {
      const publicId = getPublicIdFromUrl(data.url_logo);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await prisma.metodeBayar.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}