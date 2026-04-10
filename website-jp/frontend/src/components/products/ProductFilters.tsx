'use client';

import { memo, useCallback, useMemo, useState } from 'react';

/**
 * 筛选选项接口
 */
export interface FilterOption {
    id: string;
    label: string;
}

/**
 * 筛选区块属性接口
 */
interface FilterSectionProps {
    title: string;
    options: FilterOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    multiple?: boolean;
}

/**
 * 筛选区块组件 - 显示一组相关的筛选选项
 */
const FilterSection = memo(({ title, options, selected, onChange, multiple = true }: FilterSectionProps) => {
    const handleChange = useCallback((id: string) => {
        if (multiple) {
            if (selected.includes(id)) {
                onChange(selected.filter(item => item !== id));
            } else {
                onChange([...selected, id]);
            }
        } else {
            onChange([id]);
        }
    }, [multiple, selected, onChange]);

    return (
        <div className="mb-6">
            <h3 className="font-medium mb-3">{title}</h3>
            <div className="space-y-2">
                {options.map(option => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type={multiple ? "checkbox" : "radio"}
                            name={title.toLowerCase()}
                            checked={selected.includes(option.id)}
                            onChange={() => handleChange(option.id)}
                            className="text-accent focus:ring-accent rounded"
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
});

FilterSection.displayName = 'FilterSection';

/**
 * 筛选按钮组件属性接口
 */
interface FilterButtonsProps {
    onApply: () => void;
    onReset: () => void;
    isMobile?: boolean;
}

/**
 * 筛选按钮组件 - 应用和重置筛选
 */
const FilterButtons = memo(({ onApply, onReset, isMobile = false }: FilterButtonsProps) => (
    <div className={`mt-8 space-y-3`}>
        <button
            onClick={onApply}
            className={`w-full bg-primary text-white rounded-sm hover:bg-primary-600 transition-colors ${isMobile ? 'py-3' : 'py-2'}`}
        >
            应用筛选
        </button>

        <button
            onClick={onReset}
            className={`w-full bg-white border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-50 transition-colors ${isMobile ? 'py-3' : 'py-2'}`}
        >
            重置筛选
        </button>
    </div>
));

FilterButtons.displayName = 'FilterButtons';

/**
 * 筛选器组件属性接口
 */
export interface ProductFiltersProps {
    onApplyFilters: (filters: any) => void;
    categories: FilterOption[];
    materials: FilterOption[];
    priceRanges: FilterOption[];
}

/**
 * 产品筛选组件 - 管理产品筛选状态和UI
 */
const ProductFilters = ({ onApplyFilters, categories, materials, priceRanges }: ProductFiltersProps) => {
    // 筛选状态
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // 处理应用筛选
    const handleApplyFilters = useCallback(() => {
        const filters = {
            categories: selectedCategories,
            materials: selectedMaterials,
            priceRange: selectedPriceRange[0] || null
        };

        onApplyFilters(filters);

        if (isMobileFilterOpen) {
            setIsMobileFilterOpen(false);
        }
    }, [selectedCategories, selectedMaterials, selectedPriceRange, onApplyFilters, isMobileFilterOpen]);

    // 处理重置筛选
    const handleResetFilters = useCallback(() => {
        setSelectedCategories([]);
        setSelectedMaterials([]);
        setSelectedPriceRange([]);
        onApplyFilters({});
    }, [onApplyFilters]);

    // 筛选面板内容 - 使用useMemo避免不必要的重新渲染
    const filterPanelContent = useMemo(() => (
        <>
            <FilterSection
                title="产品分类"
                options={categories}
                selected={selectedCategories}
                onChange={setSelectedCategories}
            />

            <FilterSection
                title="材质"
                options={materials}
                selected={selectedMaterials}
                onChange={setSelectedMaterials}
            />

            <FilterSection
                title="价格区间"
                options={priceRanges}
                selected={selectedPriceRange}
                onChange={setSelectedPriceRange}
                multiple={false}
            />
        </>
    ), [categories, materials, priceRanges, selectedCategories, selectedMaterials, selectedPriceRange]);

    return (
        <>
            {/* 移动端筛选按钮 */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="w-full p-3 border border-gray-300 rounded-sm flex items-center justify-center space-x-2"
                >
                    <span>筛选</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* 桌面端永久显示的筛选面板 */}
            <div className="hidden md:block">
                <div className="px-4 py-5 bg-white rounded-sm shadow-sm">
                    <h2 className="text-lg font-medium mb-6">筛选产品</h2>
                    {filterPanelContent}
                    <FilterButtons onApply={handleApplyFilters} onReset={handleResetFilters} />
                </div>
            </div>

            {/* 移动端筛选抽屉 */}
            {isMobileFilterOpen && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end transition-all">
                    <div className="bg-white h-full w-4/5 max-w-sm overflow-y-auto animate-slide-in-right">
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium">筛选产品</h2>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    aria-label="关闭筛选面板"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            {filterPanelContent}
                            <FilterButtons onApply={handleApplyFilters} onReset={handleResetFilters} isMobile />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(ProductFilters);
