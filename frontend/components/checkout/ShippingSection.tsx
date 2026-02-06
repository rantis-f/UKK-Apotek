import { Truck } from "lucide-react";


export default function ShippingSection({ list, selectedId, onSelect }: any) {
console.log(list);
  return (
    <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
      <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Truck size={14} /> Pilih Ekspedisi
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((ship: any) => (
          <button
            key={ship.id}
            onClick={() => onSelect(ship)}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
              selectedId === ship.id ? "border-emerald-500 bg-emerald-50/50" : "border-gray-50 hover:border-gray-100"
            }`}
          >
            <div className="text-left">
              <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">{ship.nama_ekspedisi}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase">{ship.jenis_kirim}</p>
            </div>
            <p className="text-[10px] font-black text-emerald-600">
              +Rp {Number(ship.biaya).toLocaleString("id-ID")}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}