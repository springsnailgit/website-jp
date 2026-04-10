'use client';

import MainLayout from '@/components/layout/MainLayout';
import ProductCard, { Product as ProductCardType } from '@/components/products/ProductCard';
import { get } from '@/utils/api';
import { useEffect, useState } from 'react';

// 后端返回的产品数据类型
interface BackendProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    category: string;
    featured?: boolean;
    inStock: number;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ProductsApiResponse {
    success: boolean;
    data: BackendProduct[];
    meta?: {
        pagination: PaginationInfo;
    };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<BackendProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('全部');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [sortBy, setSortBy] = useState('createdAt');

    const categories = ['全部', '耳环', '戒指', '手链手镯', '项链', '胸针', '套装'];
    const sortOptions = [
        { value: 'createdAt', label: '最新' },
        { value: 'price_asc', label: '价格从低到高' },
        { value: 'price_desc', label: '价格从高到低' },
        { value: 'name_asc', label: '名称A-Z' },
        { value: 'rating_desc', label: '评分最高' }
    ];

    // 将后端产品数据转换为前端组件期望的格式
    const transformProduct = (backendProduct: BackendProduct): ProductCardType => {
        return {
            id: backendProduct._id,
            name: backendProduct.name,
            description: backendProduct.description,
            price: backendProduct.price,
            imageUrl: backendProduct.imageUrls[0] || '/images/placeholder.jpg',
            category: backendProduct.category
        };
    };

    // 获取产品数据
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (activeCategory !== '全部') {
                params.append('category', activeCategory);
            }
            if (searchTerm) {
                params.append('search', searchTerm);
            }
            params.append('page', currentPage.toString());
            params.append('limit', '12');
            params.append('sort', sortBy);

            const response = await get<ProductsApiResponse>(`/api/products?${params.toString()}`);

            if (response.success && response.data && Array.isArray(response.data)) {
                setProducts(response.data as BackendProduct[]);
                if (response.meta?.pagination) {
                    setPagination(response.meta.pagination);
                }
            } else {
                setError('获取产品失败');
            }
        } catch (err: any) {
            setError(err.message || '获取产品失败');
            console.error('获取产品错误:', err);
        } finally {
            setLoading(false);
        }
    };

    // 监听筛选条件变化
    useEffect(() => {
        setCurrentPage(1); // 重置页码
    }, [activeCategory, searchTerm, sortBy]);

    // 获取产品数据
    useEffect(() => {
        fetchProducts();
    }, [activeCategory, searchTerm, currentPage, sortBy]);

    // 处理页码变化
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 渲染分页组件
    const renderPagination = () => {
        if (!pagination || pagination.totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-2 text-sm border rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    上一页
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm border rounded-sm ${page === pagination.currentPage
                            ? 'bg-primary text-white border-primary'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-2 text-sm border rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    下一页
                </button>
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-10">
                <h1 className="jp-divider text-4xl font-medium text-center mb-10">产品展示</h1>

                {/* 搜索和筛选 */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-10 space-y-4 lg:space-y-0 gap-4">
                    {/* 类别筛选 */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 text-sm rounded-sm transition-colors ${activeCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* 排序选择 */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* 搜索框 */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="搜索产品..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 结果统计 */}
                {pagination && (
                    <div className="mb-6 text-sm text-gray-600">
                        共找到 {pagination.totalItems} 个产品，第 {pagination.currentPage} 页，共 {pagination.totalPages} 页
                    </div>
                )}

                {/* 加载状态 */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* 错误状态 */}
                {error && (
                    <div className="text-center py-20">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="btn btn-primary"
                        >
                            重试
                        </button>
                    </div>
                )}

                {/* 产品网格 */}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={transformProduct(product)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-gray-500 text-lg">暂无产品</p>
                                    <p className="text-gray-400 text-sm mt-2">请尝试调整筛选条件</p>
                                </div>
                            )}
                        </div>

                        {/* 分页 */}
                        {renderPagination()}
                    </>
                )}
            </div>
        </MainLayout>
    );
}
