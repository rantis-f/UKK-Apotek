"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, ShoppingBag, CreditCard, Loader2, PackageSearch, ReceiptText } from "lucide-react";
import { kasirService } from "@/services/kasir.service";
import { ProductCard } from "@/components/kasir/ProductCard";
import { CartItem } from "@/components/kasir/CartItem";
import { getCookie } from "cookies-next";

export default function KasirPage() {
  const [obats, setObats] = useState([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  const token = getCookie("token") as string;

  // Load Data Obat
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await kasirService.getAllProducts(token);
        if (res.success) setObats(res.data);
      } catch (error: any) {
        toast.error("Gagal sinkronisasi data produk");
      }
    };
    if (token) loadData();
  }, [token]);

  // Logika Keranjang
  const addToCart = (obat: any) => {
    const existing = cart.find((i) => i.id === obat.id);
    if (existing) {
      if (existing.qty >= obat.stok) return toast.error("Stok gudang tidak mencukupi!");
      updateQty(obat.id, 1);
    } else {
      setCart([...cart, { ...obat, qty: 1 }]);
      toast.success(`${obat.nama_obat} ditambahkan`);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  // Perhitungan Biaya
  const subtotal = cart.reduce((acc, i) => acc + i.harga_jual * i.qty, 0);
  const biayaApp = cart.length > 0 ? 1000 : 0;
  const grandTotal = subtotal + biayaApp;

  // Proses Checkout Kasir
  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Keranjang kosong!");
    
    setLoading(true);
    const payload = {
      id_pelanggan: "1", // Walk-in Customer
      id_metode_bayar: "1", // Tunai
      id_jenis_kirim: "1", // Take Away
      ongkos_kirim: 0,
      biaya_app: biayaApp,
      total_bayar: grandTotal,
      details: cart.map((i) => ({ 
        id_obat: i.id, 
        jumlah_beli: i.qty, 
        harga_beli: i.harga_jual,
        subtotal: i.harga_jual * i.qty
      })),
    };

    try {
      const res = await kasirService.checkout(token, payload);
      if (res.success) {
        toast.success("Transaksi Berhasil Disimpan!");
        setCart([]);
      }
    } catch (error: any) {
      toast.error("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 h-[calc(100vh-40px)] bg-[#F8FAFC]">
      
      {/* --- BAGIAN KIRI: GRID PRODUK (LEBIH LEGA) --- */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <header className="flex flex-col gap-1 ml-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Point of Sale</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Kasir Utama • Ran_Store</p>
        </header>

        {/* Search Bar */}
        <div className="relative group ml-2">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-none shadow-sm shadow-blue-100/20 focus:ring-2 focus:ring-blue-500 font-bold text-sm bg-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid Produk - 3 Kolom Maksimal */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-10 scrollbar-hide ml-2">
          {obats
            .filter((o: any) => o.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((o: any) => (
              <ProductCard key={o.id} obat={o} onAdd={addToCart} />
            ))}
            
          {obats.length === 0 && !loading && (
             <div className="col-span-full py-20 text-center opacity-20">
                <PackageSearch size={64} className="mx-auto mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">Produk tidak ditemukan</p>
             </div>
          )}
        </div>
      </div>

      {/* --- BAGIAN KANAN: KERANJANG (LEBIH RAMPING - 340px) --- */}
      <aside className="w-full lg:w-[340px] bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/40 p-6 flex flex-col border border-blue-50 transition-all">
        
        {/* Header Keranjang */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
            <ShoppingBag size={18} />
          </div>
          <h2 className="font-black text-gray-800 uppercase tracking-tighter text-base">Keranjang</h2>
        </div>

        {/* List Item */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-8 pr-1 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20 py-10">
              <ShoppingBag size={56} strokeWidth={1} className="mb-4" />
              <p className="font-black text-[10px] uppercase tracking-widest text-center">Belum ada item<br/>terpilih</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQty={updateQty}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>

        {/* Ringkasan & Tombol Bayar */}
        <div className="pt-6 border-t-2 border-dashed border-gray-100 space-y-6">
          <div className="space-y-2 px-2">
            <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <span>Biaya App</span>
              <span>Rp {biayaApp.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-end pt-4">
              <div className="flex flex-col">
                <span className="font-black text-[10px] text-gray-900 uppercase tracking-widest">Grand Total</span>
                <span className="text-[8px] text-blue-500 font-bold italic uppercase tracking-tighter">Sudah Pajak</span>
              </div>
              <span className="font-black text-2xl text-blue-600 tracking-tighter">
                Rp {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            disabled={loading || cart.length === 0}
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 uppercase text-[11px] tracking-widest transition-all active:scale-95 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CreditCard size={18} />
            )}
            {loading ? "MEMPROSES..." : "BAYAR SEKARANG"}
          </button>
        </div>
      </aside>
      
      {/* Global CSS for Hide Scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}