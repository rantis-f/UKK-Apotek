"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Upload, X, Loader2, Pill, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ObatFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  categories?: any[]; 
  initialData?: any;
}

export default function ObatForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories = [], 
  initialData 
}: ObatFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
    foto1: null, foto2: null, foto3: null
  });
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({
    foto1: null, foto2: null, foto3: null
  });

  const [formData, setFormData] = useState({
    nama_obat: "",
    idjenis: "",
    harga_jual: "",
    stok: "",
    deskripsi_obat: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        nama_obat: initialData.nama_obat || "",
        idjenis: initialData.idjenis?.toString() || "",
        harga_jual: initialData.harga_jual?.toString() || "",
        stok: initialData.stok?.toString() || "0",
        deskripsi_obat: initialData.deskripsi_obat || "",
      });
      setPreviews({
        foto1: initialData.foto1 || null,
        foto2: initialData.foto2 || null,
        foto3: initialData.foto3 || null,
      });
    } else if (isOpen) {
      setFormData({ nama_obat: "", idjenis: "", harga_jual: "", stok: "0", deskripsi_obat: "" });
      setPreviews({ foto1: null, foto2: null, foto3: null });
      setSelectedFiles({ foto1: null, foto2: null, foto3: null });
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("File terlalu besar! Maksimal 2MB");
      
      setSelectedFiles(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const removeImage = (field: string) => {
    setPreviews(prev => ({ ...prev, [field]: null }));
    setSelectedFiles(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idjenis) return toast.error("Silakan pilih kategori obat!");

    setLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("nama_obat", formData.nama_obat);
      dataToSend.append("idjenis", formData.idjenis);
      dataToSend.append("harga_jual", formData.harga_jual || "0");
      dataToSend.append("stok", formData.stok || "0");
      dataToSend.append("deskripsi_obat", formData.deskripsi_obat);
      
      if (selectedFiles.foto1) dataToSend.append("foto1", selectedFiles.foto1);
      if (selectedFiles.foto2) dataToSend.append("foto2", selectedFiles.foto2);
      if (selectedFiles.foto3) dataToSend.append("foto3", selectedFiles.foto3);

      await onSubmit(dataToSend);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-150 max-h-[95vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Pill className="w-6 h-6 text-emerald-600" />
            {initialData ? "Edit Detail Obat" : "Tambah Produk Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Galeri Foto Produk (Maks. 3)</Label>
            <div className="grid grid-cols-3 gap-3">
              {["foto1", "foto2", "foto3"].map((field, index) => (
                <div key={field} className="space-y-1">
                  <div 
                    className="relative aspect-square border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 cursor-pointer flex flex-col items-center justify-center overflow-hidden hover:bg-emerald-50/50 transition-all group"
                  >
                    {previews[field] && previews[field] !== "default.jpg" ? (
                      <>
                        <img src={previews[field]!} alt={`Preview ${index+1}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(field); }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <Upload className="w-5 h-5 text-gray-300 mb-1" />
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                          {index === 0 ? "Utama" : `Foto ${index + 1}`}
                        </span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => handleFileChange(e, field)} 
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nama Obat</Label>
                <Input 
                  required 
                  value={formData.nama_obat} 
                  onChange={(e) => setFormData({...formData, nama_obat: e.target.value})} 
                  className="rounded-2xl border-gray-100 bg-gray-50/50" 
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Kategori</Label>
                <Select value={formData.idjenis} onValueChange={(val) => setFormData({...formData, idjenis: val})}>
                  <SelectTrigger className="rounded-2xl border-gray-100 bg-gray-50/50">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id.toString()} value={cat.id.toString()}>
                        {cat.jenis}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Harga & Stok */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Harga Jual (Rp)</Label>
                <Input 
                  type="number" 
                  value={formData.harga_jual} 
                  onChange={(e) => setFormData({...formData, harga_jual: e.target.value})} 
                  className="rounded-2xl border-gray-100 bg-gray-50/50 font-bold text-emerald-600" 
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Stok Tersedia</Label>
                <Input 
                  type="number" 
                  value={formData.stok} 
                  onChange={(e) => setFormData({...formData, stok: e.target.value})} 
                  className="rounded-2xl border-gray-100 bg-gray-50/50" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Deskripsi Produk</Label>
            <Textarea 
              value={formData.deskripsi_obat} 
              onChange={(e) => setFormData({...formData, deskripsi_obat: e.target.value})} 
              className="rounded-2xl border-gray-100 bg-gray-50/50 min-h-24" 
              placeholder="Jelaskan indikasi, dosis, dan efek samping..."
            />
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              className="rounded-xl font-bold text-gray-400"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold px-8 shadow-lg shadow-emerald-100 h-11 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} 
              Simpan Produk
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}