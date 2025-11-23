export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'superadmin';
  addresses: Address[];
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  brand: string;
  category: string | Category;
  subcategory?: string | Category;
  images: ProductImage[];
  variants: ProductVariant[];
  basePrice: number;
  compareAtPrice?: number;
  costPrice: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  status: 'active' | 'draft' | 'archived';
  inventory: {
    trackQuantity: boolean;
    quantity: number;
    allowBackorder: boolean;
    lowStockThreshold: number;
  };
  shipping: {
    requiresShipping: boolean;
    weight?: number;
    freeShippingThreshold?: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  name: string;
  value: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  sku: string;
  image?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string | Category;
  isActive: boolean;
  sortOrder: number;
  seo: {
    title: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: string | User;
  items: OrderItem[];
  pricing: OrderPricing;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentIntent?: string;
  shippingAddress: Address;
  billingAddress: Address;
  tracking?: {
    carrier: string;
    trackingNumber: string;
    trackingUrl: string;
    updates: TrackingUpdate[];
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: string | Product;
  variant?: string;
  quantity: number;
  price: number;
  total: number;
  name: string;
  image: string;
}

export interface OrderPricing {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

export interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: Date;
  message: string;
}

export interface Cart {
  _id: string;
  user?: string;
  items: CartItem[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: string | Product;
  variant?: string;
  quantity: number;
  addedAt: Date;
}

export interface Review {
  _id: string;
  product: string | Product;
  user: string | User;
  rating: number;
  title?: string;
  content: string;
  images: string[];
  helpful: number;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  userLimit?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  brands: string[];
  ratings: number[];
  inStock: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface Wishlist {
  _id: string;
  user: string;
  items: string[];
  createdAt: Date;
  updatedAt: Date;
}