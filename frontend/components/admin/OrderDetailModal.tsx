"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "./StatusBadge";
import { Package, User, Truck, Receipt, ImageIcon, ImageOff, MapPin, Phone, Info } from "lucide-react";

export default function OrderDetailModal({ isOpen, onClose, data }: any) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-2xl rounded-[1.5rem] md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border-none shadow-2xl bg-white overflow-y-auto max-h-[90vh] scrollbar-hide">
        <DialogHeader className="border-b pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shrink-0">
              <Receipt size={22} />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-lg md:text-2xl font-black text-gray-800 uppercase tracking-tighter leading-none">
                Detail Pesanan
              </DialogTitle>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                Ref ID: #{data.id}
              </span>
            </div>
          </div>
          <div className="scale-90 sm:scale-100 origin-left">
            <StatusBadge status={data.status_order} />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-8">         
          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-widest">
                <User size={14} className="text-emerald-600" /> Informasi Pelanggan
              </h3>
              <div className="bg-gray-50/80 p-5 rounded-[1.5rem] border border-gray-100/50">
                <p className="text-gray-900 font-black text-sm uppercase">
                  {data.pelanggan?.nama_pelanggan || "Pelanggan Umum"}
                </p>
                <div className="flex items-start gap-2 mt-3 text-gray-500">
                  <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                  <p className="text-[11px] font-medium leading-relaxed">
                    {data.pelanggan?.alamat1 || "Alamat tidak terdata"}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-widest">
                <Truck size={14} className="text-blue-600" /> Logistik & Pengiriman
              </h3>
              {data.pengiriman ? (
                <div className="bg-blue-50/30 p-5 rounded-[1.5rem] border border-blue-100/50">
                  <p className="text-[11px] font-black text-blue-700 uppercase mb-1">
                    {data.pengiriman.nama_kurir}
                  </p>
                  <div className="flex items-center gap-2 text-blue-600/70">
                    <Phone size={12} />
                    <p className="text-[11px] font-bold">{data.pengiriman.telpon_kurir}</p>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-[1.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-1 bg-gray-50/30">
                   <Info size={16} className="text-gray-300" />
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Menunggu Penjemputan</p>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-widest">
                <Package size={14} className="text-orange-500" /> Daftar Obat
              </h3>
              <div className="space-y-2.5 max-h-45 overflow-y-auto pr-2 scrollbar-hide">
                {data.details?.length > 0 ? data.details.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm transition-hover hover:border-emerald-200">
                    <span className="text-[11px] font-black text-gray-700 uppercase truncate max-w-37.5">
                        {item.obat?.nama_obat}
                    </span>
                    <span className="text-[11px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                        {item.jumlah_beli}x
                    </span>
                  </div>
                )) : (
                  <p className="text-[11px] text-gray-400 italic text-center py-4">Item belanja kosong</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-widest">
                <ImageIcon size={14} className="text-purple-600" /> Bukti Konfirmasi
              </h3>
              {data.pengiriman?.bukti_foto ? (
                <div className="relative rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl group aspect-video sm:aspect-auto">
                  <img 
                    src={data.pengiriman.bukti_foto} 
                    className="w-full h-44 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="Bukti Penerimaan" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ) : (
                <div className="h-44 sm:h-52 rounded-[1.5rem] border-2 border-dashed border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center text-gray-300 gap-3">
                  <div className="p-4 bg-white rounded-full shadow-sm">
                    <ImageOff size={28} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Foto Bukti Belum Diunggah</span>
                </div>
              )}
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}