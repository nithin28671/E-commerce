import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant extends Document {
  name: string;
  value: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  sku: string;
  image?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  brand: string;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  images: {
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  variants: IVariant[];
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

  // Instance methods
  getPrimaryImage(): string;
  getTotalInventory(): number;
  getLowestPrice(): number;
  updateRatings(): Promise<void>;
  isInStock(): boolean;
  hasVariants(): boolean;
}

const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
    trim: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const variantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
  },
  inventory: {
    type: Number,
    required: true,
    min: [0, 'Inventory cannot be negative'],
  },
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
}, { _id: false });

const seoSchema = new Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title cannot exceed 60 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description cannot exceed 160 characters'],
  },
  keywords: [{
    type: String,
    trim: true,
  }],
}, { _id: false });

const inventorySchema = new Schema({
  trackQuantity: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative'],
  },
  allowBackorder: {
    type: Boolean,
    default: false,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative'],
  },
}, { _id: false });

const shippingSchema = new Schema({
  requiresShipping: {
    type: Boolean,
    default: true,
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
  },
  freeShippingThreshold: {
    type: Number,
    min: [0, 'Free shipping threshold cannot be negative'],
  },
}, { _id: false });

const ratingsSchema = new Schema({
  average: {
    type: Number,
    default: 0,
    min: [0, 'Average rating cannot be negative'],
    max: [5, 'Average rating cannot exceed 5'],
  },
  count: {
    type: Number,
    default: 0,
    min: [0, 'Rating count cannot be negative'],
  },
}, { _id: false });

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Please provide a valid slug'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters'],
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    maxlength: [100, 'Brand cannot exceed 100 characters'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  images: [imageSchema],
  variants: [variantSchema],
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Base price cannot be negative'],
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
  },
  costPrice: {
    type: Number,
    required: [true, 'Cost price is required'],
    min: [0, 'Cost price cannot be negative'],
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
  },
  dimensions: {
    length: {
      type: Number,
      min: [0, 'Length cannot be negative'],
    },
    width: {
      type: Number,
      min: [0, 'Width cannot be negative'],
    },
    height: {
      type: Number,
      min: [0, 'Height cannot be negative'],
    },
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  seo: seoSchema,
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'draft',
  },
  inventory: inventorySchema,
  shipping: shippingSchema,
  ratings: ratingsSchema,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ status: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

// Pre-save middleware to generate slug if not provided
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Ensure at least one primary image
  if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }

  next();
});

// Instance method to get primary image
productSchema.methods.getPrimaryImage = function(): string {
  const primaryImage = this.images.find(img => img.isPrimary);
  return primaryImage ? primaryImage.url : (this.images[0]?.url || '');
};

// Instance method to get total inventory
productSchema.methods.getTotalInventory = function(): number {
  if (this.variants.length > 0) {
    return this.variants.reduce((total, variant) => total + variant.inventory, 0);
  }
  return this.inventory.quantity;
};

// Instance method to get lowest price
productSchema.methods.getLowestPrice = function(): number {
  if (this.variants.length > 0) {
    return Math.min(...this.variants.map(v => v.price));
  }
  return this.basePrice;
};

// Instance method to update ratings
productSchema.methods.updateRatings = async function(): Promise<void> {
  const Review = mongoose.model('Review');
  const result = await Review.aggregate([
    { $match: { product: this._id, status: 'approved' } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    this.ratings.average = Math.round(result[0].averageRating * 10) / 10;
    this.ratings.count = result[0].ratingCount;
  } else {
    this.ratings.average = 0;
    this.ratings.count = 0;
  }

  await this.save();
};

// Instance method to check if in stock
productSchema.methods.isInStock = function(): boolean {
  if (this.variants.length > 0) {
    return this.variants.some(variant => variant.inventory > 0) || this.variants.some(variant =>
      variant.inventory === 0 && this.inventory.allowBackorder
    );
  }
  return this.inventory.quantity > 0 || this.inventory.allowBackorder;
};

// Instance method to check if has variants
productSchema.methods.hasVariants = function(): boolean {
  return this.variants.length > 0;
};

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ 'ratings.average': -1, createdAt: -1 })
    .limit(limit)
    .populate('category', 'name slug');
};

// Static method to search products
productSchema.statics.searchProducts = function(query: string, filters: any = {}) {
  const searchFilters: any = { status: 'active' };

  if (query) {
    searchFilters.$text = { $search: query };
  }

  if (filters.category) {
    searchFilters.category = filters.category;
  }

  if (filters.minPrice || filters.maxPrice) {
    searchFilters.basePrice = {};
    if (filters.minPrice) searchFilters.basePrice.$gte = filters.minPrice;
    if (filters.maxPrice) searchFilters.basePrice.$lte = filters.maxPrice;
  }

  if (filters.brand) {
    searchFilters.brand = new RegExp(filters.brand, 'i');
  }

  if (filters.tags && filters.tags.length > 0) {
    searchFilters.tags = { $in: filters.tags };
  }

  return this.find(searchFilters)
    .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
    .populate('category', 'name slug');
};

export const Product = mongoose.model<IProduct>('Product', productSchema);