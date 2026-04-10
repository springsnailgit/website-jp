'use client';

import { API_BASE_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  totalProducts: number;
  totalInStock: number;
  avgPrice: number;
  avgRating: number;
}

interface CategoryStat {
  category: string;
  count: number;
  avgPrice: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  color: string;
  href?: string;
}

const StatCard = ({ label, value, sub, icon, color, href }: StatCardProps) => {
  const inner = (
    <div className={`bg-white rounded-sm border border-gray-100 p-5 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-xl ${color}`}>{icon}</div>
        {href && (
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
      <p className="text-2xl font-light text-gray-800 mb-0.5">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data.overview);
          setCategories(data.data.categories || []);
        }
      } catch {
        /* 静默 */
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  const categoryIcons: Record<string, string> = {
    耳环: '◎', 戒指: '○', 项链: '◇', 手链手镯: '□', 胸针: '✦', 套装: '✧',
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-medium text-gray-800">仪表盘</h1>
        <p className="text-sm text-gray-400 mt-1">欢迎回到柏木設計管理后台</p>
      </div>

      {/* 核心指标 */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-gray-100 p-5 animate-pulse">
              <div className="w-10 h-10 bg-gray-100 rounded-sm mb-3" />
              <div className="h-7 bg-gray-100 rounded w-16 mb-1" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="产品总数"
            value={stats?.totalProducts ?? 0}
            sub="所有在售产品"
            icon="◇"
            color="bg-blue-50 text-blue-500"
            href="/admin/products"
          />
          <StatCard
            label="总库存"
            value={stats?.totalInStock ?? 0}
            sub="件可售商品"
            icon="□"
            color="bg-green-50 text-green-500"
          />
          <StatCard
            label="均价"
            value={stats?.avgPrice ? `¥${stats.avgPrice.toLocaleString()}` : '—'}
            sub="所有产品平均"
            icon="◈"
            color="bg-amber-50 text-amber-500"
          />
          <StatCard
            label="平均评分"
            value={stats?.avgRating ? `${stats.avgRating} ★` : '—'}
            sub="客户综合评价"
            icon="✦"
            color="bg-purple-50 text-purple-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 品类分布 */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">品类分布</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-50 rounded animate-pulse" />)}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">暂无数据</p>
          ) : (
            <div className="space-y-3">
              {categories.map(c => {
                const total = categories.reduce((s, x) => s + x.count, 0);
                const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
                return (
                  <div key={c.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 flex items-center gap-1.5">
                        <span className="text-gray-400">{categoryIcons[c.category] || '○'}</span>
                        {c.category}
                      </span>
                      <span className="text-gray-400">{c.count} 件</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 快捷操作 */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">快捷操作</h2>
          <div className="space-y-2">
            {[
              { href: '/admin/products/new', label: '新增产品', desc: '上架一件新的首饰作品', icon: '+' },
              { href: '/admin/products', label: '管理产品', desc: '编辑、下架或更新产品信息', icon: '◇' },
              { href: '/admin/users', label: '用户列表', desc: '查看注册用户信息', icon: '◎' },
              { href: '/products', label: '查看前台', desc: '预览面向客户的展示页面', icon: '→', external: true },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                className="flex items-center gap-4 p-3 rounded-sm hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-sm bg-gray-100 group-hover:bg-accent group-hover:text-white text-gray-500 flex items-center justify-center text-sm transition-colors flex-shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
