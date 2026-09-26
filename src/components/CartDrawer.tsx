"use client";

import React, { useState } from "react";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
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
  const [promoCode, setPromoCode] = useState("");
  const [bonusCard, setBonusCard] = useState("");

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const price =
      typeof item.product.price === "number"
        ? item.product.price
        : parseFloat(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const estimatedTax = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const estimatedShipping = subtotal > 0 ? 30000 : 0;
  const total = subtotal + estimatedTax + estimatedShipping;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#EBEBEB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-black tracking-tight">Shopping Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F5] text-zinc-600">
                {items.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center text-zinc-400">
                <ShoppingBag className="w-16 h-16 stroke-[1] mb-3 text-zinc-300" />
                <p className="text-base font-medium text-zinc-600">Your cart is currently empty</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  Browse our catalog and discover amazing microservices-powered products.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* List of Products (Cyber Style) */}
                <div className="divide-y divide-[#EBEBEB]">
                  {items.map((item) => {
                    const price =
                      typeof item.product.price === "number"
                        ? item.product.price
                        : parseFloat(item.product.price);
                    return (
                      <div
                        key={item.product.id}
                        className="py-5 flex items-center gap-4 first:pt-0 last:pb-0"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl bg-[#F6F6F6] p-2 flex items-center justify-center shrink-0">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          ) : (
                            <ShoppingBag className="w-8 h-8 text-zinc-300" />
                          )}
                        </div>

                        {/* Title & SKU */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-black line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            #{item.product.slug || `PRD-${item.product.id}`}
                          </p>
                        </div>

                        {/* Quantity Controller [-] 1 [+] */}
                        <div className="flex items-center border border-[#D9D9D9] rounded-lg">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-zinc-100 text-zinc-600 transition-colors rounded-l-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-zinc-100 text-zinc-600 transition-colors rounded-r-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right w-24">
                          <p className="text-sm font-bold text-black">
                            {formatVND(price * item.quantity)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 text-zinc-400 hover:text-black transition-colors"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Order Summary Box (Cyber Design) */}
                <div className="rounded-2xl border border-[#EBEBEB] p-6 space-y-4 bg-white">
                  <h3 className="text-base font-bold text-black">Order Summary</h3>

                  {/* Discount / Promo code */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 font-medium">
                      Discount code / Promo code
                    </label>
                    <input
                      type="text"
                      placeholder="Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-lg border border-[#D9D9D9] outline-none focus:border-black"
                    />
                  </div>

                  {/* Bonus card number */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 font-medium">
                      Your bonus card number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Card Number"
                        value={bonusCard}
                        onChange={(e) => setBonusCard(e.target.value)}
                        className="flex-1 px-4 py-2.5 text-xs rounded-lg border border-[#D9D9D9] outline-none focus:border-black"
                      />
                      <button className="px-5 py-2.5 rounded-lg border border-black text-xs font-semibold text-black hover:bg-black hover:text-white transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="pt-3 border-t border-[#EBEBEB] space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-black">{formatVND(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Estimated Tax (5%)</span>
                      <span className="font-semibold text-black">{formatVND(estimatedTax)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Estimated shipping & Handling</span>
                      <span className="font-semibold text-black">{formatVND(estimatedShipping)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#EBEBEB] text-sm">
                      <span className="font-bold text-black">Total</span>
                      <span className="font-bold text-black text-base">{formatVND(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={onCheckout}
                    className="w-full py-4 rounded-lg bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-zinc-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
