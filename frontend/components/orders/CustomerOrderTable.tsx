import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface TableProps {
  data: any[];
  onView: (order: any) => void;
}

export default function CustomerOrderTable({ data, onView }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-50">
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">ID Pesanan</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tanggal</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Bayar</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-5">
                <span className="font-black text-gray-900 text-xs">#INV-{order.id}</span>
              </td>
              <td className="px-6 py-5">
                <p className="text-xs font-bold text-gray-600">
                  {new Date(order.tgl_penjualan).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </td>
              <td className="px-6 py-5">
                <p className="text-sm font-black text-emerald-600">
                  Rp {Number(order.total_bayar).toLocaleString()}
                </p>
              </td>
              <td className="px-6 py-5">
                <StatusBadge status={order.status_order} />
              </td>
              <td className="px-6 py-5 text-center">
                <button 
                  onClick={() => onView(order)}
                  className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90"
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}