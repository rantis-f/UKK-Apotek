import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, jabatan } = body;

        // Validasi jabatan (Harus sesuai ENUM di database)
        const validJabatan = ['admin', 'apoteker', 'karyawan', 'kasir', 'pemilik'];
        if (!validJabatan.includes(jabatan)) {
            return NextResponse.json({ success: false, message: "Jabatan tidak valid!" }, { status: 400 });
        }

        const userBaru = await prisma.user.create({
            data: {
                name,
                email,
                password, // Nama kolom sesuai image_1c18c3.png (Varchar 255)
                jabatan,
            },
        });

        return NextResponse.json({ success: true, message: "Staf Berhasil Ditambahkan!" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Gagal menambahkan staf" }, { status: 400 });
    }
}