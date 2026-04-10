'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
    { href: '/admin', label: '仪表盘', icon: '◈', exact: true },
    { href: '/admin/products', label: '产品管理', icon: '◇' },
    { href: '/admin/users', label: '用户管理', icon: '◎' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && (!user || !isAdmin)) {
            router.push('/login?redirect=/admin');
        }
    }, [user, isAdmin, isLoading, router]);

    if (isLoading || !user || !isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* 侧边栏遮罩（移动端） */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* 侧边栏 */}
            <aside className={`
                fixed top-0 left-0 h-full w-60 bg-stone-900 text-white z-30 flex flex-col
                transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto
            `}>
                {/* Logo */}
                <div className="px-6 py-5 border-b border-white/10">
                    <Link href="/" className="flex flex-col">
                        <span className="text-lg font-medium tracking-wider">柏木設計</span>
                        <span className="text-xs text-gray-400 mt-0.5 tracking-widest">管理后台</span>
                    </Link>
                </div>

                {/* 导航 */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                                isActive(item.href, item.exact)
                                    ? 'bg-accent text-white'
                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* 用户信息 */}
                <div className="px-4 py-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/" className="flex-1 text-center text-xs text-gray-400 hover:text-white py-1.5 border border-white/10 rounded-sm transition-colors">
                            前台
                        </Link>
                        <button onClick={logout} className="flex-1 text-center text-xs text-gray-400 hover:text-red-400 py-1.5 border border-white/10 rounded-sm transition-colors">
                            退出
                        </button>
                    </div>
                </div>
            </aside>

            {/* 主内容 */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
                {/* 顶部栏 */}
                <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-10">
                    <button className="lg:hidden p-1.5 rounded-sm hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(true)}>
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                            {navItems.find(n => isActive(n.href, n.exact))?.label || '管理后台'}
                        </p>
                    </div>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-sm">管理员</span>
                </header>

                {/* 页面内容 */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
