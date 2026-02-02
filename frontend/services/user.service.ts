import { apiRequest } from "@/lib/api-client";

export const userService = {
  getAll: (token: string) => 
    apiRequest("/users", token),

  create: (token: string, data: any) => 
    apiRequest("/users", token, { method: "POST", body: data }),

  update: (token: string, id: string, data: any) => 
    apiRequest(`/users/${id}`, token, { method: "PUT", body: data }),

  delete: (token: string, id: string) => 
    apiRequest(`/users/${id}`, token, { method: "DELETE" }),
};