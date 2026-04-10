import ProductDetailClient from './ProductDetailClient';

interface Product {
    _id: string;
}

export async function generateStaticParams() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';
        const res = await fetch(`${apiUrl}/api/products?limit=1000`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
            return data.data.map((p: Product) => ({ id: p._id }));
        }
    } catch {
        // API 不可用时构建仍继续，由 _redirects fallback 兜底
    }
    return [{ id: '__shell' }];
}

export default function ProductDetailPage() {
    return <ProductDetailClient />;
}
