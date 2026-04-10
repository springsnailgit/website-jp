'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
    const router = useRouter();
    const { register, user } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) router.push('/');
    }, [user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await register(formData.name, formData.email, formData.password);
            router.push('/login?registered=true');
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
                            <h1 className="text-2xl font-medium text-gray-800 mb-1">创建账户</h1>
                            <p className="text-sm text-gray-500">加入柏木設計，探索匠心之美</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-sm mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">姓名</label>
                                <input type="text" id="name" name="name" required autoComplete="name"
                                    value={formData.name} onChange={handleChange} placeholder="您的姓名"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">电子邮箱</label>
                                <input type="email" id="email" name="email" required autoComplete="email"
                                    value={formData.email} onChange={handleChange} placeholder="your@email.com"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">密码（至少6位）</label>
                                <input type="password" id="password" name="password" required minLength={6}
                                    value={formData.password} onChange={handleChange} placeholder="••••••••"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">确认密码</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required minLength={6}
                                    value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                                />
                            </div>
                            <button type="submit" disabled={isLoading}
                                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-sm text-sm font-medium tracking-wide transition-colors disabled:opacity-60 mt-2">
                                {isLoading ? '注册中...' : '注 册'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            已有账号？{' '}
                            <Link href="/login" className="text-accent hover:underline font-medium">立即登录</Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
