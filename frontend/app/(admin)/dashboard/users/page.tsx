"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { UserCog, Plus, Search, RefreshCw, Loader2, Trash2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; 
import { toast } from "sonner";
import { userService } from "@/services/user.service";

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

import UserTable from "@/components/admin/UserTable";
import UserForm from "@/components/admin/UserForm";

export default function ManajemenUserPage() {
  const { token } = useAuth();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await userService.getAll(token); 
      setUsers(res.data || []); 
    } catch (error: any) {
      toast.error(error.message || "Gagal sinkron data staff");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    return list.filter((u: any) => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.jabatan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleSave = async (data: any) => {
    if (!token) return;
    try {
      if (selectedUser) {
        await userService.update(token, selectedUser.id, data);
        toast.success("Akun staff diperbarui");
      } else {
        await userService.create(token, data);
        toast.success("Staff baru ditambahkan");
      }
      setIsModalOpen(false);
      fetchUsers();
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
    const toastId = toast.loading("Menghapus akun staff...");
    
    try {
      await userService.delete(token, idToDelete);
      toast.success("Akun berhasil dihapus", { id: toastId });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus akun", { id: toastId });
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
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Manajemen Staff</h1>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Total {users.length} Personel Terdaftar</p>
          </div>
        </div>
        <Button 
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} 
          className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black px-8 h-12 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" /> TAMBAH STAFF
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Cari berdasarkan nama, email, atau jabatan..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-50 rounded-[1.5rem] focus:border-indigo-500 outline-none shadow-sm font-medium text-sm transition-all"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="animate-spin text-indigo-600 h-10 w-10 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest">Sinkronisasi Staff...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <UserTable 
              data={filteredUsers} 
              onEdit={(u: any) => { setSelectedUser(u); setIsModalOpen(true); }} 
              onDelete={handleDeleteClick} 
            />
          ) : (
            <div className="py-32 text-center flex flex-col items-center">
              <UserX className="w-16 h-16 text-gray-100 mb-4" />
              <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm">Staff Tidak Ditemukan</h3>
            </div>
          )}
        </div>
      </div>

      <UserForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} 
        initialData={selectedUser} 
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none p-8">
          <AlertDialogHeader>
            <div className="mx-auto bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
               <Trash2 className="w-8 h-8 text-indigo-600" />
            </div>
            <AlertDialogTitle className="font-black text-2xl text-center uppercase tracking-tight text-gray-800">Hapus Akun Staff?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-500 px-4 leading-relaxed">
              Tindakan ini akan mencabut akses staff tersebut dari sistem secara permanen. Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 mt-6">
            <AlertDialogCancel className="flex-1 rounded-2xl border-none bg-gray-100 font-bold h-12">BATAL</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="flex-1 bg-red-600 hover:bg-red-700 rounded-2xl font-black h-12 shadow-lg shadow-red-100 transition-all active:scale-95"
            >
              {deleteLoading ? "PROSES..." : "YA, HAPUS"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}