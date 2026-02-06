import { Loader2, ShieldCheck } from "lucide-react";

export default function OrderSummary({ subtotal, shipping, appFee, onCheckout, loading, isCartEmpty }: any) {
  const grandTotal = subtotal + shipping + appFee;

  return (
    <aside className="sticky top-24 bg-emerald-900 text-white p-8 rounded-[2.5rem] shadow-2xl h-fit">
      <div className="space-y-4 mb-8 text-xs opacity-70 font-medium">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between">
          <span>Ongkir</span>
          <span>+Rp {shipping.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between">
          <span>Biaya App</span>
          <span>+Rp {appFee.toLocaleString("id-ID")}</span>
        </div>
        <div className="pt-4 border-t border-emerald-800 flex justify-between items-end opacity-100">
          <span className="font-bold text-emerald-400 uppercase tracking-widest">Total Bayar</span>
          <span className="text-3xl font-black text-emerald-300">
            Rp {grandTotal.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <button 
        onClick={onCheckout}
        disabled={loading || isCartEmpty}
        className="w-full bg-emerald-500 hover:bg-emerald-400 py-5 rounded-2xl font-black text-xs uppercase shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : "Bayar Sekarang"}
      </button>

      <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-bold text-emerald-500 opacity-50 uppercase tracking-widest">
        <ShieldCheck size={12} /> Keamanan Transaksi Terjamin
      </div>
    </aside>
  );
}