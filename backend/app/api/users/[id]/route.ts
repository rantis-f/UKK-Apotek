import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id) throw new Error("ID tidak ditemukan");

        const body = await req.json();
        const { name, email, password, jabatan } = body;

        let updateData: any = { name, email, jabatan };

        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // 2. Sekarang BigInt(id) tidak akan undefined lagi
        const updatedUser = await prisma.user.update({
            where: { id: BigInt(id) },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            message: "User berhasil diupdate",
            data: updatedUser
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await prisma.user.delete({
            where: { id: BigInt(id) },
        });

        return NextResponse.json({ success: true, message: "User berhasil dihapus" });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 400 });
    }
}