'use client';

import React from 'react';

interface SectionProps {
    className?: string;
    background?: 'white' | 'gray' | 'primary' | 'accent';
    children: React.ReactNode;
    fullWidth?: boolean;
    paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    id?: string;
}

/**
 * 通用章节组件
 * 用于创建一致的页面章节布局
 */
const Section: React.FC<SectionProps> = ({
    className = '',
    background = 'white',
    children,
    fullWidth = false,
    paddingY = 'lg',
    id
}) => {
    const getBgColor = () => {
        switch (background) {
            case 'gray': return 'bg-gray-50';
            case 'primary': return 'bg-primary-50';
            case 'accent': return 'bg-accent-50';
            default: return 'bg-white';
        }
    };

    const getPadding = () => {
        switch (paddingY) {
            case 'none': return '';
            case 'sm': return 'py-6';
            case 'md': return 'py-12';
            case 'lg': return 'py-16';
            case 'xl': return 'py-24';
            default: return 'py-16';
        }
    };

    return (
        <section id={id} className={`${getBgColor()} ${getPadding()} ${className}`}>
            {fullWidth ? (
                <>{children}</>
            ) : (
                <div className="container mx-auto px-4">
                    {children}
                </div>
            )}
        </section>
    );
};

export default Section;
