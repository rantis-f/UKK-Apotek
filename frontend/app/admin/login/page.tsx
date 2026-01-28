"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Loader2, AlertCircle, Lock, Mail, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
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

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg("");
    const result = await login(values.email, values.password, "admin");
    if (!result.success) {
      setErrorMsg("Kredensial salah atau akses ditolak.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />

      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto bg-emerald-500/10 p-4 rounded-full w-fit mb-2 border border-emerald-500/20 text-emerald-500">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <CardTitle className="text-xl font-bold text-white tracking-wide">ADMINISTRATOR</CardTitle>
          <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest">Ran_Store Internal System</CardDescription>
        </CardHeader>

        {/* 👇 3. PAKAI handleSubmit DARI HOOK FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {errorMsg && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-900 text-red-200 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs font-semibold uppercase">Email Staff</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-2.5 text-zinc-600 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                <Input 
                  {...register("email")} // 👈 Register field
                  className={`bg-zinc-950 border-zinc-800 text-white pl-9 focus:border-emerald-600 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="admin@ranstore.com"
                />
              </div>
              {/* Tampilkan Error Email */}
              {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs font-semibold uppercase">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 text-zinc-600 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                <Input 
                  {...register("password")} // 👈 Register field
                  type={showPassword ? "text" : "password"}
                  className={`bg-zinc-950 border-zinc-800 text-white pl-9 pr-9 focus:border-emerald-600 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-zinc-600 hover:text-emerald-500">
                   {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-medium">{errors.password.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-8">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "MASUK PANEL"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}