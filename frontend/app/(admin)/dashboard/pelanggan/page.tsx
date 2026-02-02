"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  Users, Search, RefreshCw, Loader2, 
  UserX, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Link from "next/link";

import CustomerTable from "@/components/admin/CustomerTable";
import CustomerDetailModal from "@/components/admin/CustomerDetailModal";

export default function ManajemenPelangganPage() {
  const { token } = useAuth();
  
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pelanggan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      
      setCustomers(res.data || []);
    } catch (error: any) {
      toast.error("Gagal sinkron data pelanggan");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const list = Array.isArray(customers) ? customers : [];
    return list.filter((c: any) =>
      c.nama_pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.no_telp.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  const handleViewDetail = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    toast.info("Fitur hapus pelanggan sedang dikembangkan");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 px-2 md:px-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Database Member</h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
              {customers.length} Pelanggan Terdaftar
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchCustomers} 
            className="rounded-2xl border-2 border-gray-100 hover:bg-blue-50 transition-all font-bold h-11"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama, email, atau nomor telepon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-50 rounded-[1.5rem] focus:border-blue-500 outline-none transition-all shadow-sm font-medium text-sm"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <Loader2 className="animate-spin text-blue-600 h-10 w-10 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Menghubungkan ke Database...</p>
            </div>
          ) : filteredCustomers.length > 0 ? (
            <CustomerTable 
              data={filteredCustomers} 
              onView={handleViewDetail} 
              onDelete={handleDelete} 
            />
          ) : (
            <div className="py-32 text-center flex flex-col items-center">
              <UserX className="w-16 h-16 text-gray-100 mb-4" />
              <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm">Tidak Ada Data Pelanggan</h3>
              <p className="text-gray-300 text-xs mt-1">Coba segarkan halaman atau ubah kata kunci pencarian.</p>
            </div>
          )}
        </div>
      </div>

      <CustomerDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        customer={selectedCustomer} 
      />

    </div>
  );
}