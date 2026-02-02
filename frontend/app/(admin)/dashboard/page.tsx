"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Users, Package, Activity,
  Loader2, AlertCircle, ShieldCheck
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStock from "@/components/dashboard/LowStock";
import { dashboardService } from "@/services/dashboard.service";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const userRole = user?.role?.toLowerCase() || user?.jabatan?.toLowerCase();
  const isOwner = userRole === "pemilik";
  const isAdmin = userRole === "admin";
  const isPowerUser = isOwner || isAdmin;
  const isStaffInternal = isPowerUser || userRole === "apoteker" || userRole === "kasir" || userRole === "karyawan";

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    if (!isStaffInternal) {
        setDataLoading(false);
        return;
    }
    
    setDataLoading(true);
    try {
      const result = await dashboardService.getStats(token);
      setData(result.data); 
      
    } catch (error: any) {
      toast.error(error.message || "Gagal mengambil data statistik");
      setData(null);
    } finally {
      setDataLoading(false);
    }
  }, [token, isStaffInternal]);

  useEffect(() => {
    if (!authLoading && token) {
        fetchDashboardData();
    }
  }, [authLoading, token, fetchDashboardData]);

  if (authLoading || (dataLoading && token)) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-emerald-600" />
        <p className="animate-pulse font-bold text-[10px] uppercase tracking-widest">Sinkronisasi Data {userRole}...</p>
      </div>
    );
  }

  if (!isStaffInternal && !authLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-black text-gray-800 uppercase">Akses Terbatas</h2>
        <p className="text-gray-500 max-w-xs mt-2">Akun Anda tidak memiliki izin untuk melihat statistik internal.</p>
        <Button className="mt-6 bg-emerald-600 rounded-2xl px-8" onClick={() => window.location.href = "/"}>Kembali ke Home</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Sistem Terverifikasi</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-800 uppercase">
            Dashboard {userRole}
          </h2>
          <p className="text-sm text-gray-500 font-medium">Selamat bekerja, <span className="text-emerald-600 font-bold">{user?.name || user?.nama_pelanggan}</span>.</p>
        </div>
      </div>

      <div className={`grid gap-4 md:grid-cols-2 ${isPowerUser ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`}>
        {isPowerUser ? (
          <StatsCard
            title="Total Pendapatan"
            value={formatRupiah(data?.cards?.revenue || 0)}
            subValue="Bulan ini"
            icon={DollarSign}
            borderColor="border-l-emerald-500"
            iconColor="text-emerald-500"
          />
        ) : (
          <StatsCard
            title="Total Transaksi"
            value={data?.cards?.total_sales || 0}
            subValue="Hari ini"
            icon={Activity}
            borderColor="border-l-emerald-500"
            iconColor="text-emerald-500"
          />
        )}

        {isPowerUser && (
          <StatsCard
            title="Total Pelanggan"
            value={data?.cards?.total_customers || 0}
            subValue="Member terdaftar"
            icon={Users}
            borderColor="border-l-blue-500"
            iconColor="text-blue-500"
          />
        )}

        <StatsCard
          title="Katalog Obat"
          value={data?.cards?.total_products || 0}
          subValue={`${data?.alerts?.low_stock_count || 0} stok kritis`}
          icon={Package}
          borderColor="border-l-orange-500"
          iconColor="text-orange-500"
        />

        {isPowerUser ? (
          <StatsCard
            title="Total Staff"
            value={data?.cards?.total_staff || 0}
            subValue="Personel aktif"
            icon={ShieldCheck}
            borderColor="border-l-indigo-500"
            iconColor="text-indigo-500"
          />
        ) : (
          <StatsCard
            title="Status Akun"
            value="Aktif"
            subValue={`Role: ${userRole}`}
            icon={ShieldCheck}
            borderColor="border-l-indigo-500"
            iconColor="text-indigo-500"
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders orders={data?.recent_orders || []} />
        </div>
        <div className="h-full">
          <LowStock items={data?.alerts?.low_stock || []} />
        </div>
      </div>
    </div>
  );
}