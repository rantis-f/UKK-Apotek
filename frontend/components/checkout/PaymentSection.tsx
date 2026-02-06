import { Wallet, CreditCard } from "lucide-react";

export default function PaymentSection({ list, selectedId, onSelect }: any) {
  return (
    <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
      <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Wallet size={14} /> Metode Pembayaran
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {list.map((pay: any) => (
          <button
            key={pay.id}
            onClick={() => onSelect(pay)}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              selectedId === pay.id ? "border-emerald-500 bg-emerald-50/50" : "border-gray-50 hover:border-gray-100"
            }`}
          >
            <CreditCard size={20} className={selectedId === pay.id ? "text-emerald-600" : "text-gray-300"} />
            <p className="text-[9px] font-black text-gray-800 uppercase text-center">{pay.metode_pembayaran}</p>
          </button>
        ))}
      </div>
    </section>
  );
}