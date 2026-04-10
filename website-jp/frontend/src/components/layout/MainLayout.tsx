'use client';

import useAnalytics from '@/hooks/useAnalytics';
import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface MainLayoutProps {
    children: ReactNode;
    includeHeader?: boolean;
    includeFooter?: boolean;
}

/**
 * 主布局组件
 * 提供页面的基本结构，包括页眉、主内容区和页脚
 */
const MainLayout = ({
    children,
    includeHeader = true,
    includeFooter = true
}: MainLayoutProps) => {
    // 使用自定义hook记录页面访问数据
    useAnalytics();

    return (
        <>
            {includeHeader && <Header />}
            <main className="min-h-screen pt-20">
                {children}
            </main>
            {includeFooter && <Footer />}
        </>
    );
};

export default MainLayout;
