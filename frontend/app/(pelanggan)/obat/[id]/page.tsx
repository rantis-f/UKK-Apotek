import { obatService } from "@/services/obat.service";
import ProductGallery from "@/components/shop/ProductGallery";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import BuyButton from "@/components/shop/BuyButton";

export default async function DetailObatPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const response = await obatService.getById(id); 
  const product = response?.data;

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-bold text-xs text-gray-400 uppercase tracking-widest">Obat Tidak Ditemukan</p>
        <Link href="/">
          <Button variant="outline" className="rounded-xl text-xs">Kembali ke Beranda</Button>
        </Link>
      </div>
    );
  }

  // Ambil semua foto yang tersedia
  const images = [product.foto1, product.foto2, product.foto3].filter(Boolean);

  return (
    // max-w kita kecilkan ke 5xl agar lebih fokus di tengah
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link 
        href="/" 
        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-8 transition-all group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
        Kembali
      </Link>

      {/* items-center: Kunci agar kiri dan kanan sejajar tengah secara vertikal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Gallery: Dibuat lebih compact */}
        <div className="max-w-sm mx-auto w-full">
          <ProductGallery images={images} />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              {product.jenis_obat?.nama_jenis || "Umum"}
            </Badge>
            {/* Ukuran font judul dikecilkan sedikit */}
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
              {product.nama_obat}
            </h1>
            <p className="text-2xl font-black text-emerald-600">
              {formatRupiah(product.harga_jual)}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Tentang Produk</p>
              <p className="text-gray-500 leading-relaxed text-sm italic">
                {product.deskripsi_obat || "Belum ada deskripsi untuk produk ini."}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Original
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <Truck className="w-4 h-4 text-emerald-500" /> Stok: {product.stok}
              </div>
            </div>
          </div>

          {/* Grid Button: Dibuat lebih ramping (h-14) */}
          <div className="flex items-center gap-3 pt-2">
            {/* Kirim OBJEK product, bukan cuma id string */}
            <BuyButton product={product} />
            
            <Button 
              variant="outline" 
              className="h-14 w-14 rounded-2xl border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-100 transition-all flex-shrink-0"
            >
              <MessageCircle size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}