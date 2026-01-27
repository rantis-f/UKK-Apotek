"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { User, Lock, Mail, Save } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Halaman */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">Profile Saya</h2>
        <p className="text-gray-500">Kelola informasi akun dan keamanan Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* KARTU 1: Info Dasar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informasi Pribadi
            </CardTitle>
            <CardDescription>
              Perbarui nama dan kontak Anda di sini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="name" defaultValue="Admin Petugas" className="pl-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" defaultValue="admin@apotek.com" className="pl-10" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 px-6 py-4">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Simpan Perubahan
            </Button>
          </CardFooter>
        </Card>

        {/* KARTU 2: Ganti Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-600" />
              Keamanan
            </CardTitle>
            <CardDescription>
              Ganti password akun Anda secara berkala.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_pass">Password Saat Ini</Label>
              <Input id="current_pass" type="password" placeholder="••••••" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new_pass">Password Baru</Label>
              <Input id="new_pass" type="password" placeholder="Minimal 8 karakter" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_pass">Konfirmasi Password</Label>
              <Input id="confirm_pass" type="password" placeholder="Ulangi password baru" />
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 px-6 py-4">
            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800">
              Update Password
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}