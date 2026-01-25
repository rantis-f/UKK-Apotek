import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const dataPembelian = await prisma.pembelian.findMany({
      include: {
        distributor: true,
        details: {
          include: { obat: true }
        }
      },
      orderBy: {
        tgl_pembelian: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: dataPembelian });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_distributor, items } = body; 

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Daftar barang kosong!" }, { status: 400 });
    }

    const noNota = `BUY-${Date.now()}`;

    let totalBayar = 0;

    const detailPembelian: {
      id_obat: bigint;
      jumlah_beli: number;
      harga_beli: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const subtotal = item.jumlah * item.harga_beli;
      totalBayar += subtotal;

      detailPembelian.push({
        id_obat: BigInt(item.id_obat),
        jumlah_beli: Number(item.jumlah),
        harga_beli: Number(item.harga_beli),
        subtotal: subtotal
      });
    }

    const hasil = await prisma.$transaction(async (tx) => {
      const pembelianBaru = await tx.pembelian.create({
        data: {
          nonota: noNota,
          tgl_pembelian: new Date(),
          total_bayar: totalBayar,
          id_distributor: BigInt(id_distributor),
          details: {
            create: detailPembelian
          }
        },
        include: { details: true }
      });

      for (const item of items) {
        await tx.obat.update({
          where: { id: BigInt(item.id_obat) },
          data: { 
            stok: { increment: Number(item.jumlah) }
          }
        });
      }

      return pembelianBaru;
    });

    return NextResponse.json({
      success: true,
      message: "Restock Berhasil! Stok obat bertambah.",
      data: hasil
    }, { status: 201 });

  } catch (error) {
    console.error("Restock Error:", error);
    return NextResponse.json({ success: false, message: "Gagal restock barang" }, { status: 500 });
  }
}