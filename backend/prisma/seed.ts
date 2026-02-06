import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Memulai Seeding Database "Ran_Store" PRO dengan Link Gambar Real...');

  const passwordHash = await hash('password123', 10);

  // --- 1. MASTER USER (ADMIN & KASIR) ---
  console.log('👥 Mengisi data User Internal...');
  await prisma.user.upsert({
    where: { email: 'admin@apotek.com' },
    update: {},
    create: { name: 'Admin Utama', email: 'admin@apotek.com', password: passwordHash, jabatan: 'admin' },
  });

  await prisma.user.upsert({
    where: { email: 'kasir@apotek.com' },
    update: {},
    create: { name: 'Budi Kasir', email: 'kasir@apotek.com', password: passwordHash, jabatan: 'kasir' },
  });

  // --- 2. PELANGGAN (WAJIB ID 1 = PELANGGAN UMUM) ---
  console.log('👤 Mengisi data Pelanggan...');
  const pel1 = await prisma.pelanggan.create({
    data: { 
      nama_pelanggan: 'Pelanggan Umum', 
      email: 'umum@ranstore.com', 
      katakunci: '-', 
      no_telp: '-', 
      alamat1: 'Walk-in Toko' 
    },
  });

  const pel2 = await prisma.pelanggan.create({
    data: { 
      nama_pelanggan: 'Andi Wijaya', 
      email: 'andi@gmail.com', 
      katakunci: '123456', 
      no_telp: '0812334455', 
      alamat1: 'Jl. Pemuda No. 12', 
      kota1: 'Jakarta' 
    },
  });

  // --- 3. METODE BAYAR (WAJIB ID 1 = TUNAI) ---
  console.log('💳 Mengisi Metode Pembayaran...');
  const bayar1 = await prisma.metodeBayar.create({
    data: { metode_pembayaran: 'Tunai', tempat_bayar: 'Kasir Utama', url_logo: 'https://cdn-icons-png.flaticon.com/512/2331/2331895.png' }
  });

  await prisma.metodeBayar.create({
    data: { metode_pembayaran: 'Transfer BCA', no_rekening: '888-222-333', tempat_bayar: 'M-Banking', url_logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' }
  });

  // --- 4. JENIS PENGIRIMAN (WAJIB ID 1 = AMBIL DI TOKO) ---
  console.log('🚚 Mengisi Jenis Pengiriman...');
  const kirim1 = await prisma.jenisPengiriman.create({
    data: { jenis_kirim: 'standar', nama_ekspedisi: 'Ambil di Toko', logo_ekspedisi: 'https://cdn-icons-png.flaticon.com/512/869/869636.png' }
  });

  const kirim2 = await prisma.jenisPengiriman.create({
    data: { jenis_kirim: 'regular', nama_ekspedisi: 'J&T Express', logo_ekspedisi: 'https://upload.wikimedia.org/wikipedia/en/2/22/J%26T_Express_logo.png' }
  });

  // --- 5. MASTER OBAT (DENGAN LINK GAMBAR ASLI) ---
  console.log('💊 Mengisi Master Obat dengan Gambar Real...');
  const katTablet = await prisma.jenisObat.create({ data: { jenis: 'Tablet', deskripsi_jenis: 'Obat padat telan' } });
  const katSirup = await prisma.jenisObat.create({ data: { jenis: 'Sirup', deskripsi_jenis: 'Obat cair manis' } });
  const katVitamin = await prisma.jenisObat.create({ data: { jenis: 'Vitamin', deskripsi_jenis: 'Suplemen kesehatan' } });

  const obatList = [
    { 
      nama_obat: 'Paracetamol 500mg', 
      idjenis: katTablet.id, 
      harga_jual: 5000, 
      stok: 100, 
      foto1: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop' 
    },
    { 
      nama_obat: 'Promag Tablet', 
      idjenis: katTablet.id, 
      harga_jual: 9000, 
      stok: 50, 
      foto1: 'https://images.unsplash.com/photo-1576073719710-aa4e334b077a?q=80&w=1000&auto=format&fit=crop' 
    },
    { 
      nama_obat: 'Sanmol Forte Sirup', 
      idjenis: katSirup.id, 
      harga_jual: 25000, 
      stok: 30, 
      foto1: 'https://images.unsplash.com/photo-1631549916768-4119b2e55916?q=80&w=1000&auto=format&fit=crop' 
    },
    { 
      nama_obat: 'Neurobion Forte', 
      idjenis: katVitamin.id, 
      harga_jual: 45000, 
      stok: 15, 
      foto1: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce44?q=80&w=1000&auto=format&fit=crop' 
    },
  ];

  const createdObats = [];
  for (const o of obatList) {
    const created = await prisma.obat.create({ data: o });
    createdObats.push(created);
  }

  // --- 6. DISTRIBUTOR & SIMULASI RESTOCK ---
  console.log('📦 Menambahkan Distributor & Pembelian...');
  const dist = await prisma.distributor.create({
    data: { nama_distributor: 'PT Kimia Farma', telepon: '021-555666', alamat: 'Jakarta' }
  });

  await prisma.pembelian.create({
    data: {
      nonota: 'PURCH/2026/001',
      tgl_pembelian: new Date(),
      total_bayar: 200000,
      id_distributor: dist.id,
      details: {
        create: [
          { id_obat: createdObats[0].id, jumlah_beli: 50, harga_beli: 3000, subtotal: 150000 },
          { id_obat: createdObats[1].id, jumlah_beli: 10, harga_beli: 5000, subtotal: 50000 },
        ]
      }
    }
  });

  // --- 7. SIMULASI PENJUALAN ---
  console.log('🛒 Mensimulasikan Transaksi Penjualan...');
  const jual1 = await prisma.penjualan.create({
    data: {
      tgl_penjualan: new Date(),
      id_pelanggan: pel1.id,
      id_metode_bayar: bayar1.id,
      id_jenis_kirim: kirim1.id,
      ongkos_kirim: 0,
      biaya_app: 1000,
      total_bayar: 11000,
      status_order: 'Selesai',
      details: {
        create: [
          { id_obat: createdObats[0].id, jumlah_beli: 2, harga_beli: 5000, subtotal: 10000 }
        ]
      }
    }
  });

  console.log('✅ SEEDING BERHASIL! Gambar sudah otomatis terhubung ke link Unsplash.');
}

main()
  .catch((e) => { console.error('❌ Error Seeding:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });