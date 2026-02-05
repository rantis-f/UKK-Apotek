import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    Menunggu_Konfirmasi: { label: "Menunggu", color: "bg-amber-100 text-amber-700 border-amber-200" },
    Diproses: { label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200" },
    Menunggu_Kurir: { label: "Dikirim", color: "bg-purple-100 text-purple-700 border-purple-200" },
    Selesai: { label: "Selesai", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    Bermasalah: { label: "Bermasalah", color: "bg-red-100 text-red-700 border-red-200" },
    Dibatalkan_Pembeli: { label: "Batal (P)", color: "bg-gray-100 text-gray-700 border-gray-200" },
  };

  const style = config[status] || config.Bermasalah;

  return (
    <Badge variant="outline" className={`${style.color} border font-black text-[9px] uppercase px-2 py-0.5 rounded-lg shadow-sm`}>
      {style.label}
    </Badge>
  );
};