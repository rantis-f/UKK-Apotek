"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Truck, Eye, CheckCircle, User, DollarSign, Receipt } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export default function OrderTable({ data, onAction, onView }: any) {
  if (!data || data.length === 0) return (
    <div className="p-20 text-center flex flex-col items-center opacity-20">
      <Receipt size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest mt-2">Tidak ada data</p>
    </div>
  );

  return (
    <div className="w-full">
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 py-4 pr-4 pl-0 sm:pl-1 bg-gray-50/30">
        {data.map((order: any) => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm space-y-4 flex flex-col justify-between ml-0 sm:ml-1">
            <div className="flex justify-between items-center">
              <span className="font-black text-gray-800 text-xs">#{order.no_invoice || order.id}</span>
              <StatusBadge status={order.status_order} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-[10px] font-bold py-3 border-y border-gray-50">
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 uppercase flex items-center gap-1"><User size={10}/> Pelanggan</span>
                <span className="text-gray-700 truncate">{order.pelanggan?.nama_pelanggan || "Umum"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 uppercase flex items-center gap-1"><DollarSign size={10}/> Total</span>
                <span className="text-emerald-600 font-black">Rp{order.total_bayar.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onView(order)} variant="outline" className="flex-1 h-10 rounded-xl border-gray-100"><Eye size={16} className="text-gray-400"/></Button>
              {order.status_order === "Diproses" && (
                <Button onClick={() => onAction(order)} className="flex-3 bg-blue-600 h-10 rounded-xl font-black uppercase text-[10px] gap-2"><Truck size={14}/> Kirim</Button>
              )}
              {order.status_order === "Menunggu_Kurir" && (
                <Button onClick={() => onAction(order)} className="flex-3 bg-emerald-600 h-10 rounded-xl font-black uppercase text-[10px] gap-2"><CheckCircle size={14}/> Selesai</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none">
              <TableHead className="pl-8 h-14 text-[10px] font-black uppercase text-gray-400">Invoice</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-gray-400">Pelanggan</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-gray-400">Total Bayar</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-gray-400">Status</TableHead>
              <TableHead className="text-right pr-8 text-[10px] font-black uppercase text-gray-400">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order: any) => (
              <TableRow key={order.id} className="hover:bg-gray-50/50 border-gray-50 transition-colors">
                <TableCell className="pl-8 font-black text-gray-800 text-xs">#{order.no_invoice || order.id}</TableCell>
                <TableCell className="text-[10px] font-bold text-gray-400 uppercase">{order.pelanggan?.nama_pelanggan || "Umum"}</TableCell>
                <TableCell className="font-black text-emerald-600 text-xs">Rp{order.total_bayar.toLocaleString()}</TableCell>
                <TableCell><StatusBadge status={order.status_order} /></TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    {order.status_order === "Diproses" && (
                      <Button onClick={() => onAction(order)} className="bg-blue-600 h-9 rounded-xl text-[9px] font-black uppercase px-4 gap-2 shadow-sm"><Truck size={14}/> Kirim</Button>
                    )}
                    {order.status_order === "Menunggu_Kurir" && (
                      <Button onClick={() => onAction(order)} className="bg-emerald-600 h-9 rounded-xl text-[9px] font-black uppercase px-4 gap-2 shadow-sm"><CheckCircle size={14}/> Selesai</Button>
                    )}
                    <Button variant="ghost" onClick={() => onView(order)} className="h-9 w-9 p-0 rounded-xl hover:bg-gray-100 text-gray-400 shrink-0"><Eye size={18}/></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}