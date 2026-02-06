// components/orders/OrderDetailModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, MapPin, CreditCard, Truck } from "lucide-react";

export default function OrderDetailModal({ isOpen, onClose, data }: any) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-[2.5rem] p-8">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
             <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">Detail Pesanan</DialogTitle>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">INV-{data.id}</p>
             </div>
             <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                {data.status_order.replace("_", " ")}
             </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          {/* List Barang */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Package size={14} /> Daftar Produk
            </h4>
            {data.details?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center font-bold text-emerald-600">
                    {item.obat?.nama_obat[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.obat?.nama_obat}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{item.jumlah_beli}x @ Rp {item.harga_beli.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-gray-900">Rp {item.subtotal.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Pengiriman & Pembayaran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-5 border border-gray-100 rounded-3xl space-y-2">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Truck size={12} /> Ekspedisi
                </h4>
                <p className="text-xs font-bold text-gray-800">{data.jenis_pengiriman?.nama_ekspedisi}</p>
                <p className="text-[10px] text-emerald-600 font-black uppercase">{data.jenis_pengiriman?.jenis_kirim}</p>
             </div>
             <div className="p-5 border border-gray-100 rounded-3xl space-y-2">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard size={12} /> Pembayaran
                </h4>
                <p className="text-xs font-bold text-gray-800">{data.metode_bayar?.metode_pembayaran}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{data.metode_bayar?.tempat_bayar || 'Apotek Pro'}</p>
             </div>
          </div>

          {/* Ringkasan Biaya */}
          <div className="p-6 bg-emerald-600 rounded-[2rem] text-white">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Pembayaran</span>
                <span className="text-xl font-black">Rp {data.total_bayar.toLocaleString()}</span>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}