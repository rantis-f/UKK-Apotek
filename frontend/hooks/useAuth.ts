import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

export interface User {
  id: string | number;
  email: string;
  role: string;
  nama_pelanggan?: string;
  no_telp?: string;
  foto?: string | null;
  url_ktp?: string | null;
  alamat1?: string;
  kota1?: string;
  propinsi1?: string;
  kodepos1?: string;
  name?: string;
  jabatan?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, type: "admin" | "pelanggan") => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  getProfile: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const internalApiRequest = async (
  endpoint: string,
  token?: string | null,
  options: Omit<RequestInit, 'body'> & { body?: any } = {} 
) => {
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!isFormData && options.body) headers.set("Content-Type", "application/json");

  const processedBody = options.body && typeof options.body === "object" && !isFormData 
                        ? JSON.stringify(options.body) 
                        : options.body;

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      body: processedBody as BodyInit,
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Server Error: ${res.status}`);
    }

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || `Error ${res.status}`);
    }

    return json;
  } catch (error: any) {
    console.error("🚨 API ERROR:", error.message);
    throw error;
  }
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      register: async (data: any) => {
        set({ loading: true });
        try {
          const res = await internalApiRequest("/auth/register-pelanggan", null, {
            method: "POST",
            body: data,
          });
          set({ loading: false });
          return { success: true, message: res.message };
        } catch (error: any) {
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },

      login: async (email: string, password: string, type: "admin" | "pelanggan") => {
        set({ loading: true });
        try {
          const path = type === "admin" ? "/auth/login" : "/auth/login-pelanggan";
          const payload = type === "admin" 
            ? { email, password } 
            : { email, katakunci: password };

          const res = await internalApiRequest(path, null, {
            method: "POST",
            body: payload,
          });

          const userData = res.data;
          const token = res.data.token;

          setCookie("token", token, { maxAge: 60 * 60 * 24 });
          setCookie("user", JSON.stringify(userData), { maxAge: 60 * 60 * 24 });

          set({ user: userData, token: token, loading: false });
          return { success: true };
        } catch (error: any) {
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },

      getProfile: async () => {
        const token = get().token || getCookie("token")?.toString();
        if (!token) return;

        try {
          const res = await internalApiRequest("/auth/profile", token, { method: "GET" });
          if (res.success) {
            set({ user: res.data, loading: false });
            setCookie("user", JSON.stringify(res.data));
          }
        } catch (error) {
          set({ loading: false });
          console.error("Gagal sinkron profil:", error);
        }
      },

      logout: () => {
        deleteCookie("token");
        deleteCookie("user");
        set({ user: null, token: null, loading: false });
        window.location.href = "/login";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);