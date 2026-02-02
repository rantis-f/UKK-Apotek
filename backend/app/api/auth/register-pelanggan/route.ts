import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Fungsi pembantu untuk menangani BigInt agar tidak error saat dikirim ke Frontend
const serializeData = (data: any) => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
    );
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // 1. Ambil no_telp dari body request
        const { nama_pelanggan, email, katakunci, no_telp } = body;

        // 2. Validasi: Pastikan semua field wajib sudah diisi
        if (!nama_pelanggan || !email || !katakunci || !no_telp) {
            return NextResponse.json(
                { success: false, message: "Semua data (Nama, Email, Katakunci, No. Telp) wajib diisi!" },
                { status: 400 }
            );
        }

        // 3. Validasi panjang karakter (Sesuai batasan Varchar(15) di database kamu)
        if (katakunci.length > 15) {
            return NextResponse.json(
                { success: false, message: "Katakunci terlalu panjang (Maks 15 karakter)!" },
                { status: 400 }
            );
        }

        if (no_telp.length > 15) {
            return NextResponse.json(
                { success: false, message: "Nomor Telepon terlalu panjang (Maks 15 karakter)!" },
                { status: 400 }
            );
        }

        // 4. Proses Simpan ke Database
        const pelangganBaru = await prisma.pelanggan.create({
            data: {
                nama_pelanggan,
                email,
                katakunci,
                no_telp, // Sekarang aman, TS tidak akan protes lagi
            },
        });

        return NextResponse.json({ 
            success: true, 
            message: "Pendaftaran Pelanggan Berhasil!",
            data: serializeData(pelangganBaru) // Gunakan serializeData agar BigInt aman
        });

    } catch (error: any) {
        console.error("Register Error:", error.message);
        
        // Cek jika email sudah ada (Unique constraint error)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "Email sudah terdaftar!" }, 
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server internal" }, 
            { status: 500 }
        );
    }
}