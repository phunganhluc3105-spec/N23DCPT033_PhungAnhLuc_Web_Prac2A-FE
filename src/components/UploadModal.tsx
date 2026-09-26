"use client";

import React, { useState } from "react";
import { X, Upload, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { Product, uploadProductImage } from "@/lib/api";

interface UploadModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (productId: number, imageUrl: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  product,
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Vui lòng chọn 1 tệp ảnh!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await uploadProductImage(product.id, file);
      onUploadSuccess(product.id, res.imageUrl);
      onClose();
    } catch (err: any) {
      setError(err.message || "Tải ảnh lên Cloudinary thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
            Upload ảnh sản phẩm
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Lưu trữ trực tiếp lên Cloudinary CDN cho <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{product.name}"</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer relative bg-zinc-50 dark:bg-zinc-800/40">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {preview ? (
              <div className="space-y-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl mx-auto border border-zinc-200 dark:border-zinc-700 shadow-sm"
                />
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium block">
                  Bấm để chọn ảnh khác
                </span>
              </div>
            ) : (
              <div className="space-y-2 text-zinc-400">
                <ImageIcon className="w-10 h-10 mx-auto text-zinc-400 stroke-1" />
                <div className="text-xs">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    Bấm để chọn file
                  </span>{" "}
                  hoặc kéo thả vào đây
                </div>
                <p className="text-[11px] text-zinc-500">PNG, JPG, WEBP tối đa 5MB</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? "Đang tải lên Cloudinary..." : "Tải ảnh lên ngay"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
