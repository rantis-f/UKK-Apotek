import { Mail, Phone, MapPin, ShieldCheck, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerRowProps {
  customer: any;
  onView: (customer: any) => void;
  onDelete: (id: string) => void;
}

export default function CustomerRow({ customer, onView, onDelete }: CustomerRowProps) {
  return (
    <tr className="hover:bg-blue-50/10 transition-colors group">
      <td className="px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-gray-400 font-bold">
            {customer.foto ? (
              <img src={customer.foto} alt="" className="h-full w-full object-cover" />
            ) : (
              customer.nama_pelanggan.charAt(0)
            )}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">{customer.nama_pelanggan}</p>
            <p className="text-[10px] text-gray-400 font-medium lowercase italic">ID: #{customer.id.toString().slice(-5)}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-4">
        <div className="space-y-1 text-[11px] text-gray-500">
          <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-blue-500" /> {customer.email}</div>
          <div className="flex items-center gap-2 font-bold"><Phone className="w-3 h-3 text-blue-500" /> {customer.no_telp}</div>
        </div>
      </td>
      <td className="px-8 py-4">
        <div className="flex items-start gap-2 max-w-50">
          <MapPin className="w-3.5 h-3.5 text-red-400 mt-0.5" />
          <span className="text-[11px] text-gray-500 line-clamp-1 italic">
            {customer.alamat1 ? `${customer.alamat1}, ${customer.kota1}` : "Alamat belum diatur"}
          </span>
        </div>
      </td>
      <td className="px-8 py-4 text-center">
        {customer.url_ktp ? (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-emerald-100">
            <ShieldCheck className="w-3 h-3" /> TERVERIFIKASI
          </span>
        ) : (
          <span className="text-[9px] font-black text-gray-300 uppercase italic">Belum KTP</span>
        )}
      </td>
      <td className="px-8 py-4 text-right">
        <div className="flex justify-end gap-2">
          <Button onClick={() => onView(customer)} variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-xl">
            <Eye className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(customer.id.toString())} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-xl">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}