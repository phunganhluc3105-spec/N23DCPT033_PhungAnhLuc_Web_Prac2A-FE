"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Loader2,
  MapPin,
  Truck,
  CreditCard,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [street, setStreet] = useState("123 Nguyễn Huệ");
  const [district, setDistrict] = useState("Quận 1");
  const [city, setCity] = useState("Hồ Chí Minh");
  const [note, setNote] = useState("Giao giờ hành chính");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "credit">("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const price =
      typeof item.product.price === "number"
        ? item.product.price
        : parseFloat(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const shippingCost = shippingMethod === "express" ? 60000 : 30000;
  const totalAmount = subtotal + shippingCost;

  const handleConfirmOrder = async () => {
    setError(null);
    const token = getStoredToken();
    if (!token || !user) {
      setError("Vui lòng đăng nhập để hoàn tất tạo đơn hàng!");
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => {
        const price =
          typeof item.product.price === "number"
            ? item.product.price
            : parseFloat(item.product.price);
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
        shippingAddress: {
          street,
          city,
          district,
        },
        note: `${note} | Shipping: ${shippingMethod} | Payment: ${paymentMethod}`,
      });

      setCreatedOrder(res.data);
      onOrderSuccess(res.data);
    } catch (err: any) {
      setError(err.message || "Tạo đơn hàng thất bại trên MongoDB Atlas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-[#EBEBEB] shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Stepper Header (matching Step 1 / 2 / 3 in Figma Kit) */}
        {!createdOrder && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto relative">
              {/* Step 1: Address */}
              <div
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 cursor-pointer z-10 bg-white pr-2"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    currentStep >= 1
                      ? "bg-black text-white"
                      : "bg-[#EDEDED] text-zinc-400"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase leading-tight">
                    Step 1
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      currentStep === 1 ? "text-black" : "text-zinc-500"
                    }`}
                  >
                    Address
                  </p>
                </div>
              </div>

              {/* Step 2: Shipping */}
              <div
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 cursor-pointer z-10 bg-white px-2"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    currentStep >= 2
                      ? "bg-black text-white"
                      : "bg-[#EDEDED] text-zinc-400"
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase leading-tight">
                    Step 2
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      currentStep === 2 ? "text-black" : "text-zinc-500"
                    }`}
                  >
                    Shipping
                  </p>
                </div>
              </div>

              {/* Step 3: Payment */}
              <div
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 cursor-pointer z-10 bg-white pl-2"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    currentStep === 3
                      ? "bg-black text-white"
                      : "bg-[#EDEDED] text-zinc-400"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase leading-tight">
                    Step 3
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      currentStep === 3 ? "text-black" : "text-zinc-500"
                    }`}
                  >
                    Payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {createdOrder ? (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-black tracking-tight">
              Order Placed Successfully!
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              Dữ liệu đơn hàng đã được lưu an toàn vào cơ sở dữ liệu MongoDB Atlas.
            </p>

            {/* Order Details Card */}
            <div className="mt-6 p-5 rounded-xl bg-[#F6F6F6] text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                <span className="text-zinc-500 font-medium">Mã đơn hàng (Order Code):</span>
                <span className="font-mono font-bold text-black bg-white px-2.5 py-1 rounded border border-zinc-200">
                  {createdOrder.orderCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Người nhận:</span>
                <span className="font-semibold text-black">{createdOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Email khách hàng:</span>
                <span className="font-semibold text-black">{createdOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tổng sản phẩm (totalItems):</span>
                <span className="font-bold text-black">{createdOrder.totalItems || items.length} món</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Địa chỉ giao hàng:</span>
                <span className="font-semibold text-black">
                  {createdOrder.shippingAddress?.street}, {createdOrder.shippingAddress?.district},{" "}
                  {createdOrder.shippingAddress?.city}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm">
                <span className="font-bold text-black">Tổng thanh toán:</span>
                <span className="font-bold text-black text-base">
                  {formatVND(createdOrder.totalAmount)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3.5 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-md"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div>
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h4 className="text-lg font-bold text-black">Select Address</h4>
                  <p className="text-xs text-zinc-400">
                    Nhập thông tin giao hàng để lưu vào đơn hàng MongoDB Atlas
                  </p>
                </div>

                {!user && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                    <span className="text-amber-800 font-medium">
                      Bạn chưa đăng nhập. Vui lòng đăng nhập để tiến hành đặt hàng!
                    </span>
                    <button
                      onClick={onOpenAuth}
                      className="px-3 py-1.5 rounded-md bg-amber-700 text-white font-semibold hover:bg-amber-800 transition-colors"
                    >
                      Đăng nhập ngay
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-black block mb-1">
                      Địa chỉ đường / số nhà *
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="123 Nguyễn Huệ"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D9D9D9] outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-black block mb-1">
                        Quận / Huyện *
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Quận 1"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D9D9D9] outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-black block mb-1">
                        Tỉnh / Thành phố *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Hồ Chí Minh"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D9D9D9] outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-black block mb-1">
                      Ghi chú đơn hàng (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Giao giờ hành chính, gọi trước khi đến..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D9D9D9] outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EBEBEB] flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!street || !district || !city}
                    className="px-8 py-3 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h4 className="text-lg font-bold text-black">Shipment Method</h4>
                  <p className="text-xs text-zinc-400">Chọn phương thức vận chuyển phù hợp</p>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod("standard")}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === "standard"
                        ? "border-black bg-[#F6F6F6]"
                        : "border-[#EBEBEB] hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          shippingMethod === "standard"
                            ? "border-black bg-black"
                            : "border-zinc-400"
                        }`}
                      >
                        {shippingMethod === "standard" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-black">Standard Delivery</p>
                        <p className="text-[11px] text-zinc-400">Giao hàng tiêu chuẩn 2-3 ngày</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-black">{formatVND(30000)}</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod("express")}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === "express"
                        ? "border-black bg-[#F6F6F6]"
                        : "border-[#EBEBEB] hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          shippingMethod === "express"
                            ? "border-black bg-black"
                            : "border-zinc-400"
                        }`}
                      >
                        {shippingMethod === "express" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-black">Express Fast Delivery</p>
                        <p className="text-[11px] text-zinc-400">Giao hỏa tốc trong 24 giờ</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-black">{formatVND(60000)}</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#EBEBEB] flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 rounded-lg border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center gap-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment & Summary */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h4 className="text-lg font-bold text-black">Payment & Confirm</h4>
                  <p className="text-xs text-zinc-400">
                    Xác nhận đơn hàng và gửi dữ liệu lên Order Service (MongoDB Atlas)
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Payment Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      paymentMethod === "cod"
                        ? "border-black bg-[#F6F6F6]"
                        : "border-[#EBEBEB] hover:border-zinc-300"
                    }`}
                  >
                    <p className="text-xs font-bold text-black">COD</p>
                    <p className="text-[11px] text-zinc-400">Thanh toán khi nhận hàng</p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("credit")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      paymentMethod === "credit"
                        ? "border-black bg-[#F6F6F6]"
                        : "border-[#EBEBEB] hover:border-zinc-300"
                    }`}
                  >
                    <p className="text-xs font-bold text-black">Credit Card</p>
                    <p className="text-[11px] text-zinc-400">Thẻ Visa / MasterCard</p>
                  </button>
                </div>

                {/* Final Order Review Box */}
                <div className="p-4 rounded-xl bg-[#F6F6F6] space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Khách hàng:</span>
                    <span className="font-semibold text-black">{user?.name || "Chưa đăng nhập"}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Địa chỉ giao hàng:</span>
                    <span className="font-semibold text-black">
                      {street}, {district}, {city}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Số lượng:</span>
                    <span className="font-semibold text-black">{items.length} món</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm">
                    <span className="font-bold text-black">Tổng cộng:</span>
                    <span className="font-bold text-black text-base">{formatVND(totalAmount)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EBEBEB] flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 rounded-lg border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleConfirmOrder}
                    disabled={loading || !user}
                    className="px-8 py-3.5 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu MongoDB...</span>
                      </>
                    ) : (
                      <>
                        <span>Xác nhận đặt hàng</span>
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
