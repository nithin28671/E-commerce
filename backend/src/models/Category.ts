import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: mongoose.Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  getSubcategories(): Promise<ICategory[]>;
  getParent(): Promise<ICategory | null>;
  getProductsCount(): Promise<number>;
}

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

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Please provide a valid slug'],
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    trim: true,
    maxlength: [1000, 'Category description cannot exceed 1000 characters'],
  },
  image: {
    type: String,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  seo: {
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
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ createdAt: -1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
});

// Virtual for parent category
categorySchema.virtual('parentCategory', {
  ref: 'Category',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for products count
categorySchema.virtual('productsCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
  match: { status: 'active' },
});

// Pre-save middleware to generate slug if not provided
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Instance method to get subcategories
categorySchema.methods.getSubcategories = async function(): Promise<ICategory[]> {
  return await this.constructor
    .find({ parentId: this._id, isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

// Instance method to get parent category
categorySchema.methods.getParent = async function(): Promise<ICategory | null> {
  if (!this.parentId) return null;
  return await this.constructor.findById(this.parentId);
};

// Static method to get root categories
categorySchema.statics.getRootCategories = function() {
  return this.find({ parentId: null, isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('subcategories');
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate({
      path: 'subcategories',
      populate: {
        path: 'subcategories',
        model: 'Category',
      },
    });
};

export const Category = mongoose.model<ICategory>('Category', categorySchema);