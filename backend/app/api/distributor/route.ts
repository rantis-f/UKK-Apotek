import { NextResponse } from "next/server";
import prisma from "@/lib/db";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET() {
  try {
    const distributors = await prisma.distributor.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ success: true, data: distributors });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newDistributor = await prisma.distributor.create({
      data: {
        nama_distributor: body.nama_distributor,
        telepon: body.telepon,
        alamat: body.alamat,
      },
    });
    return NextResponse.json({ success: true, data: newDistributor });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}