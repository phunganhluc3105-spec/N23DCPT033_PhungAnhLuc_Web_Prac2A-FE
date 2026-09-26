"use client";

import React, { useState } from "react";
import {
  Heart,
  User as UserIcon,
  LogOut,
  Package,
  Search,
  Smartphone,
  Laptop,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
  ExternalLink,
  Server,
  Database,
  Cloud,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { User, GATEWAY_URL } from "@/lib/api";

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onLogout: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory?: string | null;
  onSelectCategory?: (cat: string | null) => void;
  wishlistCount?: number;
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
  selectedCategory,
  onSelectCategory,
  wishlistCount = 0,
}) => {
  const categories = [
    { id: "Phones", name: "Phones", icon: Smartphone },
    { id: "Computers", name: "Computers", icon: Laptop },
    { id: "Smart Watches", name: "Smart Watches", icon: Watch },
    { id: "Cameras", name: "Cameras", icon: Camera },
    { id: "Headphones", name: "Headphones", icon: Headphones },
    { id: "Gaming", name: "Gaming", icon: Gamepad2 },
  ];

  return (
    <div className="w-full sticky top-0 z-40 bg-white">
      {/* ─── 1. Discreet Microservices Tech Status Bar ─── */}
      <div className="bg-[#141416] text-[#A0A0A0] text-[11px] py-1.5 px-4 border-b border-[#232328]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Microservices Live
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <a
              href={GATEWAY_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Server className="w-3 h-3 text-indigo-400" />
              API Gateway (Railway)
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1 hover:text-white transition-colors">
              <Database className="w-3 h-3 text-emerald-400" />
              Supabase PostgreSQL
            </span>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1 hover:text-white transition-colors">
              <Database className="w-3 h-3 text-green-400" />
              MongoDB Atlas
            </span>
            <span className="text-zinc-600 hidden lg:inline">•</span>
            <span className="hidden lg:flex items-center gap-1 hover:text-white transition-colors">
              <Zap className="w-3 h-3 text-amber-400" />
              Redis Cache
            </span>
            <span className="text-zinc-600 hidden lg:inline">•</span>
            <span className="hidden lg:flex items-center gap-1 hover:text-white transition-colors">
              <Cloud className="w-3 h-3 text-sky-400" />
              Cloudinary Storage
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`${GATEWAY_URL}/api-docs`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Swagger Docs
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Lab 2a — N23DCPT033</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Main Cyber Header ─── */}
      <header className="border-b border-[#B5B5B5]/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Cyber Brand Logo */}
          <div
            onClick={() => onSelectCategory && onSelectCategory(null)}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            {/* Cyber Logo Mark */}
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-black font-sans lowercase">
              cyber
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#989898]" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-lg bg-[#F5F5F5] border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-[#989898] text-[#1D1D1D]"
              />
            </div>
          </div>

          {/* Navigation Links (Cyber Style) */}
          <nav className="hidden lg:flex items-center gap-8 text-[#000000] text-sm font-medium">
            <button
              onClick={() => onSelectCategory && onSelectCategory(null)}
              className="hover:opacity-70 transition-opacity"
            >
              Home
            </button>
            <a href="#products-section" className="hover:opacity-70 transition-opacity">
              Catalog
            </a>
            <a href="#about-section" className="hover:opacity-70 transition-opacity text-[#909090]">
              About
            </a>
            <a href="#contact-section" className="hover:opacity-70 transition-opacity text-[#909090]">
              Contact Us
            </a>
            <a href="#blog-section" className="hover:opacity-70 transition-opacity text-[#909090]">
              Blog
            </a>
          </nav>

          {/* Action Icons (Wishlist, Cart, Profile) */}
          <div className="flex items-center gap-4">
            {/* Wishlist Heart */}
            <button
              className="p-2 text-[#000000] hover:opacity-70 transition-opacity relative"
              title="Yêu thích"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2 text-[#000000] hover:opacity-70 transition-opacity relative"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-zinc-200">
                <button
                  onClick={onOpenOrders}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md hover:bg-zinc-100 transition-colors text-black"
                  title="Lịch sử đơn hàng"
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden md:inline">Đơn hàng</span>
                </button>

                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-black leading-tight">{user.name}</p>
                  <p className="text-[10px] text-zinc-500">{user.email}</p>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 p-2 text-[#000000] hover:opacity-70 transition-opacity"
                title="Đăng nhập / Đăng ký"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-semibold">Tài khoản</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="px-4 pb-3 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#989898]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-[#F5F5F5] outline-none text-[#1D1D1D]"
            />
          </div>
        </div>
      </header>

      {/* ─── 3. Sub-Category Strip (#2E2E2E Dark Bar) ─── */}
      <div className="bg-[#2E2E2E] text-[#909090] overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-6 min-w-max">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  onSelectCategory &&
                  onSelectCategory(isActive ? null : cat.id)
                }
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded transition-all duration-200 ${
                  isActive
                    ? "text-white bg-white/10 font-semibold"
                    : "hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#909090]"}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
