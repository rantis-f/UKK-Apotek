import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const data = await prisma.pelanggan.findMany();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const data = await prisma.pelanggan.create({
      data: {
        nama_pelanggan: body.nama_pelanggan,
        email: body.email,
        katakunci: body.katakunci,
        
        no_telp: body.telp,
        alamat1: body.alamat,
        
        kota1: body.kota || "", 
        propinsi1: body.propinsi || "",
      }
    });
    
    return NextResponse.json({ success: true, message: "Berhasil tambah pelanggan", data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal (Email mungkin duplikat)" }, { status: 500 });
  }
}