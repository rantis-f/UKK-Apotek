"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function UserForm({ isOpen, onClose, onSubmit, initialData }: any) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", jabatan: "karyawan" });

  useEffect(() => {
    if (initialData) setFormData({ ...initialData, password: "" });
    else setFormData({ name: "", email: "", password: "", jabatan: "karyawan" });
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight text-gray-800">
            {initialData ? "Edit Akun Staff" : "Tambah Staff Baru"}
          </DialogTitle>
        </DialogHeader>
        
        <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Lengkap</Label>
            <Input className="rounded-xl border-gray-100" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
            <Input type="email" className="rounded-xl border-gray-100" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Password {initialData && "(Kosongkan jika tidak ganti)"}
            </Label>
            <Input type="password" className="rounded-xl border-gray-100" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!initialData} />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hak Akses (Role)</Label>
            <select 
              className="w-full h-10 px-3 rounded-xl border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={formData.jabatan}
              onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
            >
              <option value="admin">Admin</option>
              <option value="apoteker">Apoteker</option>
              <option value="kasir">Kasir</option>
              <option value="pemilik">Pemilik</option>
              <option value="karyawan">Karyawan</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold py-6 mt-4">
            SIMPAN PERUBAHAN
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}