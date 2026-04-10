'use client';

import { API_BASE_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CATEGORIES = ['耳环', '戒指', '手链手镯', '项链', '胸针', '套装'];

interface ProductFormData {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  discount: string;
  category: string;
  inStock: string;
  material: string;
  technique: string;
  dimensions: string;
  weight: string;
  tags: string;
  featured: boolean;
  rating: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { _id?: string; imageUrls?: string[] };
  mode: 'create' | 'edit';
}

const EMPTY: ProductFormData = {
  name: '', description: '', longDescription: '', price: '', discount: '',
  category: '耳环', inStock: '0', material: '', technique: '',
  dimensions: '', weight: '', tags: '', featured: false, rating: '0',
};

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [form, setForm] = useState<ProductFormData>({
    ...EMPTY,
    ...initialData,
    price: String(initialData?.price || ''),
    discount: String(initialData?.discount || ''),
    inStock: String(initialData?.inStock ?? '0'),
    rating: String(initialData?.rating || '0'),
    tags: Array.isArray(initialData?.tags) ? (initialData.tags as string[]).join(', ') : '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: keyof ProductFormData, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.description || !form.price || !form.category) {
      setError('请填写名称、描述、价格和品类');
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        longDescription: form.longDescription.trim(),
        price: Number(form.price),
        discount: form.discount ? Number(form.discount) : undefined,
        category: form.category,
        inStock: Number(form.inStock),
        material: form.material.trim(),
        technique: form.technique.trim(),
        dimensions: form.dimensions.trim(),
        weight: form.weight.trim(),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        featured: form.featured,
        rating: Number(form.rating),
        // 占位图片，真实项目通过 multipart 上传
        imageUrls: initialData?.imageUrls?.length ? initialData.imageUrls : ['/images/placeholder.jpg'],
      };

      const url = mode === 'create'
        ? `${API_BASE_URL}/api/products`
        : `${API_BASE_URL}/api/products/${initialData?._id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || '操作失败');

      setSuccess(mode === 'create' ? '产品创建成功！' : '产品更新成功！');
      setTimeout(() => router.push('/admin/products'), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, type = 'text', required = false, placeholder = '', rows = 0 }: {
    label: string; name: keyof ProductFormData; type?: string; required?: boolean; placeholder?: string; rows?: number;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {rows > 0 ? (
        <textarea rows={rows} value={form[name] as string}
          onChange={e => set(name, e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-accent resize-none" />
      ) : (
        <input type={type} value={form[name] as string}
          onChange={e => set(name, e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-accent" />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-sm text-sm">{success}</div>}

      {/* 基本信息 */}
      <section className="bg-white border border-gray-100 rounded-sm p-5 space-y-4">
        <h2 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">基本信息</h2>
        <Field label="产品名称" name="name" required placeholder="例：樱花垂坠耳环" />
        <Field label="简短描述" name="description" required placeholder="一句话描述产品特点" rows={2} />
        <Field label="详细描述" name="longDescription" placeholder="详细的产品故事与工艺说明" rows={4} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              品类<span className="text-red-400 ml-0.5">*</span>
            </label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-accent">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div className={`relative w-9 h-5 rounded-full transition-colors ${form.featured ? 'bg-accent' : 'bg-gray-200'}`}
                onClick={() => set('featured', !form.featured)}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-xs text-gray-600">设为精选</span>
            </label>
          </div>
        </div>
      </section>

      {/* 价格库存 */}
      <section className="bg-white border border-gray-100 rounded-sm p-5 space-y-4">
        <h2 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">价格与库存</h2>
        <div className="grid grid-cols-3 gap-4">
          <Field label="原价（¥）" name="price" type="number" required placeholder="1280" />
          <Field label="折扣价（¥）" name="discount" type="number" placeholder="可选" />
          <Field label="库存数量" name="inStock" type="number" placeholder="0" />
        </div>
        <Field label="初始评分（0-5）" name="rating" type="number" placeholder="4.5" />
      </section>

      {/* 产品规格 */}
      <section className="bg-white border border-gray-100 rounded-sm p-5 space-y-4">
        <h2 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">产品规格</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="材质" name="material" placeholder="例：925纯银" />
          <Field label="制作工艺" name="technique" placeholder="例：手工雕刻" />
          <Field label="尺寸" name="dimensions" placeholder="例：长3.5cm" />
          <Field label="重量" name="weight" placeholder="例：4g" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">标签（逗号分隔）</label>
          <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
            placeholder="例：樱花, 垂坠, 日式, 精选"
            className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-accent" />
        </div>
      </section>

      {/* 提交 */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-sm transition-colors disabled:opacity-60">
          {saving ? '保存中...' : mode === 'create' ? '创建产品' : '保存更改'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')}
          className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-sm hover:bg-gray-50 transition-colors">
          取消
        </button>
      </div>
    </form>
  );
}
