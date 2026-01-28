"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Users, 
  Package, 
  Activity, 
  ShoppingBag, 
  History, 
  Loader2 
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  // 1. TAMPILAN LOADING (Biar gak kedip)
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Memuat data...
      </div>
    );
  }

  // =========================================================
  // 🦁 TAMPILAN KHUSUS ADMIN (STATISTIK TOKO)
  // =========================================================
  if (user?.role === "admin") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Dashboard Admin</h2>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Download Laporan</Button>
        </div>
        
        {/* Statistik Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 45.231.000</div>
              <p className="text-xs text-muted-foreground">+20.1% bulan ini</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pelanggan Baru</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">+180 minggu ini</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stok Obat</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,234</div>
              <p className="text-xs text-muted-foreground">15 butuh restock</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaksi Aktif</CardTitle>
              <Activity className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 sejak kemarin</p>
            </CardContent>
          </Card>
        </div>

        {/* Bisa tambah grafik disini nanti */}
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500 shadow-sm">
          <p>Grafik Penjualan akan muncul di sini...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // 🐰 TAMPILAN KHUSUS PELANGGAN (MEMBER AREA)
  // =========================================================
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">
          Halo, {user?.name || "Pelanggan"}! 👋
        </h2>
        <p className="text-gray-500">Selamat datang kembali di Ran_Apotek. Sehat selalu ya!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Banner Belanja */}
        <Card className="col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Butuh Obat Apa Hari Ini?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-emerald-50">Cari obat, vitamin, dan kebutuhan kesehatanmu dengan mudah.</p>
            <Link href="/dashboard/shop">
              <Button variant="secondary" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold">
                <ShoppingBag className="mr-2 h-4 w-4" /> Mulai Belanja
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: Status Pesanan Terakhir */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5 text-gray-500" /> Pesanan Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-emerald-500 pl-4 py-1">
                <p className="font-medium text-gray-900">Paracetamol & Vitamin C</p>
                <p className="text-sm text-gray-500">24 Jan 2026 • Selesai</p>
              </div>
              <Button variant="outline" className="w-full text-gray-600" asChild>
                 <Link href="/dashboard/transaksi">Lihat Semua Riwayat</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Promo Banner (Hiasan) */}
      <div className="rounded-xl bg-orange-50 border border-orange-100 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-orange-700 text-lg">Diskon Member 10% 🎉</h3>
          <p className="text-orange-600 text-sm">Khusus pembelian Vitamin di atas Rp 50.000</p>
        </div>
        <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-100">Cek Promo</Button>
      </div>
    </div>
  );
}