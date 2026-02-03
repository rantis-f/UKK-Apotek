"use client";

import { Edit3, Trash2, MapPin, Phone, Truck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DistributorTableProps {
  data: any[];
  onEdit: (distributor: any) => void;
  onDelete: (id: string) => void;
}

export default function DistributorTable({ data, onEdit, onDelete }: DistributorTableProps) {
  return (
    <div className="w-full">
      <table className="w-full text-left">
        <thead className="bg-emerald-50/50 border-b border-emerald-100 text-emerald-700 text-[10px] uppercase font-black tracking-widest">
          <tr>
            <th className="px-8 py-6">Nama Distributor / PBF</th>
            <th className="px-8 py-6">Kontak Sales</th>
            <th className="px-8 py-6">Lokasi Gudang</th>
            <th className="px-8 py-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-emerald-50/20 transition-all group">
              <td className="px-8 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm leading-tight">
                      {item.nama_distributor}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-tighter">
                      ID: #{item.id.toString()}
                    </span>
                  </div>
                </div>
              </td>

              <td className="px-8 py-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    {item.telepon}
                  </div>
                  {item.email && (
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Mail className="w-3 h-3 text-gray-300" />
                      {item.email}
                    </div>
                  )}
                </div>
              </td>

              <td className="px-8 py-4">
                <div className="flex items-start gap-2 max-w-50">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.alamat}
                  </span>
                </div>
              </td>

              <td className="px-8 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={() => onEdit(item)} 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => onDelete(item.id)} 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}