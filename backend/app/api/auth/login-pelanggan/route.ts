import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SignJWT } from "jose";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, katakunci } = body;

        if (!email || !katakunci) {
            return NextResponse.json(
                { success: false, message: "Email dan Katakunci wajib diisi!" },
                { status: 400 }
            );
        }

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

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia-negara");
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

    } catch (error) {
        console.error("Login Pelanggan Error:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}