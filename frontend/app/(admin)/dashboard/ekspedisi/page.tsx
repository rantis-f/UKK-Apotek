"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Edit3, Search, Loader2, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"; 
import { expeditionService } from "@/services/expedition.service";
import ExpeditionForm from "@/components/admin/ExpeditionForm";

export default function ExpeditionListPage() {
  const { token } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [delModal, setDelModal] = useState({ open: false, id: null as string | null });
  const [isDeleting, setIsDeleting] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({ nama_ekspedisi: "", jenis_kirim: "regular", logo_ekspedisi: "" });

  const fetchEkspedisi = async () => {
    try {
      const res = await expeditionService.getAll();
      if (res.success) setList(res.data);
    } catch (err) { toast.error("Gagal sinkron data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEkspedisi(); }, []);

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setIsEditMode(true);
      setSelectedId(item.id);
      setFormData({ 
        nama_ekspedisi: item.nama_ekspedisi, 
        jenis_kirim: item.jenis_kirim, 
        logo_ekspedisi: item.logo_ekspedisi 
      });
      setPreview(item.logo_ekspedisi);
    } else {
      setIsEditMode(false);
      setSelectedId(null);
      setFormData({ nama_ekspedisi: "", jenis_kirim: "regular", logo_ekspedisi: "" });
      setPreview("");
    }
    setFile(null);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!delModal.id) return;
    setIsDeleting(true);
    try {
      const res = await expeditionService.delete(token!, delModal.id);
      if (res.success) {
        toast.success("Berhasil dihapus");
        fetchEkspedisi();
        setDelModal({ open: false, id: null });
      }
    } catch (err) { toast.error("Gagal menghapus"); }
    finally { setIsDeleting(false); }
  };

  const filteredList = useMemo(() => list.filter((item: any) => 
    item.nama_ekspedisi.toLowerCase().includes(searchTerm.toLowerCase())
  ), [list, searchTerm]);

  return (
    <main className="p-8 max-w-4xl mx-auto min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-800">Ekspedisi</h1>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Total {list.length} Kurir</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all active:scale-95">Tambah Kurir</button>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari kurir..." className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm" />
      </div>

      <div className="grid gap-4">
        {loading ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-emerald-500" /></div> : filteredList.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between p-5 bg-white rounded-[2rem] border border-gray-50 shadow-sm hover:border-emerald-100 transition-all group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                <img src={item.logo_ekspedisi} className="w-full h-full object-contain p-2" alt="logo" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black uppercase text-gray-800 tracking-tight">{item.nama_ekspedisi}</h3>
                <span className="text-[9px] px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-black uppercase mt-1 inline-block">{item.jenis_kirim.replace("_", " ")}</span>
              </div>
            </div>
            
            {/* FIXED: Hapus opacity-0 dan group-hover:opacity-100 agar selalu tampil */}
            <div className="flex gap-2 transition-all duration-300">
              <button onClick={() => handleOpenModal(item)} className="p-3 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 rounded-xl transition-all shadow-sm">
                <Edit3 size={16}/>
              </button>
              <button onClick={() => setDelModal({ open: true, id: item.id })} className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all shadow-sm">
                <Trash2 size={16}/>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* MODERN DELETE MODAL */}
      {delModal.open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
              <AlertCircle size={32} strokeWidth={3} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter mb-2 text-gray-800">Hapus Layanan?</h2>
            {/* UBAH: Gunakan <p> bukannya <button> untuk teks deskripsi */}
            <p className="text-xs text-gray-500 font-medium mb-8 leading-relaxed px-4">
              Tindakan ini tidak dapat dibatalkan. Data kurir akan hilang permanen.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleConfirmDelete} disabled={isDeleting} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 shadow-lg shadow-red-200 active:scale-95">
                {isDeleting ? <Loader2 className="animate-spin mx-auto" size={16}/> : "Ya, Hapus Data"}
              </button>
              <button onClick={() => setDelModal({ open: false, id: null })} className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">Batalkan</button>
            </div>
          </div>
        </div>
      )}

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-full hover:bg-red-50"><X size={20}/></button>
            <h2 className="text-xl font-black uppercase text-center mb-8 text-gray-800">{isEditMode ? "Edit Kurir" : "Tambah Kurir"}</h2>
            <ExpeditionForm formData={formData} setFormData={setFormData} file={file} setFile={setFile} preview={preview} setPreview={setPreview} loading={submitLoading} onSubmit={async (e: any) => {
              e.preventDefault(); setSubmitLoading(true);
              const data = new FormData();
              data.append("nama_ekspedisi", formData.nama_ekspedisi);
              data.append("jenis_kirim", formData.jenis_kirim);
              file ? data.append("logo_ekspedisi", file) : data.append("logo_ekspedisi", formData.logo_ekspedisi);
              try {
                const res = isEditMode ? await expeditionService.update(token!, selectedId!, data) : await expeditionService.create(token!, data);
                if (res.success) { toast.success(isEditMode ? "Data diperbarui!" : "Data ditambahkan!"); setIsModalOpen(false); fetchEkspedisi(); }
              } catch (err) { toast.error("Gagal simpan"); }
              finally { setSubmitLoading(false); }
            }} />
          </div>
        </div>
      )}
    </main>
  );
}