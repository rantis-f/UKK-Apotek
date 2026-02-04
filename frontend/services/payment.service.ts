import { apiRequest } from "@/lib/api-client";

export const paymentService = {
    getAll: (token?: string, params?: any) => {
        const queryParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const queryString = queryParams.toString();
        return apiRequest(`/metode-bayar${queryString ? `?${queryString}` : ""}`, token);
    },

    getById: (id: string, token?: string) =>
        apiRequest(`/metode-bayar/${id}`, token),

    create: (token: string, data: FormData) =>
        apiRequest("/metode-bayar", token, {
            method: "POST",
            body: data
        }),

    update: (token: string, id: string, data: FormData) =>
        apiRequest(`/metode-bayar/${id}`, token, {
            method: "PUT",
            body: data
        }),

    delete: (token: string, id: string) =>
        apiRequest(`/metode-bayar/${id}`, token, {
            method: "DELETE"
        }),
};