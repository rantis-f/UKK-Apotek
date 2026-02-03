import { NextResponse } from "next/server";
import  prisma from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.distributor.update({
      where: { id: BigInt(id) },
      data: {
        nama_distributor: body.nama_distributor,
        telepon: body.telepon,
        alamat: body.alamat,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.distributor.delete({
      where: { id: BigInt(id) },
    });
    return NextResponse.json({ success: true, message: "Distributor dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}