import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // Kita simpan sebagai string agar aman
  nama_obat: string;
  harga: number;
  stok: number;
  quantity: number;
  foto?: string | null;
}

interface CartStore {
  items: CartItem[];
  addItem: (input: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (input) => {
        // Karena API kamu membungkus data dalam { success: true, data: { ... } }
        const product = input.data ? input.data : input;
        const items = get().items;

        // 1. Konversi ID (BigInt 1n -> "1")
        const productId = String(product.id);
        
        const existing = items.find((i) => i.id === productId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.id === productId
                ? { ...i, quantity: Math.min(i.quantity + 1, product.stok || 0) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: productId,
                nama_obat: product.nama_obat,
                harga: product.harga,
                stok: product.stok || 0,
                foto: product.image,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, qty) => set({
        items: get().items.map((i) => i.id === id ? { ...i, quantity: qty } : i)
      }),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((acc, item) => {
          return acc + (item.harga * item.quantity);
        }, 0);
      },
    }),
    { name: "cart-storage" }
  )
);