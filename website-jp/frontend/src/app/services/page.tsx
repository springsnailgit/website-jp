'use client';

import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function ServicesPage() {
    return (
        <MainLayout>
            {/* 顶部横幅 */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-gray-800">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gray-800">
                        {/* 图片将来从资源文件夹加载 */}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>

                <div className="container mx-auto px-4 z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-medium text-white mb-6">
                        设计服务
                    </h1>
                    <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
                        从创意概念到完美成品，我们提供专业的全流程珠宝设计服务
                    </p>
                </div>
            </section>

            {/* 服务介绍 */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="jp-divider text-3xl font-medium text-center mb-16">我们的服务</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* 首饰定制 */}
                        <div className="space-y-6">
                            <div className="relative h-64 md:h-80 w-full">
                                <div className="w-full h-full bg-gray-200"></div>
                            </div>
                            <h3 className="text-2xl font-medium">首饰定制</h3>
                            <p className="text-gray-600">
                                为您创造独一无二的珠宝首饰，从设计理念到最终成品，每一步都由您参与，确保作品完美契合您的期望与需求。
                            </p>
                            <ul className="space-y-2 text-gray-600 list-disc pl-5">
                                <li>一对一设计咨询</li>
                                <li>手绘草图和3D模型预览</li>
                                <li>材质与宝石选择建议</li>
                                <li>手工精细制作</li>
                                <li>终身保养服务</li>
                            </ul>
                            <Link href="/contact" className="inline-block btn btn-primary mt-4">
                                咨询定制
                            </Link>
                        </div>

                        {/* 商业合作 */}
                        <div className="space-y-6">
                            <div className="relative h-64 md:h-80 w-full">
                                <div className="w-full h-full bg-gray-200"></div>
                            </div>
                            <h3 className="text-2xl font-medium">商业合作</h3>
                            <p className="text-gray-600">
                                为品牌提供专业的首饰设计服务，从品牌形象分析到系列产品设计，帮助您打造独具特色的珠宝产品线。
                            </p>
                            <ul className="space-y-2 text-gray-600 list-disc pl-5">
                                <li>品牌形象分析与首饰定位</li>
                                <li>系列首饰设计</li>
                                <li>原型制作与测试</li>
                                <li>批量生产指导</li>
                                <li>营销素材支持</li>
                            </ul>
                            <Link href="/contact" className="inline-block btn btn-primary mt-4">
                                商务合作
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Schematiq软件 */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="jp-divider text-3xl font-medium text-center mb-16">Schematiq 设计软件</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-96">
                            <div className="w-full h-full bg-gray-200"></div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-medium">专业珠宝设计的数字工具</h3>
                            <p className="text-gray-600">
                                Schematiq是我们自主开发的专业珠宝设计软件，将传统工艺与现代技术完美结合，为珠宝设计师提供强大而直观的创作工具。
                            </p>
                            <p className="text-gray-600">
                                无论是精细的纹路设计，还是复杂的三维结构建模，Schematiq都能满足专业珠宝设计的各种需求，帮助设计师将创意转化为可视化的设计方案。
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <div className="border border-gray-200 p-4 rounded-sm">
                                    <h4 className="text-lg font-medium mb-2">Schematiq Basic</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• 2D设计工具</li>
                                        <li>• 材质库</li>
                                        <li>• 基本渲染功能</li>
                                        <li>• 设计导出</li>
                                    </ul>
                                    <p className="mt-4 text-accent font-medium">¥5,980</p>
                                </div>

                                <div className="border border-accent p-4 rounded-sm bg-accent/5 relative">
                                    <span className="absolute top-0 right-0 bg-accent text-white text-xs px-2 py-1 -translate-y-1/2 translate-x-0">
                                        推荐
                                    </span>
                                    <h4 className="text-lg font-medium mb-2">Schematiq Plus+</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• 全功能2D/3D设计工具</li>
                                        <li>• 高级材质库</li>
                                        <li>• 逼真渲染引擎</li>
                                        <li>• AI辅助设计</li>
                                        <li>• 一年免费更新</li>
                                    </ul>
                                    <p className="mt-4 text-accent font-medium">¥12,800</p>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Link href="/contact" className="inline-block btn btn-primary">
                                    了解更多
                                </Link>
                                <Link href="#" className="inline-block ml-4 text-accent font-medium hover:underline">
                                    下载试用版 &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 培训课程 */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="jp-divider text-3xl font-medium text-center mb-16">培训课程</h2>

                    <div className="max-w-4xl mx-auto">
                        <p className="text-lg text-gray-600 text-center mb-12">
                            我们提供专业的珠宝设计和制作培训课程，无论您是初学者还是希望提升技能的专业人士，都能找到适合自己的课程。
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "基础技能工作坊",
                                    description: "适合珠宝设计初学者的入门课程，学习基本的设计理念和制作技巧。",
                                    details: ["2天密集培训", "基础工具使用", "材料认知", "小型作品制作"],
                                    price: 3800
                                },
                                {
                                    title: "Schematiq软件培训",
                                    description: "从基础到高级的Schematiq软件使用培训，掌握数字化珠宝设计技能。",
                                    details: ["3天在线培训", "软件界面熟悉", "2D设计实践", "3D建模技巧", "作品渲染"],
                                    price: 4500,
                                    featured: true
                                },
                                {
                                    title: "高级工艺大师班",
                                    description: "由资深工匠指导的高级制作技术课程，学习传统与现代工艺的融合。",
                                    details: ["5天进阶培训", "高级金工技术", "宝石镶嵌", "表面处理", "完整作品创作"],
                                    price: 12000
                                }
                            ].map((course, index) => (
                                <div
                                    key={index}
                                    className={`border p-6 rounded-sm ${course.featured ? 'border-accent bg-accent/5' : 'border-gray-200'
                                        } relative`}
                                >
                                    {course.featured && (
                                        <span className="absolute top-0 right-0 bg-accent text-white text-xs px-2 py-1 -translate-y-1/2 translate-x-0">
                                            热门
                                        </span>
                                    )}
                                    <h3 className="text-xl font-medium mb-3">{course.title}</h3>
                                    <p className="text-gray-600 mb-4">{course.description}</p>
                                    <ul className="space-y-2 mb-6">
                                        {course.details.map((detail, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between items-center">
                                        <span className="text-accent font-medium">¥{course.price}</span>
                                        <Link href="/contact" className="text-sm text-primary hover:underline">
                                            查看详情
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link href="/contact" className="btn btn-primary">
                                联系咨询
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
