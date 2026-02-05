"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, Upload, CheckCircle, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { shippingService } from "@/services/shipping.service";

export default function ShippingModal({ isOpen, onClose, orderData, token, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({ nama_kurir: "", telpon_kurir: "" });

  const isFinishMode = orderData?.status_order === "Menunggu_Kurir";

  useEffect(() => {
    if (!isOpen) {
      setFormData({ nama_kurir: "", telpon_kurir: "" });
      setFile(null); setPreview("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Token tidak ditemukan");

    setLoading(true);
    const data = new FormData();
    data.append("id_penjualan", orderData.id.toString());
    
    try {
      let res;
      if (isFinishMode) {
        if (!file) throw new Error("Upload foto bukti dulu!");
        data.append("bukti_foto", file);
        res = await shippingService.finish(token, orderData.id.toString(), data);
      } else {
        data.append("nama_kurir", formData.nama_kurir);
        data.append("telpon_kurir", formData.telpon_kurir);
        data.append("no_invoice", orderData.no_invoice || `INV-${orderData.id}`);
        res = await shippingService.create(token, data);
      }

      if (res.success) {
        toast.success("Berhasil diperbarui!");
        onSuccess(); onClose();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border-none shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4 font-black text-gray-800 uppercase text-lg sm:text-2xl tracking-tighter">
            <div className={`p-3 rounded-2xl text-white shadow-lg shrink-0 ${isFinishMode ? 'bg-emerald-600' : 'bg-blue-600'}`}>
              {isFinishMode ? <CheckCircle size={24} /> : <Truck size={24} />}
            </div>
            <div className="flex flex-col">
              <span>{isFinishMode ? "Selesaikan" : "Input Kurir"}</span>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">Konfirmasi Pengiriman</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {isFinishMode ? (
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                <ImageIcon size={14}/> Foto Bukti Penerimaan
              </Label>
              <div className="h-44 sm:h-56 w-full rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative bg-gray-50/50 overflow-hidden group hover:border-emerald-300 transition-all">
                {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : (
                  <div className="flex flex-col items-center gap-3 text-gray-300 group-hover:text-emerald-400 transition-colors">
                    <Upload size={32} strokeWidth={1.5} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Pilih Foto Bukti</span>
                  </div>
                )}
                <input type="file" required accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    const f = e.target.files?.[0]; if(f) { setFile(f); setPreview(URL.createObjectURL(f)); }
                  }} 
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nama Kurir</Label>
                <Input required placeholder="Nama Lengkap..." value={formData.nama_kurir} onChange={e => setFormData({...formData, nama_kurir: e.target.value})} className="rounded-2xl bg-gray-50 border-none font-bold h-12 sm:h-14 px-5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">No. WhatsApp</Label>
                <Input required type="tel" placeholder="0812..." value={formData.telpon_kurir} onChange={e => setFormData({...formData, telpon_kurir: e.target.value})} className="rounded-2xl bg-gray-50 border-none font-bold h-12 sm:h-14 px-5" />
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button disabled={loading} className={`w-full h-12 sm:h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl active:scale-95 transition-all ${isFinishMode ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'} text-white`}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}