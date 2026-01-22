import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Selamat Datang di Ruang Rahasia Dashboard! 🔓",
    data: {
      info: "Data ini hanya bisa dilihat kalau punya Token.",
      profit: "Rp 100.000.000"
    }
  });
}