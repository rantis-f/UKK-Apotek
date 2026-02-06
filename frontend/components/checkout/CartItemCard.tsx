"use client";
import { CartItem, useCart } from "@/hooks/useCart";
import { Trash2, Plus, Minus, Pill } from "lucide-react";

export default function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-emerald-100 group">
      <div className="h-16 w-16 bg-emerald-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
        {item.foto ? (
          <img src={item.foto} alt={item.nama_obat} className="w-full h-full object-cover" />
        ) : (
          <Pill className="text-emerald-200" size={24} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-black text-gray-800 truncate">{item.nama_obat}</h4>
        <p className="text-xs font-bold text-emerald-600">
          Rp {(Number(item.harga) || 0).toLocaleString("id-ID")}
        </p>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
        <button 
          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          className="p-1.5 hover:bg-white rounded-lg transition-all active:scale-90"
        >
          <Minus size={12} />
        </button>
        <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.id, Math.min(item.stok, item.quantity + 1))}
          className="p-1.5 hover:bg-white rounded-lg transition-all active:scale-90"
        >
          <Plus size={12} />
        </button>
      </div>

      <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  );
}