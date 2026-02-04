"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { paymentService } from "@/services/payment.service";
import { CreditCard, Plus, Loader2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

import PaymentMethodTable from "@/components/admin/PaymentMethodTable";
import PaymentMethodForm from "@/components/admin/PaymentMethodForm";

export default function ManajemenPembayaranPage() {
    const { token } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const fetchMethods = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await paymentService.getAll(token);
            setData(res.data || []);
        } catch (error: any) {
            toast.error("Gagal sinkron data pembayaran");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchMethods(); }, [fetchMethods]);

    const handleSave = async (formData: FormData) => {
        if (!token) return;
        try {
            if (selectedItem) {
                await paymentService.update(token, selectedItem.id, formData);
                toast.success("Metode bayar diperbarui");
            } else {
                await paymentService.create(token, formData);
                toast.success("Metode bayar ditambahkan");
            }
            setIsModalOpen(false);
            fetchMethods();
        } catch (error: any) {
            toast.error("Gagal menyimpan konfigurasi");
        }
    };

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 pb-24 px-1 md:px-0">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-50">
                <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto">
                    <div className="bg-emerald-600 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-white shadow-xl shadow-emerald-100 shrink-0">
                        <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-sm md:text-2xl font-black text-gray-800 uppercase tracking-tight leading-none truncate">Metode Bayar</h1>
                        <p className="text-[9px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1 italic">Kasir Gateway</p>
                    </div>
                </div>
                <Button
                    onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-xl md:rounded-2xl font-black h-11 md:h-14 px-8 shadow-xl shadow-emerald-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest text-white"
                >
                    <Plus className="w-4 h-4 mr-1 md:mr-2" /> TAMBAH METODE
                </Button>
            </div>

            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin text-emerald-600 h-8 w-8 mb-4" />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Syncing Payments...</p>
                    </div>
                ) : (
                    <PaymentMethodTable
                        data={data}
                        onEdit={(item: any) => { setSelectedItem(item); setIsModalOpen(true); }}
                        fetchData={fetchMethods}
                    />
                )}
            </div>

            <PaymentMethodForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                initialData={selectedItem}
            />
        </div>
    );
}