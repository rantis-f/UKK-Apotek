"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Mail, Phone, MapPin, ShieldCheck, 
  User, CreditCard, X, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export default function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Detail Pelanggan: {customer.nama_pelanggan}</DialogTitle>
        </DialogHeader>

        <div className="bg-blue-600 h-32 w-full relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all z-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-6 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="h-32 w-32 rounded-[2.5rem] bg-white p-2 shadow-xl shrink-0">
              <div className="h-full w-full rounded-[2rem] bg-gray-100 overflow-hidden border-2 border-gray-50 flex items-center justify-center">
                {customer.foto ? (
                  <img src={customer.foto} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-300" />
                )}
              </div>
            </div>

            <div className="pt-16 md:pt-20 space-y-1">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                {customer.nama_pelanggan}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">
                  <Mail className="w-3 h-3 text-blue-500" /> {customer.email}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">
                  <Phone className="w-3 h-3 text-blue-500" /> {customer.no_telp}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => {
              const alamat = customer[`alamat${num}`];
              const kota = customer[`kota${num}`];
              const prov = customer[`propinsi${num}`];

              return (
                <div key={num} className={`p-5 rounded-[2rem] border-2 transition-all ${alamat ? 'border-blue-50 bg-blue-50/30' : 'border-dashed border-gray-100 opacity-40'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Alamat {num}</span>
                    <MapPin className={`w-3.5 h-3.5 ${alamat ? 'text-blue-500' : 'text-gray-300'}`} />
                  </div>
                  {alamat ? (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-gray-700 leading-snug line-clamp-2">{alamat}</p>
                      <p className="text-[9px] text-gray-400 uppercase font-black">{kota}, {prov}</p>
                    </div>
                  ) : (
                    <p className="text-[9px] text-gray-300 italic font-bold uppercase tracking-widest">Kosong</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Dokumen Verifikasi
            </h3>
            {customer.url_ktp ? (
              <div className="relative group overflow-hidden rounded-[2rem] border-2 border-emerald-100 h-40 bg-gray-50 flex items-center justify-center">
                <img src={customer.url_ktp} alt="KTP" className="h-full w-full object-contain p-2" />
                <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                   <div className="bg-white text-emerald-600 px-4 py-2 rounded-xl font-black text-[9px] uppercase shadow-xl flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Data Valid
                   </div>
                </div>
              </div>
            ) : (
              <div className="py-10 border-2 border-dashed border-gray-100 rounded-[2rem] text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Belum Unggah KTP</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-[2.5rem]">
          <Button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest px-8 h-12 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            Tutup Detail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}