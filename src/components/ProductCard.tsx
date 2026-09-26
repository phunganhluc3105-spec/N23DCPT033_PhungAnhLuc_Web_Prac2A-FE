"use client";

import React, { useState } from "react";
import { Heart, Upload, Zap, Sparkles, ShoppingBag } from "lucide-react";
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
  const [isLiked, setIsLiked] = useState(false);
  const priceNumber =
    typeof product.price === "number" ? product.price : parseFloat(product.price);

  return (
    <div className="group relative rounded-2xl bg-[#F6F6F6] p-6 flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
      {/* Top Bar inside card: Badges & Wishlist Heart */}
      <div className="w-full flex items-center justify-between gap-1 mb-2">
        {/* Subtle Tech Badges */}
        <div className="flex items-center gap-1">
          {isCached && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full"
              title="Dữ liệu truy xuất trực tiếp từ RAM Redis Cache"
            >
              <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              Redis
            </span>
          )}
          {product.imageUrl && product.imageUrl.includes("cloudinary") && (
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-full"
              title="Ảnh lưu trữ trên Cloudinary CDN"
            >
              <Sparkles className="w-2.5 h-2.5 text-sky-500" />
              CDN
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="p-1.5 rounded-full hover:bg-black/5 transition-colors ml-auto text-[#909090] hover:text-red-500"
          title="Thêm vào yêu thích"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>
      </div>

      {/* Product Image Container */}
      <div className="relative w-full aspect-square max-h-48 mb-4 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-32 h-32 rounded-xl bg-zinc-200/60 flex flex-col items-center justify-center text-zinc-400">
            <ShoppingBag className="w-10 h-10 stroke-[1.2] mb-1" />
            <span className="text-[11px]">Chưa có ảnh</span>
          </div>
        )}

        {/* Cloudinary Upload Hover Button */}
        <button
          onClick={() => onOpenUpload(product)}
          className="absolute bottom-1 right-1 p-2 rounded-lg bg-black/80 hover:bg-black text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-md"
          title="Upload ảnh sản phẩm lên Cloudinary"
        >
          <Upload className="w-3 h-3" />
          <span>Đổi ảnh</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="w-full flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-black line-clamp-2 min-h-[2.5rem] mb-2 px-1">
            {product.name}
          </h3>
          <p className="text-xl font-bold text-black tracking-tight mb-4">
            {formatVND(priceNumber)}
          </p>
        </div>

        {/* Solid Black Button: Buy Now */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full py-3 px-6 rounded-lg bg-black text-white text-xs font-semibold tracking-wide hover:bg-zinc-800 active:scale-95 transition-all shadow-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
