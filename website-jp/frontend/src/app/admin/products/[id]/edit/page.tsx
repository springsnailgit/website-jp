'use client';

export const dynamic = 'force-static';

import ProductForm from '@/components/admin/ProductForm';
import { API_BASE_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { token } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || '产品不存在');
        setProduct(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetch_();
  }, [params.id, token]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-medium text-gray-800">编辑产品</h1>
          <p className="text-sm text-gray-400 mt-0.5 truncate max-w-xs">{product?.name || '加载中...'}</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-12 justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">加载产品信息...</span>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && product && (
        <ProductForm mode="edit" initialData={product} />
      )}
    </div>
  );
}
