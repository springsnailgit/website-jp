'use client';

import MainLayout from '@/components/layout/MainLayout';
import { API_BASE_URL } from '@/config';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductDetail {
    _id: string;
    name: string;
    description: string;
    longDescription?: string;
    price: number;
    discount?: number;
    imageUrls: string[];
    category: string;
    featured: boolean;
    inStock: number;
    material?: string;
    technique?: string;
    dimensions?: string;
    weight?: string;
    tags?: string[];
    rating?: number;
    reviewCount?: number;
}

const getFullImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
);

export default function ProductDetailClient() {
    const params = useParams();
    const id = params?.id as string;

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [related, setRelated] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImg, setActiveImg] = useState(0);
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!id || id === '__shell') return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.error || '产品不存在');
                setProduct(data.data);
                const relRes = await fetch(`${API_BASE_URL}/api/products?category=${data.data.category}&limit=4`);
                const relData = await relRes.json();
                if (relData.success) {
                    setRelated(relData.data.filter((p: ProductDetail) => p._id !== id).slice(0, 4));
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : '产品不存在');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-400">加载中...</p>
                </div>
            </div>
        </MainLayout>
    );

    if (error || !product) return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">{error || '产品不存在'}</p>
                    <Link href="/products" className="text-accent text-sm hover:underline">返回产品列表</Link>
                </div>
            </div>
        </MainLayout>
    );

    const finalPrice = product.discount && product.discount < product.price ? product.discount : product.price;
    const hasDiscount = product.discount && product.discount < product.price;

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-24 mt-8">
                <nav className="mb-8 text-sm text-gray-400 flex items-center gap-2">
                    <Link href="/" className="hover:text-accent transition-colors">首页</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-accent transition-colors">产品展示</Link>
                    <span>/</span>
                    <Link href={`/products?category=${product.category}`} className="hover:text-accent transition-colors">{product.category}</Link>
                    <span>/</span>
                    <span className="text-gray-600 truncate max-w-40">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    <div>
                        <div className="aspect-square relative overflow-hidden rounded-sm bg-stone-100 mb-3">
                            {product.imageUrls[activeImg] && !imgErrors[activeImg] ? (
                                <Image
                                    src={getFullImageUrl(product.imageUrls[activeImg]) || ''}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    onError={() => setImgErrors(prev => ({ ...prev, [activeImg]: true }))}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-300 text-6xl">✿</div>
                            )}
                            {product.featured && (
                                <span className="absolute top-4 left-4 bg-accent text-white text-xs px-3 py-1 tracking-wide">精选</span>
                            )}
                        </div>
                        {product.imageUrls.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.imageUrls.map((url, i) => (
                                    <button key={i} onClick={() => setActiveImg(i)}
                                        className={`aspect-square relative overflow-hidden rounded-sm bg-stone-100 border-2 transition-colors ${activeImg === i ? 'border-accent' : 'border-transparent hover:border-gray-300'}`}>
                                        {url && !imgErrors[i] ? (
                                            <Image src={getFullImageUrl(url) || ''} alt={`${product.name} ${i + 1}`} fill className="object-cover"
                                                onError={() => setImgErrors(prev => ({ ...prev, [i]: true }))} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-300">✿</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">{product.category}</p>
                        <h1 className="text-3xl font-light text-gray-800 mb-3">{product.name}</h1>

                        {product.rating !== undefined && product.rating > 0 && (
                            <div className="flex items-center gap-3 mb-4">
                                <StarRating rating={product.rating} />
                                <span className="text-xs text-gray-400">({product.reviewCount || 0} 条评价)</span>
                            </div>
                        )}

                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-light text-accent">¥{finalPrice.toLocaleString()}</span>
                            {hasDiscount && (
                                <span className="text-lg text-gray-400 line-through">¥{product.price.toLocaleString()}</span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
                        {product.longDescription && (
                            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line mb-6">{product.longDescription}</p>
                        )}

                        <div className="border-t border-b border-gray-100 py-5 mb-6 space-y-3">
                            {[
                                { label: '材质', value: product.material },
                                { label: '制作工艺', value: product.technique },
                                { label: '尺寸', value: product.dimensions },
                                { label: '重量', value: product.weight },
                                { label: '库存', value: product.inStock > 0 ? `现货 ${product.inStock} 件` : '暂时缺货' },
                            ].filter(r => r.value).map(r => (
                                <div key={r.label} className="flex text-sm">
                                    <span className="w-28 text-gray-400 flex-shrink-0">{r.label}</span>
                                    <span className={`text-gray-700 ${r.label === '库存' && product.inStock === 0 ? 'text-red-400' : ''}`}>{r.value}</span>
                                </div>
                            ))}
                        </div>

                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {product.tags.map(tag => (
                                    <span key={tag} className="text-xs px-3 py-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-sm">#{tag}</span>
                                ))}
                            </div>
                        )}

                        <div className="space-y-3 mt-auto">
                            <Link href="/contact" className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-white py-3.5 text-sm font-medium tracking-widest transition-colors rounded-sm">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                咨询定制
                            </Link>
                            <Link href="/contact" className="flex items-center justify-center w-full border border-gray-300 text-gray-700 hover:border-accent hover:text-accent py-3.5 text-sm font-medium tracking-wide transition-colors rounded-sm">
                                联系我们
                            </Link>
                        </div>
                    </div>
                </div>

                {related.length > 0 && (
                    <div>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-light text-gray-800">同系列作品</h2>
                            <div className="w-10 h-px bg-accent mx-auto mt-3" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {related.map(rp => {
                                const rpImg = getFullImageUrl(rp.imageUrls?.[0]);
                                return (
                                    <Link key={rp._id} href={`/products/${rp._id}`} className="group block">
                                        <div className="aspect-square relative overflow-hidden rounded-sm bg-stone-100 mb-3">
                                            {rpImg ? (
                                                <Image src={rpImg} alt={rp.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300 text-3xl">✿</div>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-accent transition-colors">{rp.name}</p>
                                        <p className="text-sm text-accent mt-0.5">¥{rp.price.toLocaleString()}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
