import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const data = await prisma.jenisObat.findMany();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const data = await prisma.jenisObat.create({
      data: {
        jenis: body.nama_jenis,

        deskripsi_jenis: body.deskripsi_jenis || ""
      }
    });
    
    return NextResponse.json({ success: true, message: "Berhasil tambah jenis", data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal tambah data (Mungkin nama jenis sudah ada)" }, { status: 500 });
  }
}