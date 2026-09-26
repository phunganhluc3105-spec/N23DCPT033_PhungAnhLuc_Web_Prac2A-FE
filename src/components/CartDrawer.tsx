"use client";

import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/lib/api";
import { formatVND } from "@/lib/utils";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => {
    const price = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Giỏ hàng</h2>
              <span className="text-xs text-zinc-400">({items.length} món)</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400">
                <ShoppingBag className="w-16 h-16 stroke-[1] mb-3 text-zinc-300 dark:text-zinc-700" />
                <p className="font-medium text-sm text-zinc-600 dark:text-zinc-300">
                  Giỏ hàng của bạn đang trống
                </p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  Hãy thêm những sản phẩm công nghệ tuyệt vời vào giỏ nhé!
                </p>
              </div>
            ) : (
              items.map((item) => {
                const price =
                  typeof item.product.price === "number"
                    ? item.product.price
                    : parseFloat(item.product.price);
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-zinc-400">No img</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-zinc-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">
                          {formatVND(price)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                            }
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-1 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Tổng thanh toán:</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {formatVND(totalAmount)}
                </span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Tiến hành đặt hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
