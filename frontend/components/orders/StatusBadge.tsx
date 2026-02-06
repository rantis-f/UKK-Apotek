// components/orders/StatusBadge.tsx

interface StatusBadgeProps {
  status: string; // Daftarkan prop 'status' di sini
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: any = {
    "Menunggu_Konfirmasi": "bg-amber-50 text-amber-600 border-amber-100",
    "Diproses": "bg-blue-50 text-blue-600 border-blue-100",
    "Selesai": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Dibatalkan_Pembeli": "bg-red-50 text-red-600 border-red-100",
    "Dibatalkan_Penjual": "bg-red-100 text-red-700 border-red-200",
    "Bermasalah": "bg-gray-50 text-gray-600 border-gray-100",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles["Bermasalah"]}`}>
      {status.replace("_", " ")}
    </span>
  );
}