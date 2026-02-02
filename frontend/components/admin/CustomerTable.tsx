import CustomerRow from "./CustomerRow";

interface CustomerTableProps {
  data: any[];
  onView: (customer: any) => void;
  onDelete: (id: string) => void;
}

export default function CustomerTable({ data, onView, onDelete }: CustomerTableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50/50 border-b text-gray-400 text-[10px] uppercase font-black tracking-widest">
        <tr>
          <th className="px-8 py-5">Info Pelanggan</th>
          <th className="px-8 py-5">Kontak</th>
          <th className="px-8 py-5">Lokasi Utama</th>
          <th className="px-8 py-5 text-center">Verifikasi</th>
          <th className="px-8 py-5 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {data.map((customer) => (
          <CustomerRow 
            key={customer.id.toString()} 
            customer={customer} 
            onView={onView} 
            onDelete={onDelete} 
          />
        ))}
      </tbody>
    </table>
  );
}