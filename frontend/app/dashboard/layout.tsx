"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // --- DATA DUMMY ---
  const user = {
    name: "Admin Petugas",
    email: "admin@apotek.com",
    role: "admin"
  };

  const logout = () => {
    router.push("/login");
  };

  const menus = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Kasir", href: "/dashboard/kasir", icon: ShoppingCart },
    { name: "Data Obat", href: "/dashboard/obat", icon: Pill },
    { name: "Data Pelanggan", href: "/dashboard/users", icon: Users },
    { name: "Riwayat Transaksi", href: "/dashboard/transaksi", icon: History },
    { name: "Stok Masuk", href: "/dashboard/restock", icon: Package },
  ];

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
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}>
                <menu.icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-zinc-500"}`} />
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
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 bg-zinc-900 border-zinc-800 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold text-gray-800 capitalize hidden sm:block">
              {pathname.split("/").pop() || "Overview"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-gray-200">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}`} />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                {/* 👇 MENU BARU: PROFILE SAYA */}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Saya</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        <div className="flex-1 p-8 md:p-10 bg-gray-50/50 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}