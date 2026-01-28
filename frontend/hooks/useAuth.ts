"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = () => {
      const token = Cookies.get("token");
      const userData = Cookies.get("user");

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Cookie rusak, logout paksa...");
          Cookies.remove("token");
          Cookies.remove("user");
        }
      }
      setLoading(false);
    };

    checkLogin();
  }, []);

  const login = async (email: string, password: string, role: "admin" | "pelanggan" = "admin") => {
    try {
      if (!API_URL) {
        throw new Error("❌ FATAL: NEXT_PUBLIC_API_URL belum disetting di .env.local!");
      }

      const endpoint = role === "admin" 
        ? "/auth/login"
        : "/auth/login-pelanggan";


      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal, periksa email/password");
      }

      Cookies.set("token", data.data.token, { expires: 1 });
      
      const userData = { ...data.data.user, role: role }; 
      Cookies.set("user", JSON.stringify(userData), { expires: 1 });

      setUser(userData);
      
      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      
      return { success: true };

    } catch (error: any) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (API_URL) {
        await fetch(`${API_URL}/auth/logout`, { method: "POST" });
      }
    } catch (err) {
      console.log("Server logout error (abaikan)", err);
    }

    const isPelanggan = user?.role === "pelanggan";
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);

    if (isPelanggan) {
      router.replace("/");
    } else {
      router.replace("/login");
    }
  };

  return { user, login, logout, loading };
};