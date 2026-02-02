"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
    LogOut,
    ShoppingCart,
    User as UserIcon,
    Bell,
    Menu,
    X,
    Info,
    LogIn
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const getInitials = () => {
        if (!user) return "";
        const displayName = user.nama_pelanggan || user.name || "User";
        return displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const navLinks = [
        { name: "Beranda", href: "/", icon: <UserIcon className="w-4 h-4" /> },
        { name: "Obat", href: "/obat", icon: <ShoppingCart className="w-4 h-4" /> },
        { name: "Promo", href: "/promo", icon: <Bell className="w-4 h-4" /> },
        { name: "Tentang", href: "/tentang", icon: <Info className="w-4 h-4" /> },
    ];

    const checkActive = (href: string) => {
        if (href === "/") return pathname === "/";
        if (href === "/obat") return pathname.startsWith("/obat");
        return pathname === href;
    };

    return (
        <nav className="border-b bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                <div className="flex items-center gap-4 md:gap-12">
                    <button
                        className="md:hidden p-2 text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100">
                            <span className="font-bold text-xl italic">💊</span>
                        </div>
                        <span className="font-bold text-lg md:text-xl text-emerald-900 tracking-tight uppercase">Ran_Store</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const active = checkActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${active ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'
                                        }`}
                                >
                                    {link.name}
                                    {active && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {user ? (
                        <>
                            <div className="flex items-center gap-4 text-gray-400 mr-2">
                                <div className="relative group">
                                    <ShoppingCart className="w-5 h-5 group-hover:text-emerald-600 cursor-pointer transition-colors" />
                                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">0</span>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-emerald-50 hover:border-emerald-200 transition-all">
                                        <AvatarFallback className="bg-emerald-500 text-white font-bold text-xs">{getInitials()}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 mt-2 p-2 rounded-2xl shadow-2xl border-gray-100">
                                    <DropdownMenuLabel className="font-normal p-4">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-black text-gray-900 truncate uppercase leading-none">{user.nama_pelanggan || user.name}</p>
                                            <p className="text-xs text-gray-400 truncate mt-1">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer">
                                        <Link href="/profile" className="flex items-center w-full font-bold text-[10px] uppercase tracking-widest text-gray-500">
                                            <UserIcon className="mr-3 h-4 w-4 text-emerald-500" /> Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout} className="p-3 rounded-xl cursor-pointer text-red-600 font-bold text-[10px] uppercase tracking-widest focus:bg-red-50">
                                        <LogOut className="mr-3 h-4 w-4" /> Keluar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" className="text-emerald-600 font-black text-[10px] uppercase tracking-widest px-4 hover:bg-emerald-50 rounded-xl">
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/register" className="hidden sm:block">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl px-6 shadow-lg shadow-emerald-100">
                                    Daftar
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div
                className={`fixed inset-0 bg-emerald-950/60 backdrop-blur-sm z-100 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className={`fixed top-0 left-0 w-75 h-screen bg-emerald-950 text-white shadow-2xl transition-transform duration-500 ease-out md:hidden z-101 overflow-y-auto ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="p-6 min-h-full flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-lg shadow-emerald-900/40">
                                <span className="font-bold text-lg italic">💊</span>
                            </div>
                            <span className="font-bold text-lg uppercase text-emerald-50">Ran_Store</span>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-emerald-900/50 rounded-xl text-emerald-300"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="space-y-3 flex-1">
                        <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] ml-2 mb-6">Menu Utama</p>
                        {navLinks.map((link) => {
                            const active = checkActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-4 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-emerald-600 text-white shadow-lg translate-x-2' : 'text-emerald-300/60 hover:bg-emerald-900/50 hover:text-white'
                                        }`}
                                >
                                    <span className={active ? 'text-white' : 'text-emerald-500'}>{link.icon}</span>
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="pt-8 border-t border-emerald-900/50 mt-10 pb-10">
                        {!user ? (
                            <div className="space-y-4">
                                <p className="text-[9px] font-black text-emerald-500/40 text-center uppercase tracking-[0.2em] mb-2 font-mono">Ran_Store Authentication</p>
                                <Link href="/register">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-950/20 border-none">
                                        Buat Akun Baru
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full border-emerald-800 text-emerald-300 hover:bg-emerald-900 hover:text-white rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest">
                                        <LogIn className="w-3 h-3 mr-2" /> Masuk Ke Akun
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 p-4 bg-emerald-900/30 rounded-2xl border border-emerald-800/50">
                                    <Avatar className="h-10 w-10 border border-emerald-500 shadow-sm">
                                        <AvatarFallback className="bg-emerald-600 text-[10px]">{getInitials()}</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black truncate text-emerald-50 uppercase tracking-wider leading-none">{user.nama_pelanggan || user.name}</p>
                                        <p className="text-[9px] text-emerald-500 truncate mt-1">{user.email}</p>
                                    </div>
                                </div>
                                <button onClick={logout} className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/10 text-red-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95">
                                    <LogOut className="w-4 h-4" /> Keluar Aplikasi
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}