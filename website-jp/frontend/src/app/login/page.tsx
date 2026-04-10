'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const registered = searchParams.get('registered');
    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (user) router.push(redirect);
    }, [user, router, redirect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(formData.email, formData.password);
            router.push(redirect);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <section className="min-h-screen flex items-center justify-center py-20 bg-gray-50">
                <div className="w-full max-w-md px-4">
                    <div className="bg-white p-8 rounded-sm shadow-md border border-gray-100">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-medium text-gray-800 mb-1">欢迎回来</h1>
                            <p className="text-sm text-gray-500">登录柏木設計账户</p>
                        </div>

                        {registered && (
                            <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-sm mb-4 text-sm">
                                注册成功！请使用您的账号登录。
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-sm mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    电子邮箱
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    密码
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-sm text-sm font-medium tracking-wide transition-colors disabled:opacity-60"
                            >
                                {isLoading ? '登录中...' : '登 录'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            还没有账号？{' '}
                            <Link href="/register" className="text-accent hover:underline font-medium">
                                立即注册
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
