'use client';

import { API_BASE_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  inStock: number;
  featured: boolean;
  imageUrls: string[];
  rating?: number;
  createdAt: string;
}

const CATEGORIES = ['全部', '耳环', '戒指', '手链手镯', '项链', '胸针', '套装'];

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [category, setCategory] = useState('全部');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (category !== '全部') params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`${API_BASE_URL}/api/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.meta?.pagination?.totalPages || 1);
        setTotalItems(data.meta?.pagination?.totalItems || 0);
      }
    } catch { /* 静默 */ }
    finally { setLoading(false); }
  };

  useEffect(() => { setPage(1); }, [category, search]);
  useEffect(() => { if (token) fetchProducts(); }, [token, category, search, page]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setTotalItems(n => n - 1);
      }
    } catch { /* 静默 */ }
    finally { setDeleting(null); setConfirmId(null); }
  };

  const getImgSrc = (urls: string[]) => {
    if (!urls?.length) return null;
    const u = urls[0];
    return u.startsWith('http') ? u : `${API_BASE_URL}${u}`;
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-800">产品管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">共 {totalItems} 件产品</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 text-sm rounded-sm transition-colors">
          <span className="text-base leading-none">+</span>
          新增产品
        </Link>
      </div>

      {/* 搜索筛选 */}
      <div className="bg-white border border-gray-100 rounded-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="搜索产品名称..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-accent" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${category === c ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 产品表格 */}
      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-100 rounded-sm flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm mb-3">暂无产品</p>
            <Link href="/admin/products/new" className="text-accent text-sm hover:underline">+ 添加第一件产品</Link>
          </div>
        ) : (
          <>
            {/* 表头 */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-medium">
              <div className="col-span-5">产品</div>
              <div className="col-span-2">品类</div>
              <div className="col-span-1 text-right">价格</div>
              <div className="col-span-1 text-right">库存</div>
              <div className="col-span-1 text-center">精选</div>
              <div className="col-span-2 text-right">操作</div>
            </div>

            {/* 表格行 */}
            <div className="divide-y divide-gray-50">
              {products.map(p => {
                const img = getImgSrc(p.imageUrls);
                return (
                  <div key={p._id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors">
                    {/* 产品信息 */}
                    <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-sm bg-stone-100 overflow-hidden relative flex-shrink-0">
                        {img ? (
                          <Image src={img} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300 text-lg">✿</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('zh-CN')}</p>
                      </div>
                    </div>
                    {/* 品类 */}
                    <div className="col-span-4 md:col-span-2">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-sm">{p.category}</span>
                    </div>
                    {/* 价格 */}
                    <div className="col-span-3 md:col-span-1 text-right">
                      <span className="text-sm text-gray-700">¥{p.price.toLocaleString()}</span>
                    </div>
                    {/* 库存 */}
                    <div className="col-span-2 md:col-span-1 text-right">
                      <span className={`text-sm ${p.inStock === 0 ? 'text-red-400' : p.inStock < 5 ? 'text-amber-500' : 'text-gray-600'}`}>
                        {p.inStock}
                      </span>
                    </div>
                    {/* 精选 */}
                    <div className="col-span-1 text-center hidden md:block">
                      {p.featured
                        ? <span className="text-accent text-sm">✓</span>
                        : <span className="text-gray-200 text-sm">—</span>}
                    </div>
                    {/* 操作 */}
                    <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${p._id}/edit`}
                        className="text-xs text-gray-500 hover:text-accent border border-gray-200 hover:border-accent px-2.5 py-1 rounded-sm transition-colors">
                        编辑
                      </Link>
                      <button
                        onClick={() => setConfirmId(p._id)}
                        disabled={deleting === p._id}
                        className="text-xs text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-2.5 py-1 rounded-sm transition-colors disabled:opacity-40">
                        {deleting === p._id ? '...' : '删除'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">第 {page} / {totalPages} 页</p>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
                    上一页
                  </button>
                  <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-6 shadow-xl w-80 mx-4">
            <h3 className="text-base font-medium text-gray-800 mb-2">确认删除</h3>
            <p className="text-sm text-gray-500 mb-6">此操作不可恢复，确定要删除该产品吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)}
                className="flex-1 py-2 border border-gray-200 text-sm text-gray-600 rounded-sm hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button onClick={() => handleDelete(confirmId)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-sm transition-colors">
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
