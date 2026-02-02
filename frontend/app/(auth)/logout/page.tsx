"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
    };

    performLogout();
  }, [logout]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">Sedang mengeluarkan akun...</h1>
        <p className="text-sm text-gray-500">Mohon tunggu sebentar, kami sedang membersihkan sesi Anda.</p>
      </div>
    </div>
  );
}