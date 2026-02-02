"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ShieldCheck, Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login(values.email, values.password, "admin");

    if (result.success) {
      toast.success("Login Berhasil! Mengalihkan ke Dashboard...");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      toast.error(result.error || "Akses ditolak. Periksa email & password staff.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden">
        <div className="h-1 w-full bg-emerald-600" />
        <CardHeader className="text-center space-y-2 pb-6 pt-8">
          <div className="mx-auto bg-emerald-500/10 p-4 rounded-full w-fit mb-2 border border-emerald-500/20 text-emerald-500">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <CardTitle className="text-xl font-black text-white tracking-widest uppercase">Administrator</CardTitle>
          <CardDescription className="text-zinc-500 text-[10px] uppercase tracking-[0.3em]">Ran_Store Internal</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-tighter">Email Staff</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-2.5 text-zinc-600 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  {...register("email")}
                  className={`bg-zinc-950 border-zinc-800 text-white pl-9 focus:border-emerald-600 transition-all ${errors.email ? 'border-red-500/50' : ''}`}
                  placeholder="admin@ranstore.com"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500/80 font-medium italic">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-tighter">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 text-zinc-600 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`bg-zinc-950 border-zinc-800 text-white pl-9 pr-9 focus:border-emerald-600 transition-all ${errors.password ? 'border-red-500/50' : ''}`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-600 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500/80 font-medium italic">{errors.password.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-8">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black tracking-widest h-11 rounded-lg shadow-lg shadow-emerald-900/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "OTORISASI MASUK"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}