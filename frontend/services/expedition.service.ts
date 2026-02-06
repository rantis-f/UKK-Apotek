import { apiRequest } from "@/lib/api-client";

export const expeditionService = {
    // 1. GET ALL - Public (Tanpa Token)
    getAll: (params?: any) => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    queryParams.append(key, value.toString());
                }
            });
        }
        const queryString = queryParams.toString();
        return apiRequest(`/ekspedisi${queryString ? `?${queryString}` : ""}`);
    },

    // 2. GET BY ID - Public (Tanpa Token)
    getById: (id: string) =>
        apiRequest(`/ekspedisi/${id}`),

    // 3. CREATE - Protected (Wajib Token)
    create: (token: string, data: FormData) =>
        apiRequest("/ekspedisi", token, {
            method: "POST",
            body: data
        }),

    // 4. UPDATE - Protected (Wajib Token)
    update: (token: string, id: string, data: FormData) =>
        apiRequest(`/ekspedisi/${id}`, token, {
            method: "PUT",
            body: data
        }),

    // 5. DELETE - Protected (Wajib Token)
    delete: (token: string, id: string) =>
        apiRequest(`/ekspedisi/${id}`, token, {
            method: "DELETE"
        }),
};