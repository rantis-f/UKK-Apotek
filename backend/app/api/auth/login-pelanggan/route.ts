import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SignJWT } from "jose";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, katakunci } = body;

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET belum di-setting di file .env");
        }

        const secret = new TextEncoder().encode(jwtSecret);

        if (!email || !katakunci) {
            return NextResponse.json(
                { success: false, message: "Email dan Katakunci wajib diisi!" },
                { status: 400 }
            );
        }

        // 4. Cari di Database
        const pelanggan = await prisma.pelanggan.findUnique({
            where: { email: email },
        });

        if (!pelanggan) {
            return NextResponse.json(
                { success: false, message: "Pelanggan tidak ditemukan!" },
                { status: 401 }
            );
        }

        if (pelanggan.katakunci !== katakunci) {
            return NextResponse.json(
                { success: false, message: "Katakunci salah!" },
                { status: 401 }
            );
        }

        const token = await new SignJWT({
            id: pelanggan.id.toString(),
            role: "pelanggan",
            email: pelanggan.email,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1d")
            .sign(secret);

        return NextResponse.json({
            success: true,
            message: "Login Pelanggan Berhasil!",
            data: {
                id: pelanggan.id,
                name: pelanggan.nama_pelanggan,
                role: "pelanggan",
                token: token,
            },
        });

    } catch (error: any) {
        console.error("Login Pelanggan Error:", error.message);
        return NextResponse.json(
            { success: false, message: error.message || "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}