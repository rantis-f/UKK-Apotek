import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const [
      totalPendapatan,
      jumlahTransaksi,
      jumlahPelanggan,
      jumlahObat,
      stokMenipis,
      transaksiTerbaru,
      grafikMingguan
    ] = await Promise.all([

      prisma.penjualan.aggregate({
        _sum: { total_bayar: true },
        where: { status_order: 'Selesai' }
      }),

      prisma.penjualan.count(),

      prisma.pelanggan.count(),

      prisma.obat.count(),

      prisma.obat.findMany({
        where: { stok: { lte: 10 } },
        take: 5,
        orderBy: { stok: 'asc' }
      }),

      prisma.penjualan.findMany({
        take: 5,
        orderBy: { tgl_penjualan: 'desc' },
        include: { pelanggan: true }
      }),

      prisma.penjualan.findMany({
        where: {
          tgl_penjualan: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        },
        select: {
          tgl_penjualan: true,
          total_bayar: true
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: "Data Dashboard Berhasil Dimuat",
      data: {
        cards: {
          revenue: totalPendapatan._sum.total_bayar || 0,
          total_sales: jumlahTransaksi,
          total_users: jumlahPelanggan,
          total_products: jumlahObat,
        },
        alerts: {
          low_stock: stokMenipis,
        },
        recent_orders: transaksiTerbaru,
        chart_data: grafikMingguan
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ success: false, message: "Gagal memuat dashboard" }, { status: 500 });
  }
}