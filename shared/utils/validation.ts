export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
export const zipCodeRegex = /^[A-Za-z0-9\s\-]+$/;

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return passwordRegex.test(password);
};

export const validatePhone = (phone: string): boolean => {
  return phoneRegex.test(phone);
};

export const validateZipCode = (zipCode: string): boolean => {
  return zipCodeRegex.test(zipCode);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};

export const validateMaxLength = (value: string, max: number): boolean => {
  return value.trim().length <= max;
};

export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const validatePositiveNumber = (value: number): boolean => {
  return value > 0;
};

export const validateNonNegativeNumber = (value: number): boolean => {
  return value >= 0;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

export const generateSku = (productName: string, variant?: string): string => {
  const namePart = productName
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .substr(0, 6);
  const randomPart = Math.random().toString(36).substr(2, 4).toUpperCase();
  const variantPart = variant ? `-${variant.substr(0, 2).toUpperCase()}` : '';
  return `${namePart}${randomPart}${variantPart}`;
};