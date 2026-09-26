"use client";

import React from "react";
import { ShoppingBag, User as UserIcon, LogOut, Package, Search, Sparkles } from "lucide-react";
import { User } from "@/lib/api";

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onLogout: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenOrders,
  onLogout,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                TechStore
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Microservices
              </span>
            </div>
            <p className="text-xs text-zinc-500 hidden sm:block">Lab 2a E-Commerce Platform</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm (iPhone, MacBook...)"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Orders History Button */}
          {user && (
            <button
              onClick={onOpenOrders}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Đơn hàng</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Xem giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[11px] font-bold text-white bg-indigo-600 rounded-full animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-zinc-500">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserIcon className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
