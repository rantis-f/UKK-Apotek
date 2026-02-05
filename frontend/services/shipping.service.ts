import { apiRequest } from "@/lib/api-client";

export const shippingService = {
  getAll: (token: string) => 
    apiRequest("/penjualan", token),

  create: (token: string, data: FormData) =>
    apiRequest("/pengiriman", token, {
      method: "POST",
      body: data,
    }),

  finish: (token: string, id: string, data: FormData) =>
    apiRequest(`/pengiriman/${id}`, token, {
      method: "PUT",
      body: data,
    }),
};