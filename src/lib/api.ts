// src/lib/api.ts

export const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ||
  "https://gateway-service-production-69d0.up.railway.app";

// ─── Local Storage Helper ────────────────────────
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const setStoredToken = (token: string, refreshToken?: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", token);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
};

export const clearStoredTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_info");
};

// ─── Types ───────────────────────────────────────
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: string | number;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  categoryId?: number;
  category?: Category;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  fromCache?: boolean;
}

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal?: number;
}

export interface Order {
  _id: string;
  orderCode: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  totalItems?: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    district: string;
  };
  createdAt: string;
}

// ─── API Client Methods ──────────────────────────

// 1. Lấy danh sách sản phẩm
export async function fetchProducts(
  page = 1,
  limit = 8,
  search = ""
): Promise<ProductsResponse> {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) query.append("search", search);

  const res = await fetch(`${GATEWAY_URL}/api/products?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Lỗi lấy danh sách sản phẩm: ${res.statusText}`);
  }
  return res.json();
}

// 2. Upload ảnh sản phẩm lên Cloudinary
export async function uploadProductImage(
  productId: number,
  file: File
): Promise<{ success: boolean; imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${GATEWAY_URL}/api/products/${productId}/image`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Tải ảnh lên Cloudinary thất bại");
  }
  return data;
}

// 3. Đăng ký tài khoản
export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; accessToken: string; refreshToken: string; user: User }> {
  const res = await fetch(`${GATEWAY_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Đăng ký không thành công");
  }
  return data;
}

// 4. Đăng nhập
export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<{ success: boolean; accessToken: string; refreshToken: string; user: User }> {
  const res = await fetch(`${GATEWAY_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Email hoặc mật khẩu không chính xác");
  }
  return data;
}

// 5. Lấy profile
export async function fetchProfile(token: string): Promise<{ success: boolean; user: User }> {
  const res = await fetch(`${GATEWAY_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Phiên đăng nhập hết hạn");
  }
  return data;
}

// 6. Tạo đơn hàng (Cần Bearer Token)
export async function createOrder(
  token: string,
  payload: {
    customerId: number;
    customerName: string;
    customerEmail: string;
    items: { productId: number; productName: string; price: number; quantity: number }[];
    shippingAddress: { street: string; city: string; district: string };
    note?: string;
  }
): Promise<{ success: boolean; data: Order; message: string }> {
  const res = await fetch(`${GATEWAY_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Tạo đơn hàng thất bại");
  }
  return data;
}

// 7. Lấy danh sách đơn hàng (Cần Bearer Token)
export async function fetchOrders(
  token: string,
  page = 1,
  limit = 10
): Promise<{ success: boolean; data: Order[] }> {
  const res = await fetch(`${GATEWAY_URL}/api/orders?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Lấy đơn hàng thất bại");
  }
  return data;
}
