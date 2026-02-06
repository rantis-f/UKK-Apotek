"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { orderService } from "@/services/order.service";
import CustomerOrderTable from "@/components/orders/CustomerOrderTable";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, CheckCircle2, Clock, List, ShoppingBag } from "lucide-react";

export default function RiwayatPesananPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) return;
    try {
      const res = await orderService.getMyOrders(currentToken);
      if (res.success) setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filterOrders = (status: string) => {
    if (status === "semua") return orders;
    return orders.filter((order) => order.status_order === status);
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      
      {/* HEADER - Meniru Style Admin */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-800 uppercase tracking-tighter">Riwayat Pesanan</h1>
        <p className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-[0.2em]">Lacak status kesehatan & pengirimanmu</p>
      </header>

      <Tabs defaultValue="semua" className="w-full">
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <TabsList className="bg-gray-100/70 p-1.5 rounded-full inline-flex border border-gray-100/50">
            <TabsTrigger value="semua" className="tab-pill">
              <List size={16} className="shrink-0" /> <span>Semua</span>
            </TabsTrigger>
            <TabsTrigger value="Diproses" className="tab-pill">
              <Clock size={16} className="text-amber-500" /> <span>Diproses</span>
            </TabsTrigger>
            <TabsTrigger value="Menunggu_Kurir" className="tab-pill">
              <Truck size={16} className="text-blue-500" /> <span>Dikirim</span>
            </TabsTrigger>
            <TabsTrigger value="Selesai" className="tab-pill">
              <CheckCircle2 size={16} className="text-emerald-500" /> <span>Selesai</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {["semua", "Diproses", "Menunggu_Kurir", "Selesai"].map((status) => (
          <TabsContent key={status} value={status} className="mt-4 outline-none">
            {filterOrders(status).length > 0 ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
                    <CustomerOrderTable 
                        data={filterOrders(status)} 
                        onView={(order: any) => { setSelectedOrder(order); setIsDetailOpen(true); }}
                    />
                </div>
            ) : (
                <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Belum ada pesanan di kategori ini</p>
                </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal Detail untuk Pelanggan */}
      <OrderDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        data={selectedOrder} 
      />

      {/* Global CSS - Meniru Style Admin */}
      <style jsx global>{`
        .tab-pill {
          @apply rounded-full px-6 py-2.5 font-black uppercase text-[10px] tracking-wider
                 text-gray-500 transition-all duration-300 flex items-center gap-3 shrink-0
                 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-gray-900;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}