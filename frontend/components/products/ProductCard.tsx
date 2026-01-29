"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductProps {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export default function ProductCard({ id, name, price, category, image }: ProductProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-3 md:p-4 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50">
        <img 
          src={image}
          alt={name} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded">
          {category}
        </div>
      </div>
      
      <h3 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
        {name}
      </h3>
      
      <p className="text-emerald-600 font-extrabold text-lg">
        Rp {price?.toLocaleString("id-ID") || "0"}
      </p>
      
      <Button className="w-full mt-4 bg-gray-50 hover:bg-emerald-600 text-gray-800 hover:text-white border-none transition-all shadow-none">
        <ShoppingCart className="w-4 h-4 mr-2" /> 
        Beli
      </Button>
    </div>
  );
}