"use client";

import React, { useState, useEffect } from "react";
import { X, Package, Clock, CheckCircle2, Truck, AlertCircle, Loader2 } from "lucide-react";
import { fetchOrders, getStoredToken, Order } from "@/lib/api";
import { formatVND } from "@/lib/utils";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    const token = getStoredToken();
    if (!token) {
      setError("Bạn cần đăng nhập để xem lịch sử đơn hàng.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrders(token);
      setOrders(res.data || []);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
            <CheckCircle2 className="w-3 h-3" />
            Đã xác nhận
          </span>
        );
      case "shipped":
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50">
            <Truck className="w-3 h-3" />
            Đang giao
          </span>
        );
      case "delivered":
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle2 className="w-3 h-3" />
            Hoàn tất
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
            <Clock className="w-3 h-3" />
            Chờ xử lý
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                Lịch sử đơn hàng
              </h3>
              <p className="text-xs text-zinc-500">Dữ liệu thời gian thực từ MongoDB Atlas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
              <span className="text-xs">Đang tải lịch sử đơn hàng...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              <Package className="w-12 h-12 mx-auto stroke-1 mb-2 text-zinc-300 dark:text-zinc-700" />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Bạn chưa có đơn hàng nào
              </p>
              <p className="text-xs text-zinc-400 mt-1">Hãy đặt hàng để trải nghiệm ngay!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-700/60 pb-3">
                    <div>
                      <span className="text-xs text-zinc-400 block">Mã đơn hàng</span>
                      <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                        {order.orderCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-1.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {it.productName} <span className="text-zinc-400">x{it.quantity}</span>
                        </span>
                        <span className="font-medium text-zinc-900 dark:text-white">
                          {formatVND(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-zinc-200/40 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      Giao tới: {order.shippingAddress?.district}, {order.shippingAddress?.city}
                    </span>
                    <div className="text-right">
                      <span className="text-zinc-400 mr-2">Tổng tiền:</span>
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">
                        {formatVND(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
