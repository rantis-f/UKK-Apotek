// components/checkout/AddressSection.tsx

interface AddressProps {
  userName: string;
  address: string;
  city?: string;  // Tambahkan ini (tanda ? artinya optional)
  phone?: string; // Tambahkan ini
}

export default function AddressSection({ userName, address, city, phone }: AddressProps) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Alamat Pengiriman</h3>
      <div className="flex flex-col gap-1">
        <p className="font-black text-gray-900 text-sm">{userName || "Nama tidak tersedia"}</p>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">
          {address || "Alamat belum diatur"}
          {city && `, ${city}`} {/* Tampilkan kota jika ada */}
        </p>
        {phone && (
          <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase tracking-tighter">
            Telp: {phone}
          </p>
        )}
      </div>
    </div>
  );
}