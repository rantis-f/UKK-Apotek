"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import OrderTable from "@/components/admin/OrderTable";
import ShippingModal from "@/components/admin/ShippingModal";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import { shippingService } from "@/services/shipping.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, CheckCircle2, Clock, List } from "lucide-react";

export default function PesananPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const res = await shippingService.getAll(token);
      if (res.success) setOrders(res.data || []);
    } catch (err) { console.error(err); }
  }, [token]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filterOrders = (status: string) => {
    if (status === "semua") return orders;
    return orders.filter((order) => order.status_order === status);
  };

  return (
    <div className="pr-4 pl-2 sm:pr-6 sm:pl-4 lg:p-10 space-y-6 md:space-y-10">
      
      <header className="flex flex-col gap-1 sm:ml-2">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-800 uppercase tracking-tighter">Pesanan</h1>
        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Monitoring & Manajemen Pengiriman</p>
      </header>

      <Tabs defaultValue="semua" className="w-full">
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <TabsList className="bg-gray-100/70 p-1.5 rounded-full inline-flex border border-gray-100/50 ml-1 sm:ml-2">
            <TabsTrigger value="semua" className="tab-pill">
              <List size={16} className="shrink-0" /> <span className="hidden sm:inline">Semua</span>
            </TabsTrigger>
            <TabsTrigger value="Diproses" className="tab-pill">
              <Clock size={16} className="text-amber-500" /> <span className="hidden sm:inline">Perlu Diproses</span>
            </TabsTrigger>
            <TabsTrigger value="Menunggu_Kurir" className="tab-pill">
              <Truck size={16} className="text-blue-500" /> <span className="hidden sm:inline">Sedang Dikirim</span>
            </TabsTrigger>
            <TabsTrigger value="Selesai" className="tab-pill">
              <CheckCircle2 size={16} className="text-emerald-500" /> <span className="hidden sm:inline">Selesai</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {["semua", "Diproses", "Menunggu_Kurir", "Selesai"].map((status) => (
          <TabsContent key={status} value={status} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-gray-50 outline-none mt-2 ml-1 sm:ml-2 overflow-hidden">
            <OrderTable 
              data={filterOrders(status)} 
              onAction={(order: any) => { setSelectedOrder(order); setIsShippingOpen(true); }}
              onView={(order: any) => { setSelectedOrder(order); setIsDetailOpen(true); }}
            />
          </TabsContent>
        ))}
      </Tabs>

      <ShippingModal isOpen={isShippingOpen} onClose={() => setIsShippingOpen(false)} orderData={selectedOrder} token={token} onSuccess={fetchOrders} />
      <OrderDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} data={selectedOrder} />

      <style jsx global>{`
        .tab-pill {
          @apply rounded-full px-4 sm:px-7 py-2.5 font-black uppercase text-[10px] md:text-[11px] tracking-wider
                 text-gray-500 transition-all duration-300 flex items-center gap-3 shrink-0
                 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-gray-900;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}