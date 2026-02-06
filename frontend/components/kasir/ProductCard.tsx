import { Plus, Package } from "lucide-react";

export const ProductCard = ({ obat, onAdd }: any) => {
  const isOutOfStock = obat.stok <= 0;

  return (
    <div 
      onClick={() => !isOutOfStock && onAdd(obat)}
      className={`relative bg-white p-6 rounded-[2.5rem] border-2 transition-all duration-300 group flex flex-col h-full ${
        isOutOfStock 
          ? "opacity-60 cursor-not-allowed border-transparent grayscale" 
          : "hover:shadow-2xl hover:shadow-blue-100/50 cursor-pointer border-transparent hover:border-blue-500 active:scale-[0.98]"
      }`}
    >
      {/* Badge Kategori */}
      <div className="absolute top-5 left-5 z-10">
        <span className="bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border border-blue-50">
          {obat.jenis_obat?.jenis || "Umum"}
        </span>
      </div>

      {/* Area Gambar - Dioptimalkan untuk 3 kolom */}
      <div className="aspect-[4/3] bg-gray-50 rounded-[2rem] mb-6 overflow-hidden flex items-center justify-center border border-gray-100 group-hover:border-blue-100 transition-colors">
        {obat.foto1 ? (
          <img 
            src={obat.foto1} 
            alt={obat.nama_obat} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-200">
            <Package size={56} strokeWidth={1} />
            <span className="text-[10px] font-black mt-2 tracking-widest opacity-40 uppercase">No Image</span>
          </div>
        )}
      </div>
      
      {/* Konten Text */}
      <div className="space-y-3 flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-black text-base text-gray-900 uppercase tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
            {obat.nama_obat}
          </h3>
          {isOutOfStock && (
            <span className="shrink-0 bg-red-500 text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest">
              Habis
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-emerald-400'} animate-pulse`} />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
            Tersedia: <span className={isOutOfStock ? 'text-red-500' : 'text-gray-900'}>{obat.stok} UNIT</span>
          </span>
        </div>
      </div>

      {/* Footer - Harga & Tombol */}
      {/* sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt  */}

      <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-50">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Harga Jual</span>
          <span className="text-blue-600 font-black text-lg tracking-tighter">
            Rp {Number(obat.harga_jual).toLocaleString()}
          </span>
        </div>
        
        <div className={`p-4 rounded-2xl transition-all duration-300 ${
          isOutOfStock 
            ? "bg-gray-100 text-gray-300" 
            : "bg-blue-600 text-white shadow-xl shadow-blue-100 group-hover:scale-110"
        }`}>
          <Plus size={20} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};