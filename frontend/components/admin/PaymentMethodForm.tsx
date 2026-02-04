"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, CreditCard } from "lucide-react";

export default function PaymentMethodForm({ isOpen, onClose, onSubmit, initialData }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    metode_pembayaran: "",
    tempat_bayar: "",
    no_rekening: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        metode_pembayaran: initialData.metode_pembayaran || "",
        tempat_bayar: initialData.tempat_bayar || "",
        no_rekening: initialData.no_rekening || "",
      });
      setPreview(initialData.url_logo || "");
    } else if (isOpen) {
      setFormData({ metode_pembayaran: "", tempat_bayar: "", no_rekening: "" });
      setPreview("");
      setFile(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("metode_pembayaran", formData.metode_pembayaran);
    data.append("tempat_bayar", formData.tempat_bayar);
    data.append("no_rekening", formData.no_rekening);
    if (file) data.append("logo", file);

    await onSubmit(data);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border-none shadow-2xl bg-white scrollbar-hide">
        <DialogHeader className="border-b border-gray-50 pb-4">
          <DialogTitle className="text-lg md:text-xl font-black text-gray-800 uppercase flex items-center gap-3 tracking-tighter">
             <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg"><CreditCard size={18}/></div>
             {initialData ? "Update Gateway" : "Gateway Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Icon Pembayaran</Label>
            <div className="h-24 w-full rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50 relative group transition-all hover:bg-emerald-50/30">
              {preview ? (
                <img src={preview} className="h-full w-full object-contain p-2" alt="Logo Preview" />
              ) : (
                <Upload size={20} className="text-gray-300" />
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e: any) => {
                const f = e.target.files?.[0];
                if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
              }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Nama Metode</Label>
            <Input required value={formData.metode_pembayaran} onChange={(e) => setFormData({...formData, metode_pembayaran: e.target.value})} className="h-11 rounded-xl border-none bg-gray-50/50 font-bold focus:bg-white" placeholder="Contoh: QRIS, Transfer Bank" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Nama Platform</Label>
            <Input required value={formData.tempat_bayar} onChange={(e) => setFormData({...formData, tempat_bayar: e.target.value})} className="h-11 rounded-xl border-none bg-gray-50/50 font-bold focus:bg-white" placeholder="Contoh: BCA, Mandiri, OVO" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">No. Rekening (Opsional)</Label>
            <Input value={formData.no_rekening} onChange={(e) => setFormData({...formData, no_rekening: e.target.value})} className="h-11 rounded-xl border-none bg-gray-50/50 font-bold focus:bg-white" placeholder="Input nomor jika ada" />
          </div>

          <DialogFooter className="pt-4">
            <Button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 md:h-14 rounded-xl md:rounded-2xl font-black text-white shadow-xl shadow-emerald-100 active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em]">
              {loading ? <Loader2 className="animate-spin" /> : "SIMPAN KONFIGURASI"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}