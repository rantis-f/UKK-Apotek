import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email dan Password wajib diisi!" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Email tidak terdaftar!" },
                { status: 401 }
            );
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Password salah!" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia-apotek");
        const token = await new SignJWT({
            id: user.id.toString(),
            role: user.jabatan,
            email: user.email,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1d")
            .sign(secret);

        return NextResponse.json({
            success: true,
            message: "Login Berhasil!",
            data: {
                id: user.id,
                name: user.name,
                role: user.jabatan,
                token: token,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}