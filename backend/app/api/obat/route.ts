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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const search = searchParams.get("q") || "";

    const queryOptions: any = {
      where: { nama_obat: { contains: search } },
      include: { jenis_obat: true },
      orderBy: { id: 'desc' },
    };

    if (limit && !isNaN(parseInt(limit))) {
      queryOptions.take = parseInt(limit);
    }

    const obat = await prisma.obat.findMany(queryOptions);
    return NextResponse.json(serialize({ success: true, data: obat }));
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");
    if (role !== 'admin' && role !== 'pemilik' && role !== 'apoteker') {
      return NextResponse.json({ success: false, message: "Forbidden!" }, { status: 403 });
    }

    const formData = await request.formData();
    const photoFields = ["foto1", "foto2", "foto3"];
    let imageUrls: any = { foto1: "default.jpg", foto2: "default.jpg", foto3: "default.jpg" };

    // Proses upload untuk ketiga foto
    for (const field of photoFields) {
      const imageFile = formData.get(field) as File;
      if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResponse: any = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { upload_preset: process.env.CLOUDINARY_PRESET },
            (error, result) => { if (error) reject(error); else resolve(result); }
          ).end(buffer);
        });
        imageUrls[field] = uploadResponse.secure_url;
      }
    }

    const newObat = await prisma.obat.create({
      data: {
        nama_obat: formData.get("nama_obat") as string,
        idjenis: BigInt(formData.get("idjenis") as string),
        harga_jual: Number(formData.get("harga_jual")),
        stok: Number(formData.get("stok")) || 0,
        deskripsi_obat: formData.get("deskripsi_obat") as string || "",
        ...imageUrls
      },
    });

    return NextResponse.json(serialize({ success: true, data: newObat }), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}