"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Database,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Laptop,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
  ArrowRight,
  ShieldCheck,
  Check,
  ShoppingBag,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { AuthModal } from "@/components/AuthModal";
import { CartDrawer, CartItem } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { OrderHistoryModal } from "@/components/OrderHistoryModal";
import { UploadModal } from "@/components/UploadModal";
import {
  fetchProducts,
  fetchProfile,
  getStoredToken,
  clearStoredTokens,
  Product,
  User,
  GATEWAY_URL,
} from "@/lib/api";

export default function Home() {
  // App States
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    totalPages: 1,
    total: 0,
  });
  const [fromCache, setFromCache] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "bestseller" | "featured">(
    "new"
  );

  // Modals & Drawers
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [uploadTargetProduct, setUploadTargetProduct] =
    useState<Product | null>(null);

  // User Auth State
  const [user, setUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check stored user session
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      fetchProfile(token)
        .then((res) => setUser(res.user))
        .catch(() => clearStoredTokens());
    }
  }, []);

  // Fetch Products with pagination & search & filter
  const loadProducts = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await fetchProducts(page, 8, search);
      setProducts(res.data || []);
      setPagination(res.pagination || { page, limit: 8, totalPages: 1, total: 0 });
      setFromCache(!!res.fromCache);
    } catch (err: any) {
      showToast(err.message || "Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(1, searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cart actions
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleLogout = () => {
    clearStoredTokens();
    setUser(null);
    showToast("Đã đăng xuất thành công.");
  };

  // Filter products by selected category if any
  const displayedProducts = selectedCategory
    ? products.filter((p) =>
        (p.category?.name || "")
          .toLowerCase()
          .includes(selectedCategory.toLowerCase())
      )
    : products;

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Categories list for Browse By Category
  const categoryCards = [
    { id: "Phones", name: "Phones", icon: Smartphone },
    { id: "Smart Watches", name: "Smart Watches", icon: Watch },
    { id: "Cameras", name: "Cameras", icon: Camera },
    { id: "Headphones", name: "Headphones", icon: Headphones },
    { id: "Computers", name: "Computers", icon: Laptop },
    { id: "Gaming", name: "Gaming", icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col selection:bg-black selection:text-white">
      {/* ─── Cyber Navbar ─── */}
      <Navbar
        user={user}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* ─── Hero Section (iPhone 14/16 Pro Luxury Dark Banner) ─── */}
      <section className="relative w-full bg-[#211C24] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Text */}
          <div className="max-w-xl space-y-5 text-center md:text-left z-10">
            <p className="text-zinc-400 font-semibold text-lg sm:text-xl tracking-tight">
              Pro.Beyond.
            </p>
            <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-white leading-none">
              IPhone 16 <span className="font-extrabold text-white">Pro</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base font-normal max-w-md">
              Created to change everything for the better. For everyone.
            </p>
            <div className="pt-4">
              <a
                href="#products-section"
                className="inline-block px-10 py-3.5 rounded-md border border-white text-white text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Right Hero Image (iPhone Luxury Representation) */}
          <div className="relative w-full max-w-md md:max-w-lg aspect-square flex items-center justify-center">
            {/* Visual glow backdrop */}
            <div className="absolute w-72 h-72 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
              alt="iPhone 16 Pro"
              className="relative z-10 w-full max-h-96 object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </section>

      {/* ─── 4-Box Feature Banners (Playstation 5, AirPods, Vision Pro, MacBook Air) ─── */}
      <section className="w-full bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column (PS5 + AirPods & Vision Pro) */}
          <div className="flex flex-col">
            {/* Box 1: Playstation 5 (White) */}
            <div className="bg-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-b md:border-r border-[#EBEBEB]">
              <div className="w-48 h-48 flex items-center justify-center shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80"
                  alt="PlayStation 5"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-3xl font-bold text-black tracking-tight">Playstation 5</h3>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your
                  PlayStation experience.
                </p>
              </div>
            </div>

            {/* Split Row: AirPods Max & Vision Pro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border-b md:border-r border-[#EBEBEB]">
              {/* Box 2: Apple AirPods Max (Light Gray) */}
              <div className="bg-[#EDEDED] p-8 flex flex-col justify-between items-start gap-4">
                <div className="w-full h-36 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80"
                    alt="AirPods Max"
                    className="h-32 object-contain mix-blend-multiply"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-black">
                    Apple <br /> AirPods <span className="font-extrabold">Max</span>
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">Computational audio. Listen, it's powerful.</p>
                </div>
              </div>

              {/* Box 3: Apple Vision Pro (Dark #353535) */}
              <div className="bg-[#353535] text-white p-8 flex flex-col justify-between items-start gap-4">
                <div className="w-full h-36 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80"
                    alt="Vision Pro"
                    className="h-32 object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">
                    Apple <br /> Vision <span className="font-extrabold">Pro</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    An immersive way to experience entertainment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Macbook Air - Large Light Gray Banner) */}
          <div className="bg-[#EDEDED] p-8 sm:p-14 flex flex-col justify-between items-center sm:items-start border-b border-[#EBEBEB]">
            <div className="space-y-3 text-center sm:text-left">
              <h2 className="text-4xl sm:text-5xl font-light text-black tracking-tight">
                Macbook <span className="font-bold">Air</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-sm leading-relaxed">
                The new 15-inch MacBook Air makes room for more of what you love with a spacious
                Liquid Retina display.
              </p>
              <div className="pt-2">
                <a
                  href="#products-section"
                  className="inline-block px-8 py-3 rounded-md border border-black text-black text-xs font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  Shop Now
                </a>
              </div>
            </div>

            <div className="w-full mt-8 flex justify-center sm:justify-end">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
                alt="Macbook Air"
                className="w-full max-w-md object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Browse By Category Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-black tracking-tight">Browse By Category</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-2 rounded-full border border-zinc-200 hover:border-black text-black transition-colors"
              title="Reset filter"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-full border border-zinc-200 hover:border-black text-black transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categoryCards.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : cat.id)
                }
                className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-200 group ${
                  isSelected
                    ? "bg-black text-white shadow-lg"
                    : "bg-[#EDEDED] text-black hover:bg-zinc-200"
                }`}
              >
                <Icon
                  className={`w-8 h-8 transition-transform group-hover:scale-110 ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                />
                <span className="text-xs font-semibold tracking-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Products Catalog Section (New Arrival / Bestseller / Featured) ─── */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Section Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EBEBEB] pb-4 mb-8">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab("new")}
              className={`text-sm font-semibold pb-4 -mb-4 transition-colors relative ${
                activeTab === "new"
                  ? "text-black border-b-2 border-black"
                  : "text-zinc-400 hover:text-black"
              }`}
            >
              New Arrival
            </button>
            <button
              onClick={() => setActiveTab("bestseller")}
              className={`text-sm font-semibold pb-4 -mb-4 transition-colors relative ${
                activeTab === "bestseller"
                  ? "text-black border-b-2 border-black"
                  : "text-zinc-400 hover:text-black"
              }`}
            >
              Bestseller
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`text-sm font-semibold pb-4 -mb-4 transition-colors relative ${
                activeTab === "featured"
                  ? "text-black border-b-2 border-black"
                  : "text-zinc-400 hover:text-black"
              }`}
            >
              Featured Products
            </button>
          </div>

          {/* Redis Caching Status Indicator (Discreet & Informative) */}
          <div className="flex items-center gap-2">
            {fromCache ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>fromCache: true (Redis Caching)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Supabase PostgreSQL</span>
              </span>
            )}

            <button
              onClick={() => loadProducts(pagination.page, searchTerm)}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-black hover:border-black transition-colors"
              title="Làm mới dữ liệu từ API"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Selected Category Notice */}
        {selectedCategory && (
          <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-zinc-100 text-xs">
            <span>
              Đang lọc theo danh mục: <strong className="text-black">{selectedCategory}</strong>
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-zinc-500 hover:text-black underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-black mb-3" />
            <p className="text-xs font-medium">Đang nạp sản phẩm từ Product Service...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400">
            <p className="text-sm">Không tìm thấy sản phẩm phù hợp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOpenUpload={(p) => setUploadTargetProduct(p)}
                isCached={fromCache}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => loadProducts(pagination.page - 1, searchTerm)}
              disabled={pagination.page <= 1}
              className="p-2.5 rounded-lg border border-zinc-200 text-black hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => loadProducts(p, searchTerm)}
                className={`w-10 h-10 rounded-lg text-xs font-semibold transition-colors ${
                  pagination.page === p
                    ? "bg-black text-white"
                    : "bg-[#F5F5F5] text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => loadProducts(pagination.page + 1, searchTerm)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2.5 rounded-lg border border-zinc-200 text-black hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* ─── 4-Column Promo Banner Grid (Popular Products, iPad Pro, Samsung Galaxy, Macbook Pro) ─── */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-[#EBEBEB]">
        {/* Column 1: Popular Products */}
        <div className="p-8 bg-white flex flex-col justify-between items-start border-r border-[#EBEBEB]">
          <div className="w-full h-40 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
              alt="Popular Products"
              className="h-32 object-contain mix-blend-multiply"
            />
          </div>
          <div className="space-y-3 mt-6">
            <h3 className="text-2xl font-light text-black">Popular Products</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.
            </p>
            <a
              href="#products-section"
              className="inline-block px-6 py-2.5 rounded-md border border-black text-xs font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>

        {/* Column 2: iPad Pro */}
        <div className="p-8 bg-[#F9F9F9] flex flex-col justify-between items-start border-r border-[#EBEBEB]">
          <div className="w-full h-40 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80"
              alt="iPad Pro"
              className="h-32 object-contain mix-blend-multiply"
            />
          </div>
          <div className="space-y-3 mt-6">
            <h3 className="text-2xl font-light text-black">Ipad Pro</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.
            </p>
            <a
              href="#products-section"
              className="inline-block px-6 py-2.5 rounded-md border border-black text-xs font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>

        {/* Column 3: Samsung Galaxy */}
        <div className="p-8 bg-[#EAEAEA] flex flex-col justify-between items-start border-r border-[#EBEBEB]">
          <div className="w-full h-40 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80"
              alt="Samsung Galaxy"
              className="h-32 object-contain mix-blend-multiply"
            />
          </div>
          <div className="space-y-3 mt-6">
            <h3 className="text-2xl font-light text-black">Samsung Galaxy</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.
            </p>
            <a
              href="#products-section"
              className="inline-block px-6 py-2.5 rounded-md border border-black text-xs font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>

        {/* Column 4: Macbook Pro (Dark #2C2C2C) */}
        <div className="p-8 bg-[#2C2C2C] text-white flex flex-col justify-between items-start">
          <div className="w-full h-40 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
              alt="Macbook Pro"
              className="h-32 object-contain"
            />
          </div>
          <div className="space-y-3 mt-6">
            <h3 className="text-2xl font-light text-white">Macbook Pro</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.
            </p>
            <a
              href="#products-section"
              className="inline-block px-6 py-2.5 rounded-md border border-white text-xs font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* ─── Big Summer Sale Banner ─── */}
      <section className="relative w-full bg-[#181818] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-white">
            Big Summer <span className="font-bold">Sale</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Commodo fames vitae vitae leo mauris in. Eu consequat tristique diam aliquet.
          </p>
          <div className="pt-4">
            <a
              href="#products-section"
              className="inline-block px-10 py-3.5 rounded-md border border-white text-white text-xs font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer (Cyber Black Style) ─── */}
      <footer className="w-full bg-black text-white pt-16 pb-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-800">
            {/* Column 1: Brand & Bio */}
            <div className="space-y-4">
              <span className="text-2xl font-black tracking-tight text-white font-sans lowercase">
                cyber
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                We are a distributed e-commerce microservices platform delivering seamless shopping
                experiences backed by modern cloud architectures.
              </p>
            </div>

            {/* Column 2: Services */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Services</h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Bonus program</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift cards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Credit and payment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Service contracts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Non-cash account</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Payment</a></li>
              </ul>
            </div>

            {/* Column 3: Assistance to the buyer */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Assistance to the buyer
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Find an order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of delivery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Exchange and return of goods</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guarantee</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Frequently asked questions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of use of the site</a></li>
              </ul>
            </div>

            {/* Column 4: Microservices Architecture (Discreet & Elegant) */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Microservices Stack</span>
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li>
                  <a
                    href={GATEWAY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>API Gateway (Railway Live)</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
                <li><span>Supabase PostgreSQL (Products, Users)</span></li>
                <li><span>MongoDB Atlas (Orders & History)</span></li>
                <li><span>Redis In-Memory Caching</span></li>
                <li><span>Cloudinary Media Storage</span></li>
                <li>
                  <a
                    href={`${GATEWAY_URL}/api-docs`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    <span>Swagger Interactive Docs</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <p>© 2026 Cyber Shop — Microservices Architecture Lab 2a (Phùng Anh Lực - N23DCPT033)</p>
            <div className="flex items-center gap-4">
              <span>Next.js 15</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>TypeScript</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Modals & Drawers ─── */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        user={user}
        onOpenAuth={() => {
          setIsCheckoutOpen(false);
          setIsAuthOpen(true);
        }}
        onOrderSuccess={() => {
          setCartItems([]);
          showToast("Đơn hàng đã được lưu thành công trên MongoDB Atlas!");
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          showToast(`Xin chào, ${loggedUser.name}!`);
        }}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      {uploadTargetProduct && (
        <UploadModal
          isOpen={!!uploadTargetProduct}
          onClose={() => setUploadTargetProduct(null)}
          product={uploadTargetProduct}
          onUploadSuccess={(productId: number, imageUrl: string) => {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === productId ? { ...p, imageUrl } : p
              )
            );
            showToast("Đã tải ảnh lên Cloudinary và cập nhật sản phẩm thành công!");
          }}
        />
      )}

      {/* ─── Toast Notification Pill ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-black text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-zinc-800 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
