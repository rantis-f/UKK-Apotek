import { apiRequest } from "@/lib/api-client";

export const checkoutService = {
  // 1. Ambil Ekspedisi (Endpoint disesuaikan dengan API GET yang kamu buat tadi)
  getShippingMethods: (token: string) => apiRequest("/ekspedisi", token),

  // 2. Ambil Alamat & Data User (Dari profil)
  getProfile: (token: string) => apiRequest("/auth/profile", token),

  // 3. Ambil Metode Bayar
  getPaymentMethods: (token: string) => apiRequest("/metode-bayar", token),
};