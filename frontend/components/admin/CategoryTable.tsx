"use client";

import { Edit2, Trash2, ImageIcon } from "lucide-react";

interface CategoryTableProps {
  data: any[];
  onEdit: (category: any) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({ data, onEdit, onDelete }: CategoryTableProps) {
  const safeData = data || [];

  return (
    <table className="w-full text-left">
      <thead className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-widest font-black">
        <tr>
          <th className="px-6 py-5 text-center">Foto</th>
          <th className="px-6 py-5">Nama Kategori</th>
          <th className="px-6 py-5">Deskripsi</th>
          <th className="px-6 py-5 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 text-sm">
        {safeData.length > 0 ? (
          safeData.map((cat: any) => (
            <tr key={cat.id} className="hover:bg-emerald-50/30 transition-colors group">
              <td className="px-6 py-4 flex justify-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shadow-sm">
                  {cat.image_url ? (
                    <img 
                      src={cat.image_url} 
                      alt={cat.jenis} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-800">{cat.jenis}</td>
              <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{cat.deskripsi_jenis || "-"}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(cat)} className="p-2 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(cat.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={4} className="py-20 text-center text-gray-400 font-bold">Data tidak ditemukan.</td></tr>
        )}
      </tbody>
    </table>
  );
}