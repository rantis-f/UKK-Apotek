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
  
  // State Management
  const [categories, setCategories] = useState<any[]>([]); // Inisialisasi array kosong
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- 1. FETCH DATA (FIXED: Ambil res.data) ---
  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await categoryService.getAll(token);
      // Ambil properti .data karena apiRequest mengembalikan objek lengkap
      setCategories(res.data || []); 
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat data");
      setCategories([]); 
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- 2. SEARCH LOGIC (FIXED: Safety Check) ---
  const filteredCategories = useMemo(() => {
    // Pastikan categories adalah array sebelum filter
    const list = Array.isArray(categories) ? categories : [];
    return list.filter((cat: any) =>
      cat.jenis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.deskripsi_jenis?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // --- 3. DELETE LOGIC ---
  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete || !token) return;
    setDeleteLoading(true);
    const toastId = toast.loading("Sedang menghapus...");
    try {
      await categoryService.delete(token, idToDelete);
      toast.success("Kategori berhasil dihapus", { id: toastId });
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  // --- 4. SAVE LOGIC ---
  const handleSave = async (formData: FormData) => {
    try {
      if (selectedCategory) {
        await categoryService.update(token!, selectedCategory.id, formData);
        toast.success("Kategori berhasil diperbarui");
      } else {
        await categoryService.create(token!, formData);
        toast.success("Kategori berhasil ditambahkan");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan data");
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-0 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight uppercase">Manajemen Jenis Obat</h1>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Total {categories.length} Kategori Terdaftar</p>
        </div>
        <Button
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 rounded-2xl font-black py-6 sm:py-2 px-8 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" /> TAMBAH JENIS
        </Button>
      </div>

      {/* SEARCH BAR & REFRESH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Cari kategori atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <Button variant="outline" onClick={fetchCategories} disabled={loading} className="rounded-2xl border-2 h-auto px-6 hover:bg-emerald-50 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* TABLE SECTION */}
      {loading ? (
        <div className="flex flex-col items-center py-32 text-gray-400 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
          <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Menghubungkan ke Server...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <CategoryTable
              data={filteredCategories}
              onDelete={handleDeleteClick}
              onEdit={(cat) => { setSelectedCategory(cat); setIsModalOpen(true); }}
            />
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      <CategoryForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} 
        initialData={selectedCategory} 
      />

      {/* DELETE DIALOG */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none p-8">
          <AlertDialogHeader>
            <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
               <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <AlertDialogTitle className="font-black text-2xl text-center uppercase tracking-tight">Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-500 px-4">
              Data ini tidak bisa dikembalikan. Pastikan tidak ada produk aktif yang masih menggunakan kategori ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 mt-6">
            <AlertDialogCancel className="flex-1 rounded-2xl border-none bg-gray-100 font-bold h-12">BATAL</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="flex-1 bg-red-600 hover:bg-red-700 rounded-2xl font-black h-12 shadow-lg shadow-red-100 transition-all active:scale-95"
            >
              {deleteLoading ? <Loader2 className="animate-spin" /> : "YA, HAPUS"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}