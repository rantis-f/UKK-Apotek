"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart"; // 1. Import useCart
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner"; // Opsional: untuk notifikasi cantik

// Tambahkan prop 'product' agar kita punya data harga, nama, dll.
export default function BuyButton({ product }: { product: any }) {
  const { user } = useAuth();
  const { addItem } = useCart(); // 2. Ambil fungsi addItem
  const router = useRouter();

  const handleBuy = () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return router.push("/login");
    }

    // 3. Masukkan ke Zustand (Otak Global)
    addItem({
      id: product.id,
      nama_obat: product.nama_obat,
      harga: product.harga_jual,
      image: product.foto1,
      stok: product.stok,
      quantity: 1
    });

    // 4. Feedback ke user
    toast.success("Berhasil ditambah ke keranjang!");

    // 5. OPSI: Jika ingin "Beli Sekarang" langsung bayar, arahkan ke checkout
    // router.push("/checkout"); 
  };

  return (
    <Button 
      onClick={handleBuy}
      className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-16 rounded-2xl text-lg font-black shadow-2xl shadow-emerald-100 gap-3 transition-all active:scale-95"
    >
      <ShoppingBag className="w-6 h-6" />
      Beli Sekarang
    </Button>
  );
}