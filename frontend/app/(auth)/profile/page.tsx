"use client";

import { useEffect } from "react";
import ProfileDetail from "@/components/profile/ProfileDetail";
import { ArrowLeft, PencilLine, ShieldCheck } from "lucide-react"; // BENAR ✅
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function PelangganProfilePage() {
  const { logout, getProfile } = useAuth(); 

  useEffect(() => { getProfile(); }, [getProfile]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-emerald-600 transition-all">
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Kembali</span>
          </Link>
          <h1 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] hidden md:block">Akun Saya</h1>
          <button onClick={logout} className="text-[10px] font-black text-red-500 hover:bg-red-50 px-3 py-1 rounded-md uppercase">Log Out</button>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-6">
        <div className="max-w-xl mx-auto space-y-4">
          <ProfileDetail />
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-xl border-emerald-100 bg-white hover:bg-emerald-50 flex items-center gap-2 px-4 justify-start">
              <PencilLine size={16} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900">Edit Profil</span>
            </Button>
            <Button variant="outline" className="h-12 rounded-xl border-gray-100 bg-white hover:bg-gray-50 flex items-center gap-2 px-4 justify-start">
              <ShieldCheck size={16} className="text-gray-600" />
              <span className="text-xs font-bold text-gray-900">Keamanan</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}