"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DistributorForm({ isOpen, onClose, onSubmit, initialData }: any) {
  const [formData, setFormData] = useState({ 
    nama_distributor: "", 
    telepon: "", 
    alamat: "" 
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ nama_distributor: "", telepon: "", alamat: "" });
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase text-gray-800">
            {initialData ? "Edit Vendor PBF" : "Tambah Distributor"}
          </DialogTitle>
        </DialogHeader>
        
        <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-gray-400">Nama Perusahaan</Label>
            <Input 
              className="rounded-xl" 
              value={formData.nama_distributor} 
              onChange={(e) => setFormData({...formData, nama_distributor: e.target.value})} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-gray-400">Nomor Telepon / Sales</Label>
            <Input 
              className="rounded-xl" 
              value={formData.telepon} 
              onChange={(e) => setFormData({...formData, telepon: e.target.value})} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-gray-400">Alamat Kantor/Gudang</Label>
            <Textarea 
              className="rounded-xl min-h-25" 
              value={formData.alamat} 
              onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
              required 
            />
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold py-6">
            SIMPAN DATA DISTRIBUTOR
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}