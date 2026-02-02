"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus, Search, RefreshCw, PackageOpen,
  Edit3, Trash2, CameraOff, AlertTriangle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { obatService } from "@/services/obat.service";
import { categoryService } from "@/services/category.service";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";
import ObatForm from "@/components/admin/ObatForm";

export default function ManajemenObatPage() {
  const { token } = useAuth();

  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, nama: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const initData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [dataObat, dataKategori] = await Promise.all([
        obatService.getAll(token),
        categoryService.getAll(token)
      ]);
      setItems(dataObat.data || []);
      setCategories(dataKategori.data || []);
    } catch (error: any) {
      toast.error("Gagal sinkron data dengan server");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { initData(); }, [initData]);

  const filteredItems = useMemo(() => {
    return items.filter((item: any) =>
      item.nama_obat.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleDeleteClick = (id: string, nama: string) => {
    setItemToDelete({ id, nama });
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !token) return;
    const toastId = toast.loading(`Menghapus ${itemToDelete.nama}...`);
    try {
      await obatService.delete(token, itemToDelete.id);
      toast.success("Data berhasil dihapus!", { id: toastId });
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
      initData();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus data", { id: toastId });
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      if (selectedItem) {
        await obatService.update(token!, selectedItem.id, data);
        toast.success("Produk berhasil diperbarui!");
      } else {
        await obatService.create(token!, data);
        toast.success("Produk baru ditambahkan!");
      }
      setIsModalOpen(false);
      initData();
    } catch (e: any) {
      toast.error(e.message || "Gagal menyimpan data");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0 pb-10 animate-in fade-in duration-500">

      <div className="flex flex-col gap-4 bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 md:p-3 rounded-xl md:rounded-2xl">
              <PackageOpen className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black text-gray-800 tracking-tight">Katalog Obat</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{items.length} Produk Terdata</p>
            </div>
          </div>
          <Button variant="outline" onClick={initData} className="rounded-xl h-10 w-10 p-0 md:hidden border-gray-100">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari nama obat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl md:rounded-2xl border-gray-100 bg-gray-50/50 h-10 md:h-11 outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={initData} className="hidden md:flex rounded-2xl h-11 border-gray-100 px-4">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 rounded-xl md:rounded-2xl font-bold h-10 md:h-11 flex-1 sm:flex-none px-6 text-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Obat
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-4" />
              <p className="animate-pulse font-bold text-[10px] uppercase tracking-widest">Sinkronisasi Data...</p>
            </div>
          ) : (
            <table className="w-full text-left min-w-162.5 md:min-w-200">
              <thead className="bg-gray-50/50 border-b text-gray-400 text-[9px] md:text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-4 md:px-8 py-4 md:py-6 text-center w-20">Produk</th>
                  <th className="px-4 md:px-8 py-4 md:py-6">Detail Obat</th>
                  <th className="px-4 md:px-8 py-4 md:py-6 hidden sm:table-cell">Kategori</th>
                  <th className="px-4 md:px-8 py-4 md:py-6 text-center">Stok</th>
                  <th className="px-4 md:px-8 py-4 md:py-6 text-right">Harga</th>
                  <th className="px-4 md:px-8 py-4 md:py-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item: any) => (
                  <tr key={item.id.toString()} className="hover:bg-emerald-50/10 transition-colors group">
                    <td className="px-4 md:px-8 py-3">
                      <div className="relative h-10 w-10 md:h-14 md:w-14 rounded-lg md:rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm mx-auto">
                        {item.foto1 && item.foto1 !== "default.jpg" ? (
                          <img src={item.foto1} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt={item.nama_obat} />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300"><CameraOff className="w-5 h-5" /></div>
                        )}
                        {(item.foto2 !== "default.jpg" || item.foto3 !== "default.jpg") && (
                          <div className="absolute bottom-0 right-0 bg-emerald-600 text-[8px] text-white px-1.5 py-0.5 font-black rounded-tl-lg shadow-sm">
                            +{(item.foto2 !== "default.jpg" ? 1 : 0) + (item.foto3 !== "default.jpg" ? 1 : 0)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-xs md:text-sm">{item.nama_obat}</span>
                        <span className="text-[10px] md:text-[11px] text-gray-400 line-clamp-1 hidden md:block">{item.deskripsi_obat || "Tidak ada deskripsi"}</span>
                        <span className="sm:hidden text-[9px] font-bold text-emerald-600 uppercase mt-1">{item.jenis_obat?.jenis || "Umum"}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-3 hidden sm:table-cell">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-bold uppercase border border-emerald-100">
                        {item.jenis_obat?.jenis || "Umum"}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-3 text-center font-mono font-bold text-xs md:text-sm">
                      <span className={item.stok <= 5 ? "text-red-500 bg-red-50 px-2 py-1 rounded-md" : "text-gray-600"}>
                        {item.stok}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-3 font-black text-emerald-600 text-xs md:text-sm text-right">
                      {formatRupiah(item.harga_jual)}
                    </td>
                    <td className="px-4 md:px-8 py-3">
                      <div className="flex justify-center gap-1 md:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                          className="h-8 w-8 md:h-9 md:w-9 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(item.id.toString(), item.nama_obat)}
                          className="h-8 w-8 md:h-9 md:w-9 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ObatForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        initialData={selectedItem}
        onSubmit={handleFormSubmit}
      />

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="w-[90vw] sm:max-w-100 rounded-[2.5rem] border-none p-8 text-center shadow-2xl">
          <div className="flex flex-col items-center gap-5">
            <div className="bg-red-50 p-5 rounded-full ring-8 ring-red-50/50">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Hapus Produk?</h2>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                Anda yakin ingin memusnahkan <span className="font-bold text-red-600">"{itemToDelete?.nama}"</span>?
                Data ini akan hilang permanen dari sistem gudang.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 rounded-2xl font-bold text-gray-400 h-12">
                Batal
              </Button>
              <Button onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-xl shadow-red-200 h-12 transition-all active:scale-95">
                Ya, Hapus!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}