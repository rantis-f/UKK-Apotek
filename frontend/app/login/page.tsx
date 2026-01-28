"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  EyeOff 
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function MemberLoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg("");
    const result = await login(data.email, data.password, "pelanggan");
    if (!result.success) {
      setErrorMsg(result.error || "Login gagal. Cek kembali email & password Anda.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      <div className="relative w-full md:w-1/2 h-48 md:h-auto bg-zinc-900 flex flex-col justify-between p-6 md:p-12 overflow-hidden shrink-0">
        <div 
          className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 z-10 bg-linear-to-t md:bg-linear-to-r from-emerald-950 via-emerald-900/80 to-transparent" />

        <div className="relative z-20 flex items-center gap-2">
          <div className="bg-white text-emerald-700 p-1.5 rounded-lg shadow-lg">
            <Pill className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-bold text-lg md:text-2xl text-white">Ran_Store</span>
        </div>

        <div className="relative z-20 hidden md:block space-y-4">
          <h1 className="text-4xl font-extrabold text-white leading-tight">Beli Obat <br/> Tanpa Antre.</h1>
          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-2 bg-emerald-800/40 backdrop-blur-sm p-2 rounded-lg border border-emerald-500/30 text-white text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Asli
            </div>
            <div className="flex items-center gap-2 bg-emerald-800/40 backdrop-blur-sm p-2 rounded-lg border border-emerald-500/30 text-white text-xs">
              <Truck className="w-4 h-4 text-emerald-400" /> Kirim Cepat
            </div>
          </div>
        </div>

        <div className="relative z-20 hidden md:flex">
          <p className="text-[10px] text-emerald-200/60">&copy; 2026 Ran_Store Healthcare.</p>
        </div>
      </div>

      {/* SISI KANAN (FORM LOGIN + ZOD) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50/50 relative z-30 -mt-8 md:mt-0 rounded-t-3xl md:rounded-none">
        <div className="w-full max-w-sm space-y-6 md:space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-xl md:shadow-none border border-gray-100 md:border-none">
          
          <Link href="/" className="inline-flex items-center text-xs md:text-sm font-medium text-gray-400 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Kembali ke Toko
          </Link>

          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Masuk Akun</h2>
            <p className="text-xs md:text-sm text-gray-500">Gunakan akun member Anda untuk berbelanja.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
            {errorMsg && (
              <Alert variant="destructive" className="py-2 text-xs">
                <AlertCircle className="h-3 w-3 mr-2" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                {...register("email")}
                placeholder="nama@email.com" 
                className={`h-10 md:h-11 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-[10px] text-emerald-600">Lupa password?</Link>
              </div>
              <div className="relative">
                <Input 
                  {...register("password")}
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={`h-10 md:h-11 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <Button className="w-full h-10 md:h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Masuk Sekarang"}
            </Button>
          </form>

          <div className="text-center text-xs md:text-sm text-gray-500 pt-2">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="font-bold text-emerald-600 hover:underline">
              Daftar Member
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}