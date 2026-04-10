'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';

/**
 * 产品数据接口
 */
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
}

interface ProductCardProps {
    product: Product;
}

// 通用的模糊图像占位符
const BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI3QlWejAAAAABJRU5ErkJggg==';

/**
 * 产品图片组件 - 处理图片加载和错误
 */
const ProductImage = memo(({ imageUrl, name }: { imageUrl: string; name: string }) => {
    const [imgError, setImgError] = useState(false);

    if (!imageUrl || imgError) {
        return (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">暂无图片</span>
            </div>
        );
    }

    return (
        <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            onError={() => setImgError(true)}
        />
    );
});

ProductImage.displayName = 'ProductImage';

/**
 * 产品卡片组件 - 用于在网格中展示单个产品
 * 使用memo优化渲染性能
 */
const ProductCard = memo(({ product }: ProductCardProps) => {
    const { id, name, description, price, imageUrl } = product;

    return (
        <Link href={`/products/${id}`} className="block group">
            <div className="product-card overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* 产品图片容器 */}
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <ProductImage imageUrl={imageUrl} name={name} />
                </div>

                {/* 产品信息 */}
                <div className="p-4">
                    <h3 className="text-lg font-medium line-clamp-1">{name}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-accent font-medium">¥{price.toLocaleString()}</span>
                        <span className="text-sm text-white bg-primary px-3 py-1 rounded-sm group-hover:bg-primary-600 transition-colors">
                            查看详情
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
