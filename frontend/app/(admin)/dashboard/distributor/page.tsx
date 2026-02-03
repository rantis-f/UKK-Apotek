"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Truck, Plus, Search, Loader2, Trash2, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; 
import { toast } from "sonner";
import { distributorService } from "@/services/distributor.service";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import DistributorTable from "@/components/admin/DistributorTable";
import DistributorForm from "@/components/admin/DistributorForm";

export default function ManajemenDistributorPage() {
  const { token } = useAuth();
  
  const [distributors, setDistributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDistributors = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await distributorService.getAll(token); 
      setDistributors(res.data || []); 
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat data vendor");
      setDistributors([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchDistributors(); }, [fetchDistributors]);

  const filteredDistributors = useMemo(() => {
    const list = Array.isArray(distributors) ? distributors : [];
    return list.filter((d: any) => 
      d.nama_distributor.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.telepon?.includes(searchQuery) ||
      d.alamat?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [distributors, searchQuery]);

  const handleSave = async (data: any) => {
    if (!token) return;
    try {
      if (selectedDistributor) {
        await distributorService.update(token, selectedDistributor.id, data);
        toast.success("Informasi vendor diperbarui");
      } else {
        await distributorService.create(token, data);
        toast.success("Vendor PBF baru berhasil didaftarkan");
      }
      setIsModalOpen(false);
      fetchDistributors();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete || !token) return;
    setDeleteLoading(true);
    const toastId = toast.loading("Menghapus data distributor...");
    
    try {
      await distributorService.delete(token, idToDelete);
      toast.success("Vendor berhasil dihapus dari database", { id: toastId });
      fetchDistributors();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus data", { id: toastId });
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 px-4 md:px-0">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Vendor Distributor</h1>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Total {distributors.length} PBF Terdaftar</p>
          </div>
        </div>
        <Button 
          onClick={() => { setSelectedDistributor(null); setIsModalOpen(true); }} 
          className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-black px-8 h-12 shadow-lg shadow-emerald-100 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" /> DAFTARKAN PBF
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Cari nama distributor, telepon, atau alamat..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-50 rounded-[1.5rem] focus:border-emerald-500 outline-none shadow-sm font-medium text-sm transition-all"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Memuat Daftar Vendor...</p>
            </div>
          ) : filteredDistributors.length > 0 ? (
            <DistributorTable 
              data={filteredDistributors} 
              onEdit={(d: any) => { setSelectedDistributor(d); setIsModalOpen(true); }} 
              onDelete={handleDeleteClick} 
            />
          ) : (
            <div className="py-32 text-center flex flex-col items-center">
              <PackageSearch className="w-16 h-16 text-gray-100 mb-4" />
              <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm">Distributor Belum Ada</h3>
              <p className="text-gray-300 text-xs mt-1 px-10">Data ini diperlukan untuk mengelola alur stok obat masuk.</p>
            </div>
          )}
        </div>
      </div>

      <DistributorForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} 
        initialData={selectedDistributor} 
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none p-8">
          <AlertDialogHeader>
            <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-red-600">
               <Trash2 className="w-8 h-8" />
            </div>
            <AlertDialogTitle className="font-black text-2xl text-center uppercase tracking-tight text-gray-800">Hapus Distributor?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-500 px-4 leading-relaxed">
              Menghapus distributor dapat memengaruhi riwayat stok masuk yang terkait. Pastikan tidak ada transaksi aktif dengan vendor ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 mt-6">
            <AlertDialogCancel className="flex-1 rounded-2xl border-none bg-gray-100 font-bold h-12">BATAL</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="flex-1 bg-red-600 hover:bg-red-700 rounded-2xl font-black h-12 shadow-lg shadow-red-100 transition-all active:scale-95"
            >
              {deleteLoading ? "MENGHAPUS..." : "YA, HAPUS"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}