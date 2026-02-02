"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ArrowLeft, Pill, ShieldCheck, Truck, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function MemberLoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg("");
    const result = await login(data.email, data.password, "pelanggan");

    if (result.success) {
      toast.success("Login Berhasil! Mengalihkan...");
      
      setTimeout(() => {
        window.location.href = "/"; 
      }, 800);
    } else {
      setErrorMsg(result.error || "Gagal masuk.");
      toast.error(result.error || "Login Gagal");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="relative w-full md:w-1/2 h-48 md:h-auto bg-zinc-900 flex flex-col justify-between p-6 md:p-12 overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0 opacity-60 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 z-10 bg-linear-to-t md:bg-linear-to-r from-emerald-950 via-emerald-900/80 to-transparent" />
        <div className="relative z-20 flex items-center gap-2">
          <div className="bg-white text-emerald-700 p-1.5 rounded-lg shadow-lg">
            <Pill className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-bold text-lg md:text-2xl text-white">Ran_Store</span>
        </div>
        <div className="relative z-20 hidden md:block space-y-4 text-white">
          <h1 className="text-4xl font-extrabold leading-tight">Obat Asli<br/> Tanpa Antre</h1>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Asli
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 text-xs">
              <Truck className="w-4 h-4 text-emerald-400" /> Kirim Cepat
            </div>
          </div>
        </div>
        <div className="relative z-20 hidden md:block text-[10px] text-emerald-200/60 uppercase tracking-widest">&copy; 2026 Ran_Store Healthcare</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50/50 relative z-30 -mt-8 md:mt-0 rounded-t-3xl md:rounded-none">
        <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </Link>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Masuk Akun</h2>
            <p className="text-sm text-gray-500">Lanjutkan belanja kebutuhan kesehatan Anda.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMsg && (
              <Alert variant="destructive" className="py-2 bg-red-50 text-red-700 border-red-100">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label className="text-sm">Email</Label>
              <Input {...register("email")} placeholder="nama@email.com" className={errors.email ? 'border-red-500' : ''} />
              {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><Label className="text-sm">Password</Label></div>
              <div className="relative">
                <Input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className={errors.password ? 'border-red-500' : ''} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 shadow-lg shadow-emerald-200" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Masuk Sekarang"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 pt-4 border-t">
            Belum punya akun? <Link href="/register" className="font-bold text-emerald-600 hover:underline">Daftar Gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}