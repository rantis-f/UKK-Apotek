"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Hero from "@/components/home/Hero";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import ProductCard from "@/components/products/ProductCard";
import { 
  ChevronRight, 
  Loader2, 
  PackageSearch, 
  Sparkles, 
  Flame, 
  Pill 
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => { setIsHydrated(true); }, []);

  useEffect(() => {
    if (isHydrated && !authLoading && user && token) {
      if (["admin", "pemilik", "apoteker", "kasir"].includes(user.role?.toLowerCase())) {
        router.push("/dashboard");
      }
    }
  }, [user, token, authLoading, router, isHydrated]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [resCat, resBest, resLatest] = await Promise.all([
          fetch(`${API_URL}/jenis-obat`),
          fetch(`${API_URL}/obat?limit=4&sort=popular`),
          fetch(`${API_URL}/obat?limit=4&sort=latest`)
        ]);
        
        const catJson = await resCat.json();
        const bestJson = await resBest.json();
        const latestJson = await resLatest.json();
        
        if (catJson.success) setCategories(catJson.data);
        if (bestJson.success) setBestSellers(bestJson.data.slice(0, 4));
        if (latestJson.success) setLatestProducts(latestJson.data.slice(0, 4));
      } catch (error) {
        console.error("Gagal load data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (API_URL && isHydrated) fetchHomeData();
  }, [API_URL, isHydrated]);

  if (!isHydrated || authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="animate-in fade-in duration-700">
        <Hero />
        <ServiceFeatures />

        <section className="container mx-auto px-6 py-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Cari Berdasarkan Jenis</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar md:grid md:grid-cols-6">
            {categories.map((cat: any) => (
              <Link 
                key={cat.id} 
                href={`/obat?category=${cat.id}`}
                className="shrink-0 w-32 md:w-full flex flex-col items-center gap-3 p-6 rounded-[2.5rem] bg-gray-50 hover:bg-emerald-600 hover:text-white transition-all group border border-gray-100/50"
              >
                <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:bg-emerald-500 transition-colors">
                  <Pill className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center">
                  {cat.jenis}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Flame className="text-orange-500 w-6 h-6" /> Paling Banyak Dicari
              </h2>
              <p className="text-gray-500 text-sm">Andalan kesehatan pelanggan kami.</p>
            </div>
            <Link href="/obat" className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product: any) => (
              <ProductCard
                key={product.id}
                {...product}
                name={product.nama_obat}
                price={product.harga_jual}
                category={product.jenis_obat?.jenis}
                image={product.foto1}
                badge="HOT"
              />
            ))}
          </div>
        </section>

        <div className="container mx-auto px-6"><hr className="border-gray-50" /></div>

        <section className="container mx-auto px-6 py-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Sparkles className="text-emerald-500 w-6 h-6" /> Stok Terbaru
              </h2>
              <p className="text-gray-500 text-sm">Baru saja tiba di rak apotek kami.</p>
            </div>
            <Link href="/obat" className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                {...product}
                name={product.nama_obat}
                price={product.harga_jual}
                category={product.jenis_obat?.jenis}
                image={product.foto1}
                badge="NEW"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}