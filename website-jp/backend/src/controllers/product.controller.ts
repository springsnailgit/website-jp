import { Request, Response } from 'express';
import Product from '../models/Product';
import { APIError, asyncHandler, successResponse } from '../utils/errorHandler';

interface ProductQuery {
  category?: string;
  featured?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  search?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * 构建产品查询过滤器
 * @param queryParams 请求查询参数
 * @returns 过滤器对象
 */
const buildProductFilter = (queryParams: ProductQuery) => {
  const filter: any = {};

  // 类别筛选
  if (queryParams.category && queryParams.category !== '全部') {
    filter.category = queryParams.category;
  }

  // 精选产品筛选
  if (queryParams.featured === 'true') {
    filter.featured = true;
  }

  // 价格范围筛选
  const minPrice = queryParams.minPrice ? Number(queryParams.minPrice) : null;
  const maxPrice = queryParams.maxPrice ? Number(queryParams.maxPrice) : null;

  if (minPrice !== null || maxPrice !== null) {
    filter.price = {};
    if (minPrice !== null && !isNaN(minPrice)) {
      filter.price.$gte = minPrice;
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      filter.price.$lte = maxPrice;
    }
  }

  // 库存筛选
  if (queryParams.inStock === 'true') {
    filter.inStock = { $gt: 0 };
  }

  // 文本搜索
  if (queryParams.search && queryParams.search.trim()) {
    filter.$text = { $search: queryParams.search.trim() };
  }

  return filter;
};

/**
 * 构建排序对象
 * @param sortParam 排序参数
 * @returns 排序对象
 */
const buildSortObject = (sortParam?: string) => {
  const sortOptions: Record<string, any> = {
    'price_asc': { price: 1 },
    'price_desc': { price: -1 },
    'name_asc': { name: 1 },
    'name_desc': { name: -1 },
    'rating_desc': { rating: -1 },
    'created_desc': { createdAt: -1 },
    'created_asc': { createdAt: 1 }
  };

  return sortOptions[sortParam || 'created_desc'] || { createdAt: -1 };
};

/**
 * 处理上传的图片文件
 * @param files 上传的文件数组
 * @returns 图片URL数组
 */
const processUploadedImages = (files: any): string[] => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return [];
  }

  return files.map((file: Express.Multer.File) => `/uploads/images/${file.filename}`);
};

/**
 * 计算分页信息
 * @param page 当前页码
 * @param limit 每页数量
 * @param total 总数量
 * @returns 分页元数据
 */
const calculatePagination = (page: number, limit: number, total: number): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// @desc    获取所有产品
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as ProductQuery;
  const filter = buildProductFilter(query);

  // 分页参数验证
  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || '12'))); // 限制最大50条
  const skip = (page - 1) * limit;

  // 排序参数
  const sort = buildSortObject(query.sort);

  // 执行查询
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v') // 排除版本字段
      .lean(),
    Product.countDocuments(filter)
  ]);

  // 计算分页信息
  const pagination = calculatePagination(page, limit, total);

  return res.status(200).json(
    successResponse(products, '获取产品成功', 200, { pagination })
  );
});

// @desc    获取单个产品
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // 验证ID格式
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new APIError('无效的产品ID格式', 400);
  }

  const product = await Product.findById(id)
    .select('-__v')
    .lean();

  if (!product) {
    throw new APIError('未找到产品', 404);
  }

  return res.status(200).json(successResponse(product, '获取产品成功'));
});

// @desc    创建新产品
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const imageUrls = processUploadedImages(req.files);

  // 验证必需字段
  const { name, description, price, category } = req.body;
  if (!name || !description || !price || !category) {
    throw new APIError('缺少必需字段：name, description, price, category', 400);
  }

  // 合并请求主体和图片URL
  const productData = {
    ...req.body,
    imageUrls: imageUrls.length > 0 ? imageUrls : (req.body.imageUrls || [])
  };

  // 验证图片URL
  if (!productData.imageUrls || productData.imageUrls.length === 0) {
    throw new APIError('至少需要一张产品图片', 400);
  }

  const product = await Product.create(productData);
  return res.status(201).json(successResponse(product, '产品创建成功', 201));
});

// @desc    更新产品
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // 验证ID格式
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new APIError('无效的产品ID格式', 400);
  }

  let productData = { ...req.body };
  const imageUrls = processUploadedImages(req.files);

  // 只有当上传了新图片时才更新imageUrls
  if (imageUrls.length > 0) {
    productData.imageUrls = imageUrls;
  }

  const product = await Product.findByIdAndUpdate(
    id,
    productData,
    {
      new: true,
      runValidators: true,
      select: '-__v'
    }
  );

  if (!product) {
    throw new APIError('未找到产品', 404);
  }

  return res.status(200).json(successResponse(product, '产品更新成功'));
});

// @desc    删除产品
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // 验证ID格式
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new APIError('无效的产品ID格式', 400);
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new APIError('未找到产品', 404);
  }

  return res.status(200).json(successResponse(null, '产品删除成功'));
});

// @desc    获取产品统计信息
// @route   GET /api/products/stats
// @access  Public
export const getProductStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalInStock: { $sum: '$inStock' },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$rating' }
      }
    },
    {
      $project: {
        _id: 0,
        totalProducts: 1,
        totalInStock: 1,
        avgPrice: { $round: ['$avgPrice', 2] },
        avgRating: { $round: ['$avgRating', 1] }
      }
    }
  ]);

  const categoryStats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }
    },
    {
      $project: {
        category: '$_id',
        count: 1,
        avgPrice: { $round: ['$avgPrice', 2] },
        _id: 0
      }
    },
    { $sort: { count: -1 } }
  ]);

  return res.status(200).json(
    successResponse({
      overview: stats[0] || {
        totalProducts: 0,
        totalInStock: 0,
        avgPrice: 0,
        avgRating: 0
      },
      categories: categoryStats
    }, '获取产品统计成功')
  );
});
