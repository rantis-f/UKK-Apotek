import { apiRequest } from "@/lib/api-client";

export const distributorService = {
  getAll: (token: string) => 
    apiRequest("/distributor", token),
  
  create: (token: string, data: any) => 
    apiRequest("/distributor", token, { method: "POST", body: data }),
  
  update: (token: string, id: string, data: any) => 
    apiRequest(`/distributor/${id}`, token, { method: "PUT", body: data }),
  
  delete: (token: string, id: string) => 
    apiRequest(`/distributor/${id}`, token, { method: "DELETE" }),
};