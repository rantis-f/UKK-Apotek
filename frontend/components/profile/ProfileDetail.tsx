"use client";

import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Map, Home, Briefcase, Navigation } from "lucide-react";

export default function ProfileDetail() {
  const { user } = useAuth();
  if (!user) return <div className="p-10 text-center animate-pulse text-[10px] text-gray-400 uppercase tracking-widest">Memuat Data...</div>;

  const isStaff = !!user.jabatan; 
  const displayName = isStaff ? user.name : (user.nama_pelanggan || "User");
  const displayRole = isStaff ? user.jabatan : "MEMBER";

  const formatAddr = (addr?: string | null, city?: string | null) => {
    if (!addr) return null;
    return (
      <div className="space-y-0.5">
        <p className="text-[12px] text-gray-800 font-bold leading-tight">{addr}</p>
        <p className="text-[10px] text-gray-400 font-medium">{city || "Kota belum diset"}</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 md:p-7 shadow-sm space-y-7">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-4 border-emerald-50 shadow-sm">
          <AvatarImage src={user.foto || ""} />
          <AvatarFallback className="bg-emerald-600 text-white font-black text-xl">{displayName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-900 leading-none">{displayName}</h2>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${isStaff ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>{displayRole}</span>
            {/* Email & Phone: Uppercase dihapus agar email tetap huruf kecil */}
            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
               <span className="flex items-center gap-1 normal-case font-medium tracking-tight">
                 <Mail size={10} className="text-emerald-500" /> {user.email}
               </span>
               {user.no_telp && (
                 <span className="flex items-center gap-1">
                   <Phone size={10} className="text-emerald-500" /> {user.no_telp}
                 </span>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS SECTION */}
      {!isStaff && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 relative">
            <div className="absolute -top-2 right-4 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Utama</div>
            <Home size={14} className="text-emerald-600 mb-2" />
            {formatAddr(user.alamat1, user.kota1) || <p className="text-[10px] italic text-gray-400">Belum diatur</p>}
          </div>
          <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <Briefcase size={14} className="text-gray-400 mb-2" />
            {formatAddr(user.alamat2, user.kota2) || <p className="text-[10px] italic text-gray-400">Alamat 2 Kosong</p>}
          </div>
          <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <Navigation size={14} className="text-gray-400 mb-2" />
            {formatAddr(user.alamat3, user.kota3) || <p className="text-[10px] italic text-gray-400">Alamat 3 Kosong</p>}
          </div>
        </div>
      )}
    </div>
  );
}