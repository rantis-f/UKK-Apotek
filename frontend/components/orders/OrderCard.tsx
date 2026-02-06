// components/orders/OrderCard.tsx
import StatusBadge from "./StatusBadge";
import { Package, ChevronRight } from "lucide-react";

interface OrderCardProps {
  order: any;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
            <Package size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">INV-{order.id}</p>
              
              {/* PEMANGGILAN STATUS BADGE */}
              <StatusBadge status={order.status_order} /> 
              
            </div>
            <h4 className="font-bold text-gray-900 text-sm">
              {order.details?.[0]?.obat?.nama_obat || "Produk Obat"} 
              {order.details?.length > 1 && (
                <span className="text-gray-400 font-medium text-xs"> +{order.details.length - 1} produk lainnya</span>
              )}
            </h4>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
          <div className="text-left md:text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bayar</p>
            <p className="font-black text-emerald-600 text-sm">Rp {Number(order.total_bayar).toLocaleString()}</p>
          </div>
          <button className="bg-gray-50 p-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}