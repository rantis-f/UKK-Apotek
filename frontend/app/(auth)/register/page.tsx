"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  Pill, 
  ShieldCheck, 
  Truck, 
  Eye, 
  EyeOff, 
  Phone 
} from "lucide-react";

const registerSchema = z.object({
  nama_pelanggan: z.string().min(3, { message: "Nama terlalu pendek" }),
  email: z.string().email({ message: "Email tidak valid" }),
  no_telp: z.string().min(10, { message: "Minimal 10 digit" }).max(15, { message: "Maksimal 15 digit" }),
  katakunci: z.string().min(1, { message: "Wajib diisi" }).max(15, { message: "Maksimal 15 karakter" }),
  confirmKunci: z.string().min(1, { message: "Wajib diisi" }),
}).refine((data) => data.katakunci === data.confirmKunci, {
  message: "Password tidak cocok",
  path: ["confirmKunci"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function MemberRegisterPage() {
  const router = useRouter();
  const { register: registerAuth, loading } = useAuth(); // Ambil dari Zustand
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMsg("");
    
    const result = await registerAuth({
        nama_pelanggan: data.nama_pelanggan,
        email: data.email,
        no_telp: data.no_telp,
        katakunci: data.katakunci
    });

    if (result.success) {
      toast.success("Pendaftaran Berhasil! Silakan masuk.");
      router.push("/login");
    } else {
      setErrorMsg(result.error || "Gagal mendaftar.");
      toast.error(result.error || "Pendaftaran Gagal");
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      
      <div className="relative w-full md:w-1/2 h-32 md:h-full bg-emerald-950 flex flex-col justify-between p-6 md:p-12 overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center grayscale" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 z-10 bg-linear-to-br from-emerald-950 via-emerald-900/90 to-emerald-800/20" />
        
        <div className="relative z-20 flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-xl shadow-lg shadow-emerald-950/20">
            <Pill className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="font-bold text-xl text-white tracking-tighter uppercase">Ran_Store</span>
        </div>

        <div className="relative z-20 hidden md:block space-y-4 text-white">
          <h1 className="text-4xl font-black leading-tight uppercase">
            GABUNG JADI <br/><span className="text-emerald-400">MEMBER SEHAT.</span>
          </h1>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Asli
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest">
              <Truck className="w-3.5 h-3.5 text-emerald-400" /> Promo Eksklusif
            </div>
          </div>
        </div>
        
        <div className="relative z-20 hidden md:block text-[9px] text-emerald-300/40 uppercase tracking-[0.3em] font-black text-center md:text-left">
          &copy; 2026 RAN_STORE HEALTHCARE
        </div>
      </div>

      {/* --- SISI KANAN: FORM --- */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-10 bg-gray-50/50 relative z-30 -mt-8 md:mt-0 rounded-t-[2.5rem] md:rounded-none overflow-y-auto">
        <div className="w-full max-w-md space-y-4 bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 leading-none uppercase">DAFTAR AKUN.</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Lengkapi data diri Anda</p>
            </div>
            <Link href="/login" className="text-[10px] font-black text-emerald-600 uppercase hover:underline mb-1">Sudah Member?</Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2">
            {errorMsg && (
              <Alert variant="destructive" className="rounded-xl py-2 px-3 bg-red-50 border-red-100">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-[10px] font-bold text-red-600">{errorMsg}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</Label>
                <Input {...register("nama_pelanggan")} placeholder="Nama" className={`h-10 text-xs rounded-xl ${errors.nama_pelanggan ? 'border-red-500' : ''}`} />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</Label>
                <Input {...register("email")} placeholder="email@anda.com" className={`h-10 text-xs rounded-xl ${errors.email ? 'border-red-500' : ''}`} />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nomor WhatsApp (Maks 15 Digit)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500" />
                <Input {...register("no_telp")} placeholder="0812xxxx" maxLength={15} className={`h-10 pl-9 text-xs rounded-xl ${errors.no_telp ? 'border-red-500' : ''}`} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Katakunci</Label>
                <div className="relative">
                  <Input {...register("katakunci")} type={showPassword ? "text" : "password"} maxLength={15} placeholder="••••" className={`h-10 text-xs rounded-xl ${errors.katakunci ? 'border-red-500' : ''}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Konfirmasi</Label>
                <Input {...register("confirmKunci")} type={showPassword ? "text" : "password"} maxLength={15} placeholder="••••" className={`h-10 text-xs rounded-xl ${errors.confirmKunci ? 'border-red-500' : ''}`} />
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 md:h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-70 mt-4" 
                disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "DAFTAR SEKARANG"}
            </Button>
          </form>

          <div className="pt-4 text-center border-t border-gray-100">
            <Link href="/" className="inline-flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-emerald-600 transition-colors">
                <ArrowLeft className="w-3 h-3 mr-2" /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}