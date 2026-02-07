"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart"; // Zustand Hook
import { checkoutService } from "@/services/checkout.service";
import { orderService } from "@/services/order.service";

// Import Komponen Pecahan
import CartItemCard from "@/components/checkout/CartItemCard"; 
import AddressSection from "@/components/checkout/AddressSection";
import ShippingSection from "@/components/checkout/ShippingSection";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";

import { ShoppingBag, PackageSearch, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { token } = useAuth();
  
  // --- AMBIL STATE LANGSUNG DARI ZUSTAND ---
  const { items, getTotal, clearCart } = useCart();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [shippingList, setShippingList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // 1. Pastikan Komponen Mounted (Hydration Next.js)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Fetch Data Pendukung
  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      const currentToken = token || localStorage.getItem("token");
      if (!currentToken) return;

      try {
        const [resShip, resPay, resProfile] = await Promise.all([
          checkoutService.getShippingMethods(currentToken),
          checkoutService.getPaymentMethods(currentToken),
          checkoutService.getProfile(currentToken)
        ]);

        if (resShip.success) {
          // Mapping Biaya berdasarkan Enum Database
          const mappedShipping = resShip.data.map((item: any) => {
            let biaya = 10000;
            // Gunakan 'same day' sesuai Enum di DB (pakai spasi)
            const jenis = item.jenis_kirim?.toLowerCase();
            
            if (jenis === "ekonomi") biaya = 5000;
            if (jenis === "same day") biaya = 25000;
            if (jenis === "kargo") biaya = 40000;
            if (jenis === "regular") biaya = 10000;
            
            return { ...item, biaya };
          });
          setShippingList(mappedShipping);
        }

        if (resPay.success) setPaymentList(resPay.data);
        if (resProfile.success) setUserProfile(resProfile.data);

      } catch (err) {
        toast.error("Gagal memuat data checkout");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [mounted, token]);

  // --- HITUNG TOTAL BERDASARKAN ZUSTAND ---
  // Subtotal diambil dari getTotal() milik useCart
  const subtotal = useMemo(() => Number(getTotal()), [items, getTotal]);
  const shippingCost = selectedShipping?.biaya || 0;
  const biayaApp = items.length > 0 ? 1000 : 0; // Biaya app 0 jika keranjang kosong
  const grandTotal = subtotal + shippingCost + biayaApp;

  const handleCheckout = async () => {
    if (items.length === 0) return toast.error("Keranjang Anda kosong!");
    if (!selectedShipping || !selectedPayment) return toast.error("Lengkapi pilihan pengiriman & pembayaran!");
    if (!userProfile?.alamat1) return toast.error("Alamat belum diatur!");

    setLoading(true);
    try {
      const payload = {
        id_pelanggan: userProfile.id,
        id_jenis_kirim: selectedShipping.id,
        id_metode_bayar: selectedPayment.id,
        ongkos_kirim: shippingCost,
        total_bayar: grandTotal,
        status_order: "Diproses",
        details: items.map(item => ({
          id_obat: item.id,
          jumlah_beli: item.quantity,
          harga_beli: item.harga,
          subtotal: item.harga * item.quantity
        }))
      };

      const res = await orderService.checkout(token || localStorage.getItem("token")!, payload);
      if (res.success) {
        toast.success("Berhasil!");
        clearCart(); // Kosongkan Zustand
        router.push("/pelanggan/orders");
      }
    } catch (err) {
      toast.error("Gagal memproses pesanan");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <header className="mb-10 flex items-center gap-4">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-xl shadow-emerald-100">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">Checkout</h1>
            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-1">Apotek Pro - Finalisasi</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <AddressSection 
              userName={userProfile?.nama_pelanggan} 
              address={userProfile?.alamat1} 
              city={userProfile?.kota1}
              phone={userProfile?.no_telp}
            />

            <ShippingSection 
              list={shippingList} 
              selectedId={selectedShipping?.id} 
              onSelect={setSelectedShipping} 
            />

            <PaymentSection 
              list={paymentList} 
              selectedId={selectedPayment?.id} 
              onSelect={setSelectedPayment} 
            />
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Review Keranjang</h3>
              <div className="space-y-3">
                {/* CEK ITEMS DARI ZUSTAND */}
                {items.length > 0 ? (
                  items.map((item) => <CartItemCard key={item.id} item={item} />)
                ) : (
                  <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                    <PackageSearch size={48} strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase mt-4 tracking-widest">Keranjang Kosong</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28">
              <OrderSummary 
                subtotal={subtotal} 
                shipping={shippingCost} 
                appFee={biayaApp} 
                onCheckout={handleCheckout} 
                loading={loading} 
                isCartEmpty={items.length === 0} 
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}