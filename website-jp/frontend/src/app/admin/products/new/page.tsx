import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-medium text-gray-800">新增产品</h1>
          <p className="text-sm text-gray-400 mt-0.5">填写以下信息，上架一件新的首饰作品</p>
        </div>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
