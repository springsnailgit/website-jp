/**
 * 产品相关API服务
 */
import { del, get, post, put } from '@/utils/api';

// 产品接口定义
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  inStock: number;
  featured: boolean;
  rating: number;
  material?: string;
  dimensions?: string;
  weight?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating_desc' | 'created_desc' | 'created_asc';
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ProductStats {
  overview: {
    totalProducts: number;
    totalInStock: number;
    avgPrice: number;
    avgRating: number;
  };
  categories: Array<{
    category: string;
    count: number;
    avgPrice: number;
  }>;
}

/**
 * 产品服务类
 */
class ProductService {
  private readonly baseUrl = '/api/products';

  /**
   * 获取产品列表
   * @param query 查询参数
   * @returns Promise<ProductListResponse>
   */
  async getProducts(query: ProductQuery = {}): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    const response = await get<ProductListResponse>(url);
    return response.data || { products: [], pagination: {} as any };
  }

  /**
   * 获取单个产品详情
   * @param id 产品ID
   * @returns Promise<Product>
   */
  async getProduct(id: string): Promise<Product> {
    const response = await get<Product>(`${this.baseUrl}/${id}`);
    if (!response.data) {
      throw new Error('产品不存在');
    }
    return response.data;
  }

  /**
   * 获取精选产品
   * @param limit 数量限制
   * @returns Promise<Product[]>
   */
  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    const response = await this.getProducts({
      featured: true,
      limit,
      sort: 'created_desc'
    });
    return response.products;
  }

  /**
   * 搜索产品
   * @param searchTerm 搜索关键词
   * @param options 其他查询选项
   * @returns Promise<ProductListResponse>
   */
  async searchProducts(searchTerm: string, options: Omit<ProductQuery, 'search'> = {}): Promise<ProductListResponse> {
    return this.getProducts({
      ...options,
      search: searchTerm
    });
  }

  /**
   * 按类别获取产品
   * @param category 产品类别
   * @param options 其他查询选项
   * @returns Promise<ProductListResponse>
   */
  async getProductsByCategory(category: string, options: Omit<ProductQuery, 'category'> = {}): Promise<ProductListResponse> {
    return this.getProducts({
      ...options,
      category
    });
  }

  /**
   * 获取产品统计信息
   * @returns Promise<ProductStats>
   */
  async getProductStats(): Promise<ProductStats> {
    const response = await get<ProductStats>(`${this.baseUrl}/stats`);
    return response.data || { overview: {} as any, categories: [] };
  }

  /**
   * 创建产品（需要管理员权限）
   * @param productData 产品数据
   * @returns Promise<Product>
   */
  async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await post<Product>(this.baseUrl, productData, { withAuth: true });
    if (!response.data) {
      throw new Error('创建产品失败');
    }
    return response.data;
  }

  /**
   * 更新产品（需要管理员权限）
   * @param id 产品ID
   * @param productData 更新的产品数据
   * @returns Promise<Product>
   */
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await put<Product>(`${this.baseUrl}/${id}`, productData, { withAuth: true });
    if (!response.data) {
      throw new Error('更新产品失败');
    }
    return response.data;
  }

  /**
   * 删除产品（需要管理员权限）
   * @param id 产品ID
   * @returns Promise<void>
   */
  async deleteProduct(id: string): Promise<void> {
    await del(`${this.baseUrl}/${id}`, { withAuth: true });
  }

  /**
   * 获取相关产品推荐
   * @param productId 当前产品ID
   * @param limit 推荐数量
   * @returns Promise<Product[]>
   */
  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    try {
      // 先获取当前产品信息
      const currentProduct = await this.getProduct(productId);

      // 根据类别获取相关产品
      const response = await this.getProductsByCategory(currentProduct.category, {
        limit: limit + 1, // 多获取一个，以防包含当前产品
        sort: 'rating_desc'
      });

      // 过滤掉当前产品
      return response.products
        .filter(product => product._id !== productId)
        .slice(0, limit);
    } catch (error) {
      console.error('获取相关产品失败:', error);
      return [];
    }
  }

  /**
   * 获取产品类别列表
   * @returns Promise<string[]>
   */
  async getCategories(): Promise<string[]> {
    try {
      const stats = await this.getProductStats();
      return stats.categories.map(cat => cat.category);
    } catch (error) {
      console.error('获取产品类别失败:', error);
      return ['耳环', '项链', '手链手镯', '戒指', '胸针', '套装']; // 默认类别
    }
  }
}

// 导出单例实例
export const productService = new ProductService();
export default productService;
