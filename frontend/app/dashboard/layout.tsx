"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; 
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  History, 
  LogOut, 
  Menu, 
  Pill,
  Bell,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet"; // 👈 Hapus SheetTrigger dari sini
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false); // State kontrol manual

  // Hook Auth
  const { user, logout } = useAuth(); 

  const menus = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Kasir", href: "/dashboard/kasir", icon: ShoppingCart },
    { name: "Data Obat", href: "/dashboard/obat", icon: Pill },
    { name: "Data Pelanggan", href: "/dashboard/users", icon: Users },
    { name: "Riwayat Transaksi", href: "/dashboard/transaksi", icon: History },
    { name: "Stok Masuk", href: "/dashboard/restock", icon: Package },
  ];

  // Komponen Sidebar (Bisa dipakai di Desktop & Mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-900 text-white border-r border-zinc-800">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Pill className="w-6 h-6 text-emerald-500 mr-2" />
        <span className="font-bold text-lg tracking-wide">Ran_Admin</span>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menus.map((menu) => {
          const isActive = pathname === menu.href;
          return (
            <Link key={menu.href} href={menu.href} onClick={() => setIsMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}>
                <menu.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-zinc-500"}`} />
                {menu.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. SIDEBAR DESKTOP (Hidden di HP) */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* 2. SIDEBAR MOBILE (Sheet / Drawer) */}
      {/* Kita kontrol buka/tutup pakai props 'open', jadi gak butuh Trigger */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 bg-zinc-900 border-zinc-800 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-sm/50 backdrop-blur-sm bg-white/80">
          <div className="flex items-center gap-4">
            
            {/* TOMBOL MENU MOBILE (Perbaikan: Tanpa SheetTrigger) */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMobileOpen(true)} // 👈 Langsung ubah state aja
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </Button>

            <h1 className="text-lg font-semibold text-gray-800 capitalize hidden sm:block">
              {pathname.split("/").pop() || "Overview"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-emerald-600 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-gray-100 hover:ring-emerald-100 transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=10b981&color=fff`} />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Memuat..."}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Saya</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={logout} 
                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        {/* ISI HALAMAN */}
        <div className="flex-1 p-4 sm:p-8 bg-gray-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}