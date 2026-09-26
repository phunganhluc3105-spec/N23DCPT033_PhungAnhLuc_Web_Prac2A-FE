"use client";

import React from "react";
import { ShoppingCart, Upload, Zap, Package, Sparkles } from "lucide-react";
import { Product } from "@/lib/api";
import { formatVND } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenUpload: (product: Product) => void;
  isCached?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenUpload,
  isCached,
}) => {
  const priceNumber = typeof product.price === "number" ? product.price : parseFloat(product.price);

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image container */}
      <div className="relative aspect-4/3 w-full bg-zinc-100 dark:bg-zinc-800/60 overflow-hidden flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-400 p-4 text-center">
            <Package className="w-12 h-12 mb-2 stroke-[1.5] text-zinc-300 dark:text-zinc-600" />
            <span className="text-xs">Chưa có ảnh</span>
          </div>
        )}

        {/* Cloudinary Badge if url contains cloudinary */}
        {product.imageUrl && product.imageUrl.includes("cloudinary") && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-blue-500/90 text-white text-[10px] font-semibold tracking-wide backdrop-blur-md shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Cloudinary
          </div>
        )}

        {/* Upload Image Overlay Button */}
        <button
          onClick={() => onOpenUpload(product)}
          className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm flex items-center gap-1.5 shadow-md"
          title="Tải ảnh lên Cloudinary"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Đổi ảnh</span>
        </button>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {product.category?.name || "Công nghệ"}
            </span>

            {isCached && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                Redis Cache
              </span>
            )}
          </div>

          <h3 className="font-semibold text-zinc-900 dark:text-white text-base line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
            {product.description || "Sản phẩm công nghệ cao cấp, chính hãng phân phối tại Việt Nam."}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-zinc-400 block leading-tight">Giá niêm yết</span>
            <span className="text-base font-bold text-zinc-900 dark:text-white">
              {formatVND(priceNumber)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-indigo-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-indigo-500 dark:hover:text-white text-white text-xs font-semibold shadow transition-all active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
