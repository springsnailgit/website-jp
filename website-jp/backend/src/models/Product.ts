import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  longDescription?: string;  // 详细描述
  price: number;
  discount?: number;        // 折扣价格
  imageUrls: string[];
  category: string;
  subCategory?: string;
  featured: boolean;
  inStock: number;          // 库存数量
  material?: string;        // 材质
  technique?: string;       // 工艺
  dimensions?: string;      // 尺寸
  weight?: string;          // 重量
  tags?: string[];          // 标签
  rating?: number;          // 评分
  reviewCount?: number;     // 评价数量
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '请提供产品名称'],
      trim: true,
      maxlength: [100, '产品名称不能超过100个字符']
    },
    description: {
      type: String,
      required: [true, '请提供产品描述'],
      maxlength: [500, '产品描述不能超过500个字符']
    },
    longDescription: {
      type: String,
      maxlength: [2000, '详细描述不能超过2000个字符']
    },
    price: {
      type: Number,
      required: [true, '请提供产品价格'],
      min: [0, '价格不能为负']
    },
    discount: {
      type: Number,
      min: [0, '折扣价格不能为负']
    },
    imageUrls: {
      type: [String],
      required: [true, '请提供至少一张产品图片'],
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: '至少提供一张产品图片'
      }
    },
    category: {
      type: String,
      required: [true, '请提供产品类别'],
      enum: ['耳环', '戒指', '手链手镯', '项链', '胸针', '套装'],
    },
    subCategory: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Number,
      required: [true, '请提供库存数量'],
      default: 0,
      min: [0, '库存不能为负']
    },
    material: {
      type: String,
      maxlength: [50, '材质描述不能超过50个字符']
    },
    technique: {
      type: String,
      maxlength: [50, '工艺描述不能超过50个字符']
    },
    dimensions: {
      type: String,
      maxlength: [50, '尺寸描述不能超过50个字符']
    },
    weight: {
      type: String,
      maxlength: [20, '重量描述不能超过20个字符']
    },
    tags: {
      type: [String]
    },
    rating: {
      type: Number,
      min: [0, '评分不能低于0'],
      max: [5, '评分不能高于5'],
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, '评价数量不能为负']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 添加虚拟属性：最终价格（考虑折扣）
ProductSchema.virtual('finalPrice').get(function() {
  if (this.discount && this.discount < this.price) {
    return this.discount;
  }
  return this.price;
});

// 添加文本索引以便于搜索
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// 添加索引优化查询性能
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ createdAt: -1 }); // 按创建时间倒序

export default mongoose.model<IProduct>('Product', ProductSchema);
