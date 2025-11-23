export const API_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const;

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  SHIPPING: 'shipping',
} as const;

export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  RAZORPAY: 'razorpay',
  CASH_ON_DELIVERY: 'cash_on_delivery',
} as const;

export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_LANGUAGE = 'en';

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const CART_EXPIRY_HOURS = 30 * 24; // 30 days
export const TOKEN_EXPIRY_HOURS = 24;
export const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const RATE_LIMITS = {
  LOGIN: 5, // attempts per 15 minutes
  PASSWORD_RESET: 3, // requests per hour
  REGISTRATION: 3, // requests per hour
  API: 100, // requests per minute per user
} as const;

export const CACHE_TTL = {
  PRODUCTS: 300, // 5 minutes
  CATEGORIES: 3600, // 1 hour
  USER: 900, // 15 minutes
  SEARCH: 1800, // 30 minutes
} as const;