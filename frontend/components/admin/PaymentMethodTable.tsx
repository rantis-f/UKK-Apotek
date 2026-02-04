"use client";

import { Edit3, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payment.service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function PaymentMethodTable({ data, onEdit, fetchData }: any) {
  const { token } = useAuth();

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus metode bayar ini?")) return;
    try {
      await paymentService.delete(token!, id);
      toast.success("Berhasil dihapus");
      fetchData();
    } catch (error: any) {
      toast.error("Gagal menghapus data");
    }
  };

  return (
    <div className="w-full">
      <div className="md:hidden divide-y divide-gray-50">
        {data.map((item: any) => (
          <div key={item.id} className="p-5 flex items-center justify-between active:bg-emerald-50/50 transition-all group">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                {item.url_logo ? (
                  <img src={item.url_logo} className="w-8 h-8 object-contain" alt="" />
                ) : (
                  <CreditCard size={24} />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-gray-800 text-sm uppercase truncate">{item.metode_pembayaran}</h4>
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{item.tempat_bayar}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
               <Button onClick={() => onEdit(item)} size="icon" variant="ghost" className="h-9 w-9 text-emerald-600 bg-emerald-50 rounded-lg"><Edit3 size={14}/></Button>
               <Button onClick={() => handleDelete(item.id)} size="icon" variant="ghost" className="h-9 w-9 text-red-500 bg-red-50 rounded-lg"><Trash2 size={14}/></Button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-6">Metode</th>
              <th className="px-8 py-6">Provider/Platform</th>
              <th className="px-8 py-6 text-center">No. Rekening</th>
              <th className="px-8 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item: any) => (
              <tr key={item.id} className="hover:bg-emerald-50/10 group transition-all">
                <td className="px-8 py-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                    <CreditCard size={20} />
                  </div>
                  <span className="font-black text-gray-800 text-sm uppercase">{item.metode_pembayaran}</span>
                </td>
                <td className="px-8 py-5 font-bold text-gray-600 text-sm italic uppercase">{item.tempat_bayar}</td>
                <td className="px-8 py-5 text-center font-mono text-emerald-600 font-black text-xs">{item.no_rekening || "-"}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => onEdit(item)} variant="ghost" size="icon" className="h-9 w-9 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"><Edit3 size={16}/></Button>
                    <Button onClick={() => handleDelete(item.id)} variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}