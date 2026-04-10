'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAdmin, logout } = useAuth();
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: '首页', href: '/' },
        { name: '关于我们', href: '/about' },
        { name: '产品展示', href: '/products' },
        { name: '设计服务', href: '/services' },
        { name: '联系我们', href: '/contact' },
    ];

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        router.push('/');
    };

    const isHomePage = pathname === '/';
    const headerBase = isScrolled
        ? 'bg-white bg-opacity-95 shadow-sm py-2'
        : isHomePage
            ? 'bg-transparent py-4'
            : 'bg-white shadow-sm py-3';

    const textColor = isScrolled || !isHomePage ? 'text-gray-800' : 'text-white';
    const logoColor = isScrolled || !isHomePage ? 'text-gray-900' : 'text-white';

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${headerBase}`}>
            <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
                {/* 品牌标志 */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className={`text-xl font-medium tracking-wider ${logoColor}`}>
                        柏木設計
                    </span>
                    <span className={`hidden sm:block text-xs tracking-widest opacity-70 ${logoColor}`}>
                        KASHIWAGI
                    </span>
                </Link>

                {/* 桌面导航 */}
                <nav className="hidden md:flex space-x-6 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm tracking-wide hover:text-accent transition-colors duration-200 ${
                                pathname === link.href
                                    ? 'text-accent font-medium border-b border-accent pb-0.5'
                                    : textColor
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* 用户区域 */}
                    {user ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className={`flex items-center space-x-1.5 text-sm hover:text-accent transition-colors ${textColor}`}
                            >
                                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="max-w-20 truncate">{user.name}</span>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-sm shadow-lg border border-gray-100 py-1 animate-fade-in">
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h18M3 17h18" />
                                            </svg>
                                            管理后台
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        退出登录
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className={`text-sm px-4 py-1.5 border rounded-sm transition-all duration-200 ${
                                isScrolled || !isHomePage
                                    ? 'border-accent text-accent hover:bg-accent hover:text-white'
                                    : 'border-white text-white hover:bg-white hover:text-gray-800'
                            }`}
                        >
                            登录
                        </Link>
                    )}
                </nav>

                {/* 移动端汉堡菜单 */}
                <button
                    className={`md:hidden flex items-center ${textColor}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="打开菜单"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {isMobileMenuOpen
                            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                        }
                    </svg>
                </button>
            </div>

            {/* 移动端菜单 */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-white border-t border-gray-100 w-full px-4 py-4 shadow-lg animate-fade-in">
                    <ul className="space-y-1">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`block py-2.5 px-3 rounded-sm text-sm hover:text-accent hover:bg-gray-50 transition-colors ${
                                        pathname === link.href ? 'text-accent font-medium bg-gray-50' : 'text-gray-800'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <li className="pt-2 border-t border-gray-100 mt-2">
                            {user ? (
                                <div className="space-y-1">
                                    <div className="px-3 py-2 text-sm text-gray-600">
                                        已登录：<span className="font-medium text-gray-800">{user.name}</span>
                                    </div>
                                    {isAdmin && (
                                        <Link href="/admin" className="block py-2 px-3 text-sm text-accent hover:bg-gray-50 rounded-sm" onClick={() => setIsMobileMenuOpen(false)}>
                                            管理后台
                                        </Link>
                                    )}
                                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 text-sm text-red-500 hover:bg-gray-50 rounded-sm">
                                        退出登录
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="block py-2 px-3 text-sm text-accent font-medium hover:bg-gray-50 rounded-sm" onClick={() => setIsMobileMenuOpen(false)}>
                                    登录 / 注册
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
