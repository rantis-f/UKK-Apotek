import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";

// Helper untuk BigInt agar tidak error saat return JSON
const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// --- GET: TETAP PUBLIK (Untuk Landing Page & Katalog) ---
export async function GET() {
  try {
    const obat = await prisma.obat.findMany({
      include: { jenis_obat: true },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json(serialize({
      success: true,
      data: obat,
    }));
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
  }
}

// --- POST: HARUS PRIVAT (Hanya Admin/Staff) ---
export async function POST(request: NextRequest) {
  try {
    // 1. Cek Token/Role dari Header (yang dikirim oleh Middleware kamu)
    const headerList = await headers();
    const role = headerList.get("x-user-role"); 

    // 2. Validasi: Hanya staff yang boleh tambah obat
    const staffRoles = ["admin", "pemilik", "apoteker"];
    if (!role || !staffRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Akses Ditolak: Anda bukan Admin/Staff!" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nama_obat, idjenis, harga_jual, stok, foto1 } = body;

    // ... (Validasi input tetap sama)

    const newObat = await prisma.obat.create({
      data: {
        nama_obat,
        idjenis: BigInt(idjenis),
        harga_jual: Number(harga_jual),
        stok: Number(stok) || 0,
        foto1: foto1 || "default.jpg",
        deskripsi_obat: body.deskripsi_obat || "",
      },
    });

    return NextResponse.json(serialize({
      success: true,
      message: "Obat berhasil ditambahkan!",
      data: newObat,
    }), { status: 201 });

  } catch (error) {
    console.error("Error create obat:", error);
    return NextResponse.json({ success: false, message: "Gagal menambah obat" }, { status: 500 });
  }
}