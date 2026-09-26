"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User as UserIcon, Loader2, CheckCircle2 } from "lucide-react";
import { loginUser, registerUser, setStoredToken, User } from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "login") {
        const res = await loginUser({ email, password });
        setStoredToken(res.accessToken, res.refreshToken);
        onLoginSuccess(res.user);
        onClose();
      } else {
        const res = await registerUser({ name, email, password });
        setStoredToken(res.accessToken, res.refreshToken);
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            {tab === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Xác thực qua Auth Service (JWT 15m & Refresh Token 7d)
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === "login"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === "register"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "register" && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                placeholder="sinhvien@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 outline-none text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{tab === "login" ? "Đăng nhập ngay" : "Tạo tài khoản"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
