"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Database,
  Cloud,
  Layers,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
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
  const [pagination, setPagination] = useState({ page: 1, limit: 8, totalPages: 1, total: 0 });
  const [fromCache, setFromCache] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals & Drawers
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [uploadTargetProduct, setUploadTargetProduct] = useState<Product | null>(null);

  // User Auth State
  const [user, setUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load User profile if token exists
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      fetchProfile(token)
        .then((res) => setUser(res.user))
        .catch(() => clearStoredTokens());
    }
  }, []);

  // Load products
  const loadProductsData = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await fetchProducts(page, 8, search);
      setProducts(res.data || []);
      setPagination(res.pagination);
      setFromCache(Boolean(res.fromCache));
    } catch (err: any) {
      showToast(err.message || "Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProductsData(1, searchTerm);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleLogout = () => {
    clearStoredTokens();
    setUser(null);
    showToast("Đã đăng xuất tài khoản.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-zinc-900/90 text-white dark:bg-white/90 dark:text-zinc-900 text-xs font-semibold shadow-2xl backdrop-blur-md border border-zinc-700/50 animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        user={user}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-10 border-b border-zinc-200/60 dark:border-zinc-800/80 bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lab 2a Microservices Cloud Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
              Cửa hàng công nghệ{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                Microservices
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Nền tảng thương mại điện tử phân tán kết nối API Gateway, Supabase PostgreSQL, MongoDB Atlas, Redis Cache và Cloudinary.
            </p>

            {/* Architecture Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <a
                href={GATEWAY_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 text-zinc-700 dark:text-zinc-300 shadow-sm transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>API Gateway (Railway)</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>Supabase PostgreSQL (Products, Users)</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
                <Database className="w-3.5 h-3.5 text-green-500" />
                <span>MongoDB Atlas (Orders)</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Redis Caching</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
                <Cloud className="w-3.5 h-3.5 text-blue-500" />
                <span>Cloudinary Storage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Status & Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Danh mục sản phẩm
            </h2>
            <span className="text-xs text-zinc-400 font-medium">({pagination.total} sản phẩm)</span>

            {/* Redis Cache Status Indicator */}
            {fromCache ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-semibold shadow-sm animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Phản hồi tức thì từ Redis Cache</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>Truy vấn trực tiếp Supabase</span>
              </span>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => loadProductsData(pagination.page, searchTerm)}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Tải lại</span>
          </button>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Đang tải danh sách sản phẩm từ API Gateway...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-8">
            <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
              Không tìm thấy sản phẩm nào
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Thử tìm kiếm với từ khoá khác hoặc tải lại trang.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isCached={fromCache}
                onAddToCart={handleAddToCart}
                onOpenUpload={(p) => setUploadTargetProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => loadProductsData(pagination.page - 1, searchTerm)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold px-4 text-zinc-600 dark:text-zinc-400">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => loadProductsData(pagination.page + 1, searchTerm)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 TechStore Lab 2a — Microservices Architecture Project</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Node.js</span>
            <span>•</span>
            <span>Express</span>
            <span>•</span>
            <span>Prisma</span>
            <span>•</span>
            <span>Mongoose</span>
            <span>•</span>
            <span>Next.js 15</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          showToast(`Đăng nhập thành công! Xin chào ${u.name}`);
        }}
      />

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
        onOrderSuccess={(order) => {
          setCartItems([]);
          showToast(`Tạo đơn hàng ${order.orderCode} thành công!`);
        }}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <UploadModal
        product={uploadTargetProduct}
        isOpen={Boolean(uploadTargetProduct)}
        onClose={() => setUploadTargetProduct(null)}
        onUploadSuccess={(prodId, newUrl) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === prodId ? { ...p, imageUrl: newUrl } : p))
          );
          showToast("Đã tải ảnh lên Cloudinary thành công!");
        }}
      />
    </div>
  );
}
