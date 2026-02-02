import { Edit3, Trash2, Mail, Shield, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserTable({ data, onEdit, onDelete }: { data: any[], onEdit: (u: any) => void, onDelete: (id: string) => void }) {
  
  const getRoleStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'pemilik': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'apoteker': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50/50 border-b text-gray-400 text-[10px] uppercase font-black tracking-widest">
        <tr>
          <th className="px-8 py-6">Nama Staff</th>
          <th className="px-8 py-6">Email & Akses</th>
          <th className="px-8 py-6 text-center">Jabatan</th>
          <th className="px-8 py-6 text-right">Opsi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {data.map((user) => (
          <tr key={user.id} className="hover:bg-indigo-50/10 transition-colors group">
            <td className="px-8 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserCircle className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-800 text-sm">{user.name}</span>
              </div>
            </td>
            <td className="px-8 py-4">
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Mail className="w-3 h-3" /> {user.email}
                </span>
              </div>
            </td>
            <td className="px-8 py-4 text-center">
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${getRoleStyle(user.jabatan)}`}>
                {user.jabatan}
              </span>
            </td>
            <td className="px-8 py-4 text-right">
              <div className="flex justify-end gap-2">
                <Button onClick={() => onEdit(user)} variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 rounded-xl">
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button onClick={() => onDelete(user.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}