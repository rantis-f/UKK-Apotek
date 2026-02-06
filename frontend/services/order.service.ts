import { apiRequest } from "@/lib/api-client";

export const orderService = {
  // Pelanggan melakukan checkout
  checkout: (token: string, data: any) => 
    apiRequest("/orders", token, { 
      method: "POST", 
      body: data 
    }),

  // Pelanggan melihat riwayat belanja sendiri
  getMyOrders: (token: string) => 
    apiRequest("/orders/my", token),

  // Admin melihat semua order masuk
  adminGetAll: (token: string) => 
    apiRequest("/admin/orders", token),
};