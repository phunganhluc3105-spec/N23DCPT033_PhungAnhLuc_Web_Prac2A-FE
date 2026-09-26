"use client";

import React, { useState } from "react";
import { X, CheckCircle, Loader2, MapPin, AlertCircle, ShoppingBag } from "lucide-react";
import { CartItem } from "./CartDrawer";
import { createOrder, getStoredToken, Order, User } from "@/lib/api";
import { formatVND } from "@/lib/utils";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: User | null;
  onOpenAuth: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  user,
  onOpenAuth,
  onOrderSuccess,
}) => {
  const [street, setStreet] = useState("123 Nguyễn Huệ");
  const [district, setDistrict] = useState("Quận 1");
  const [city, setCity] = useState("Hồ Chí Minh");
  const [note, setNote] = useState("Giao giờ hành chính");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => {
    const price = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = getStoredToken();
    if (!token || !user) {
      setError("Vui lòng đăng nhập để hoàn tất đặt hàng!");
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => {
        const price = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price);
        return {
          productId: item.product.id,
          productName: item.product.name,
          price,
          quantity: item.quantity,
        };
      });

      const res = await createOrder(token, {
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        items: orderItems,
        shippingAddress: { street, city, district },
        note,
      });

      setCreatedOrder(res.data);
      onOrderSuccess(res.data);
    } catch (err: any) {
      setError(err.message || "Tạo đơn hàng thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {createdOrder ? (
          /* Success Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Đặt hàng thành công!
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Đơn hàng của bạn đã được ghi nhận trên MongoDB Atlas
            </p>

            <div className="my-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {createdOrder.orderCode}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Người nhận:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {createdOrder.customerName} ({createdOrder.customerEmail})
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Địa chỉ:</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {createdOrder.shippingAddress?.street}, {createdOrder.shippingAddress?.district},{" "}
                  {createdOrder.shippingAddress?.city}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Tổng thanh toán:</span>
                <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  {formatVND(createdOrder.totalAmount)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow transition-all"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          /* Form Screen */
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Thông tin giao hàng
                </h3>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Yêu cầu Bearer JWT Token để bảo vệ an toàn đơn hàng
              </p>
            </div>

            {!user && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Bạn cần đăng nhập để đặt hàng</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0"
                >
                  Đăng nhập
                </button>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Địa chỉ số nhà & đường
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Lê Lợi..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Tỉnh / Thành phố
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Ghi chú cho shipper
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              {/* Order Summary */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-sm">
                <span className="text-zinc-500">Tổng thanh toán ({items.length} món):</span>
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {formatVND(totalAmount)}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !user}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all mt-4"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Xác nhận đặt hàng</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
