export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: Category;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  orderDate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}
