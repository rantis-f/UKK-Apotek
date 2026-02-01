"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Upload, X } from "lucide-react";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: any;
}

export default function CategoryForm({ isOpen, onClose, onSubmit, initialData }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (initialData && isOpen) {
      setNama(initialData.jenis || "");
      setDeskripsi(initialData.deskripsi_jenis || "");
      setPreview(initialData.image_url || "");
    } else if (isOpen) {
      setNama(""); setDeskripsi(""); setPreview(""); setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("nama_jenis", nama);
    formData.append("deskripsi_jenis", deskripsi);
    if (imageFile) formData.append("image", imageFile);
    
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-[2.5rem] p-8">
        <DialogHeader><DialogTitle className="text-2xl font-black">{initialData ? "Ubah" : "Tambah"} Kategori</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-gray-400">Foto Kategori</Label>
            <div className="relative h-40 w-full rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <button type="button" onClick={() => {setPreview(""); setImageFile(null);}} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg"><X className="w-4 h-4" /></button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-emerald-600 mb-2" />
                  <span className="text-xs font-bold text-gray-400">Klik untuk upload</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>
          <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Kategori" required className="rounded-2xl" />
          <Textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi..." className="rounded-2xl" />
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 rounded-2xl py-6 font-bold">
              {loading ? <Loader2 className="animate-spin" /> : "Simpan Kategori"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}