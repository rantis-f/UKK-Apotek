"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, ShoppingCart, Package, ShieldCheck,
  Users, History, LogOut, Menu, Pill, Bell,
  User, ShoppingBag, FolderTree, Truck, ChevronRight,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => { setIsMounted(true); }, []);

  const displayName = user?.name || user?.nama_pelanggan || "User";
  const userRole = user?.role || user?.jabatan || "guest";

  const menus = useMemo(() => {
    const baseMenu = [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }];
    if (userRole === "pelanggan") {
      return [
        ...baseMenu,
        { name: "Belanja", href: "/dashboard/shop", icon: ShoppingBag },
        { name: "Pesanan Saya", href: "/dashboard/pesanan", icon: History },
      ];
    }
    const items = [...baseMenu];
    if (["kasir", "admin", "pemilik"].includes(userRole)) {
      items.push({ name: "Kasir", href: "/dashboard/kasir", icon: ShoppingCart });
    }
    if (["apoteker", "admin", "pemilik"].includes(userRole)) {
      items.push(
        { name: "Data Obat", href: "/dashboard/obat", icon: Pill },
        { name: "Jenis Obat", href: "/dashboard/jenis-obat", icon: FolderTree },
        { name: "Distributor", href: "/dashboard/distributor", icon: Truck },
        { name: "Stok Masuk", href: "/dashboard/restock", icon: Package }
      );
    }
    if (["admin", "pemilik"].includes(userRole)) {
      items.push(
        { name: "Data Pelanggan", href: "/dashboard/pelanggan", icon: Users },
        { name: "Manajemen User", href: "/dashboard/users", icon: ShieldCheck },
        { name: "Metode Bayar", href: "/dashboard/metode-bayar", icon: CreditCard }
      );
    }
    items.push({ name: "Daftar Pesanan", href: "/dashboard/pesanan", icon: History });
    return items;
  }, [userRole]);

  const getPageTitle = () => {
    const segment = pathname.split("/").pop();
    if (segment === "dashboard") return "Overview Statistik";
    if (segment === "obat") return "Katalog Obat";
    if (segment === "kasir") return "Point of Sales";
    return segment?.replace(/-/g, " ") || "Dashboard";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#022c22] text-white border-r border-white/5 shadow-2xl">
      <div className="h-20 flex items-center px-6 border-b border-white/5 bg-black/10">
        <div className="bg-emerald-600 p-2 rounded-xl mr-3 shadow-lg shadow-emerald-500/20 ring-1 ring-white/10">
          <Pill className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tighter leading-none bg-linear-to-br from-white to-emerald-100 bg-clip-text text-transparent">
            RAN_STORE
          </span>
          <span className="text-[9px] font-black text-emerald-400/40 uppercase tracking-[0.25em] mt-1">Pharmacy System</span>
        </div>
      </div>

      <div className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menus.map((menu) => {
          const isActive = pathname === menu.href || (menu.href !== "/dashboard" && pathname.startsWith(menu.href));
          return (
            <Link key={menu.href} href={menu.href} onClick={() => setIsMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 group
                ${isActive
                  ? "bg-emerald-600 text-white shadow-xl shadow-emerald-950/60 ring-1 ring-white/20 translate-x-1"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
                }`}>
                <menu.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-emerald-500/60 group-hover:text-emerald-400"}`} />
                <span className="flex-1">{menu.name}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-white/50" />}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/5">
        <div className="bg-black/20 rounded-2xl p-4 border border-white/5 backdrop-blur-sm text-center">
          <p className="text-[9px] font-black text-emerald-500/30 uppercase tracking-[0.3em] mb-2">Cloud Identity</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase italic">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <aside className="hidden md:block w-72 fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 bg-[#022c22] border-emerald-900/30 w-72 [&>button]:text-white [&>button]:opacity-80 [&>button:hover]:text-emerald-400 [&>button:hover]:opacity-100 transition-all"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>RAN_STORE</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <main className="flex-1 md:ml-72 min-h-screen flex flex-col transition-all duration-300">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md bg-white/80 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-gray-600" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hidden sm:block">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-emerald-600 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-gray-100 hover:ring-emerald-200 transition-all p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${displayName}&background=059669&color=fff`} />
                    <AvatarFallback className="bg-emerald-600 text-white font-bold">{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2 rounded-[1.5rem] p-2 shadow-2xl border-none bg-white" align="end">
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-bold leading-none text-gray-900">{displayName}</p>
                    <p className="text-[10px] leading-none text-gray-500 truncate font-medium">{user?.email}</p>
                    <div className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-600 uppercase tracking-wider w-fit border border-emerald-100">
                      {userRole}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-50" />
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer p-3 focus:bg-emerald-50 focus:text-emerald-700">
                  <Link href="/dashboard/profile" className="flex items-center w-full font-bold text-xs text-gray-600">
                    <User className="mr-3 h-4 w-4 text-emerald-500" />
                    Profil Saya
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-50" />
                <DropdownMenuItem onClick={logout} className="rounded-xl text-red-500 cursor-pointer p-3 focus:bg-red-50 focus:text-red-600">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-bold text-xs uppercase tracking-widest">Keluar Akun</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-10 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}