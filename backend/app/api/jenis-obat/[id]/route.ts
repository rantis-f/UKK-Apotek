import { NextResponse } from "next/server";
import prisma from "@/lib/db";

async function getParams(context: any) { return await context.params; }

export async function PUT(request: Request, context: any) {
  try {
    const { id } = await getParams(context);
    const body = await request.json();
    
    const data = await prisma.jenisObat.update({
      where: { id: BigInt(id) },
      data: {
        jenis: body.nama_jenis,
        deskripsi_jenis: body.deskripsi_jenis
      }
    });
    
    return NextResponse.json({ success: true, message: "Berhasil update", data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await getParams(context);
    await prisma.jenisObat.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true, message: "Berhasil hapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal hapus (Mungkin sedang dipakai di obat)" }, { status: 500 });
  }
}