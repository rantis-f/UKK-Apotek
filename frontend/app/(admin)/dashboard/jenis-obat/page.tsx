"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Search, RefreshCw, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import CategoryTable from "@/components/admin/CategoryTable";
import CategoryForm from "@/components/admin/CategoryForm";
import { categoryService } from "@/services/category.service";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function JenisObatPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await categoryService.getAll(token);
      setCategories(data);
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat: any) =>
      cat.jenis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.deskripsi_jenis?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete || !token) return;
    setDeleteLoading(true);
    try {
      await categoryService.delete(token, idToDelete);
      toast.success("Kategori dihapus");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (selectedCategory) {
        await categoryService.update(token!, selectedCategory.id, formData);
        toast.success("Kategori diperbarui");
      } else {
        await categoryService.create(token!, formData);
        toast.success("Kategori ditambahkan");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-0 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-black text-gray-800">Manajemen Jenis Obat</h1>
        <Button
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold py-6 sm:py-2"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Jenis
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 outline-none"
          />
        </div>
        <Button variant="outline" onClick={fetchCategories} disabled={loading} className="rounded-2xl border-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-32 text-gray-400">
          <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-2" />
          <p className="text-xs font-bold uppercase tracking-widest">Sinkronisasi...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <CategoryTable
              data={filteredCategories}
              onDelete={handleDeleteClick}
              onEdit={(cat) => { setSelectedCategory(cat); setIsModalOpen(true); }}
            />
          </div>
        </div>
      )}

      <CategoryForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={selectedCategory} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black">Hapus Data?</AlertDialogTitle>
            <AlertDialogDescription>Data tidak bisa dikembalikan setelah dihapus.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-none bg-gray-100 font-bold">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 rounded-xl font-bold">
              {deleteLoading ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}