"use client";
import { useState, useRef, useEffect } from "react";
import { Save, Loader2, Upload, Image as ImageIcon, Check, ChevronUp, Search } from "lucide-react";

export default function ExpeditionForm({ formData, setFormData, file, setFile, preview, setPreview, loading, onSubmit }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "ekonomi", label: "Ekonomi" },
    { value: "regular", label: "Regular" },
    { value: "kargo", label: "Kargo" },
    { value: "same_day", label: "Same Day" },
    { value: "standar", label: "Standar" },
  ];

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Upload Logo Section */}
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50 group hover:border-emerald-200 transition-all">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center overflow-hidden mb-4 border border-gray-50 group-hover:scale-105 transition-transform">
          {preview ? <img src={preview} className="w-full h-full object-contain p-3" /> : <ImageIcon className="text-gray-200" size={36} />}
        </div>
        <label className="cursor-pointer bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-[10px] font-black uppercase hover:bg-emerald-50 text-emerald-600 transition-all flex items-center gap-2 active:scale-95">
          <Upload size={14} /> {file ? "Ganti Logo" : "Upload Logo"}
          <input type="file" hidden accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
          }} />
        </label>
      </div>

      <div className="space-y-4 text-left">
        <div>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-4 mb-2 block tracking-widest">Nama Ekspedisi</label>
          <input 
            type="text" required value={formData.nama_ekspedisi} placeholder="Contoh: JNE, SiCepat..."
            onChange={(e) => setFormData({...formData, nama_ekspedisi: e.target.value})}
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-emerald-200 focus:bg-white font-bold text-sm outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        {/* COMBOBOX DROPUP */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-4 mb-2 block tracking-widest">Layanan</label>
          
          {/* --- BAGIAN MENU DROPUP (Muncul di atas) --- */}
          {isOpen && (
            <div className="absolute z-50 w-full bottom-full mb-2 bg-white rounded-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-50 p-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="relative mb-3">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  autoFocus placeholder="Cari layanan..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none text-xs font-bold outline-none focus:bg-gray-100 transition-all"
                />
              </div>
              <div className="max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                {filteredOptions.length > 0 ? filteredOptions.map((opt) => (
                  <div 
                    key={opt.value}
                    onClick={() => { setFormData({...formData, jenis_kirim: opt.value}); setIsOpen(false); setSearch(""); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all mb-1 last:mb-0 group ${formData.jenis_kirim === opt.value ? "bg-emerald-50 text-emerald-600" : "hover:bg-gray-50 text-gray-600"}`}
                  >
                    <span className="text-xs font-black uppercase tracking-tight">{opt.label}</span>
                    {formData.jenis_kirim === opt.value && <Check size={16} className="text-emerald-600" strokeWidth={3} />}
                  </div>
                )) : <div className="p-4 text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest py-8">Tidak ditemukan</div>}
              </div>
            </div>
          )}
          {/* ------------------------------------------- */}

          <div 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-6 py-4 rounded-2xl bg-gray-50 flex items-center justify-between cursor-pointer group hover:bg-gray-100 transition-all border-2 ${isOpen ? "border-emerald-200 bg-white" : "border-transparent"}`}
          >
            <span className={`font-bold text-sm uppercase ${!formData.jenis_kirim ? "text-gray-400" : "text-gray-800"}`}>
              {options.find(opt => opt.value === formData.jenis_kirim)?.label || "Pilih Layanan"}
            </span>
            {/* Ikon ChevronUp untuk Dropup */}
            <ChevronUp size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-emerald-500" : "group-hover:text-gray-600"}`} />
          </div>
        </div>
      </div>

      <button 
        type="submit" disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100/50 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Simpan Data</>}
      </button>
    </form>
  );
}