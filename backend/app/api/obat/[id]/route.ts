import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

const getPublicIdFromUrl = (url: string) => {
  if (!url || url === "default.jpg" || url.includes("default.jpg")) return null;
  const parts = url.split("/");
  const fileNameWithExt = parts.pop();
  return fileNameWithExt?.split(".")[0];
};

async function getParams(context: any) { return await context.params; }

export async function PUT(request: NextRequest, context: any) {
  try {
    const { id } = await getParams(context);
    const formData = await request.formData();
    const oldObat = await prisma.obat.findUnique({ where: { id: BigInt(id) } });

    if (!oldObat) return NextResponse.json({ success: false, message: "Obat tidak ditemukan" }, { status: 404 });

    let updateData: any = {
      nama_obat: formData.get("nama_obat") as string,
      idjenis: BigInt(formData.get("idjenis") as string),
      harga_jual: Number(formData.get("harga_jual")),
      stok: Number(formData.get("stok")),
      deskripsi_obat: formData.get("deskripsi_obat") as string || "",
    };

    const photoFields = ["foto1", "foto2", "foto3"];
    for (const field of photoFields) {
      const imageFile = formData.get(field) as File;
      if (imageFile && imageFile.size > 0) {
        const oldUrl = (oldObat as any)[field];
        const publicId = getPublicIdFromUrl(oldUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadRes: any = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { upload_preset: process.env.CLOUDINARY_PRESET },
            (error, result) => { if (error) reject(error); else resolve(result); }
          ).end(buffer);
        });
        updateData[field] = uploadRes.secure_url;
      }
    }

    const data = await prisma.obat.update({ where: { id: BigInt(id) }, data: updateData });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = await getParams(context);
    const obat = await prisma.obat.findUnique({ where: { id: BigInt(id) } });

    if (obat) {
      const photoFields = ["foto1", "foto2", "foto3"];
      for (const field of photoFields) {
        const publicId = getPublicIdFromUrl((obat as any)[field]);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    }

    await prisma.obat.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Gagal hapus" }, { status: 500 });
  }
}