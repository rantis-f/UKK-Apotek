"use client";

import ProfileDetail from "@/components/profile/ProfileDetail";
import { ArrowLeft, PencilLine, ShieldCheck, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function PelangganProfilePage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span>Kembali ke Toko</span>
          </Link>
          
          <h1 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Pengaturan Akun</h1>
          
          <button 
            onClick={logout}
            className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <ProfileDetail />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-2 border-emerald-100 bg-white hover:bg-emerald-50 hover:border-emerald-200 group transition-all"
            >
              <div className="flex items-center gap-3 w-full text-emerald-700">
                <div className="bg-emerald-100 p-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <PencilLine className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold leading-none">Edit Profil</p>
                  <p className="text-[10px] opacity-70">Ubah nama, foto, dan nomor telepon</p>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-2 border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 group transition-all"
            >
              <div className="flex items-center gap-3 w-full text-gray-700">
                <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-gray-800 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold leading-none">Keamanan</p>
                  <p className="text-[10px] opacity-70">Ganti password dan verifikasi akun</p>
                </div>
              </div>
            </Button>
          </div>

          <div className="p-6 bg-emerald-900 rounded-3xl text-white flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Butuh Bantuan?</p>
              <p className="text-sm font-medium">Hubungi Admin Ran_Store untuk masalah akun.</p>
            </div>
            <button className="relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold transition-all">
              Chat CS
            </button>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>

        </div>
      </main>
    </div>
  );
}