"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import ProductCard from "@/components/products/ProductCard";
import { ChevronRight, Loader2, PackageSearch } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/obat?limit=4`);
        const json = await res.json();

        if (json.success) {
          setProducts(json.data);
        }
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      } finally {
        setLoading(false);
      }
    };

    if (API_URL) fetchTopProducts();
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Hero />
        <ServiceFeatures />

        <section className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Produk Terlaris</h2>
              <p className="text-gray-500 text-sm">Pilihan terbaik untuk kesehatan Anda</p>
            </div>
            <Link href="/catalogue" className="text-emerald-600 font-bold flex items-center gap-1 hover:underline text-sm md:text-base">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex h-60 flex-col items-center justify-center text-emerald-600">
              <Loader2 className="h-10 w-10 animate-spin mb-2" />
              <p className="text-gray-400 text-sm italic font-medium">Memuat produk terbaik...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.nama_obat}
                  price={product.harga_jual}
                  category={product.jenis_obat?.jenis || "Umum"}
                  image="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <PackageSearch className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 font-medium">Belum ada produk yang tersedia saat ini.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}