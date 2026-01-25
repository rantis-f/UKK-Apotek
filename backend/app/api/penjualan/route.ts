import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_pelanggan, id_metode_bayar, id_jenis_kirim, items, ongkos_kirim } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Keranjang belanja kosong!" }, { status: 400 });
    }

    let totalBelanja = 0;

    const detailTransaksi: {
      id_obat: bigint;
      jumlah_beli: number;
      harga_beli: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const obat = await prisma.obat.findUnique({ where: { id: BigInt(item.id_obat) } });

      if (!obat) {
        return NextResponse.json({ success: false, message: `Obat ID ${item.id_obat} tidak ditemukan` }, { status: 404 });
      }

      if (obat.stok < item.jumlah) {
        return NextResponse.json({ success: false, message: `Stok ${obat.nama_obat} tidak cukup!` }, { status: 400 });
      }

      const subtotal = obat.harga_jual * item.jumlah;
      totalBelanja += subtotal;

      detailTransaksi.push({
        id_obat: obat.id,
        jumlah_beli: item.jumlah,
        harga_beli: obat.harga_jual,
        subtotal: subtotal,
      });
    }

    const biayaApp = 1000;
    const ongkir = Number(ongkos_kirim) || 0;
    const grandTotal = totalBelanja + ongkir + biayaApp;

    const hasilTransaksi = await prisma.$transaction(async (tx) => {
      const penjualanBaru = await tx.penjualan.create({
        data: {
          tgl_penjualan: new Date(),
          id_pelanggan: BigInt(id_pelanggan),
          id_metode_bayar: BigInt(id_metode_bayar),
          id_jenis_kirim: BigInt(id_jenis_kirim),
          ongkos_kirim: ongkir,
          biaya_app: biayaApp,
          total_bayar: grandTotal,
          status_order: 'Diproses',
          
          details: {
            create: detailTransaksi
          }
        },
        include: { details: true }
      });

      for (const item of items) {
         await tx.obat.update({
             where: { id: BigInt(item.id_obat) },
             data: { stok: { decrement: item.jumlah } }
         });
      }

      return penjualanBaru;
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi Berhasil!",
      data: hasilTransaksi,
    }, { status: 201 });

  } catch (error) {
    console.error("Transaction Error:", error);
    return NextResponse.json({ success: false, message: "Transaksi Gagal" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_pelanggan = searchParams.get("id_pelanggan");

    const whereClause = id_pelanggan ? { id_pelanggan: BigInt(id_pelanggan) } : {};

    const dataPenjualan = await prisma.penjualan.findMany({
      where: whereClause,
      include: {
        pelanggan: true,
        _count: {
            select: { details: true }
        }
      },
      orderBy: {
        tgl_penjualan: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: dataPenjualan
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil riwayat" }, { status: 500 });
  }
}