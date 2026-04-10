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

            {/* 工艺传承 */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="jp-divider text-3xl font-medium text-center mb-16">匠心工艺传承</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-96 bg-stone-100 rounded-sm overflow-hidden flex items-center justify-center">
                            <div className="text-center space-y-3 text-stone-400">
                                <div className="text-6xl">◈</div>
                                <p className="text-sm tracking-widest">KASHIWAGI CRAFT</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-medium">传统金工 × 现代美学</h3>
                            <p className="text-gray-600">
                                柏木工作室的每一件作品，均由具有二十年以上经验的日本金工匠人手工打造。我们坚守传统槌打、錾刻、掐丝等古老技艺，同时融入现代设计美学，让每一件首饰都成为连接传统与当代的桥梁。
                            </p>
                            <p className="text-gray-600">
                                我们使用的925纯银、18K金及天然宝石，均经过严格筛选认证。从原材料到成品，每道工序都有匠人的心血与时间，一件作品平均历时数日至数周完成。
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <div className="border border-gray-200 p-4 rounded-sm">
                                    <h4 className="text-lg font-medium mb-2">RA 系列</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• 流线几何造型</li>
                                        <li>• 925纯银工艺</li>
                                        <li>• 耳环、项链、戒指</li>
                                        <li>• 简约日系美学</li>
                                    </ul>
                                    <p className="mt-4 text-accent font-medium">¥8,000 起</p>
                                </div>

                                <div className="border border-accent p-4 rounded-sm bg-accent/5 relative">
                                    <span className="absolute top-0 right-0 bg-accent text-white text-xs px-2 py-1 -translate-y-1/2 translate-x-0">
                                        精选
                                    </span>
                                    <h4 className="text-lg font-medium mb-2">RG 系列</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• 自然花卉主题</li>
                                        <li>• 18K镀金工艺</li>
                                        <li>• 全品类覆盖</li>
                                        <li>• 天然宝石点缀</li>
                                        <li>• 礼盒套装可选</li>
                                    </ul>
                                    <p className="mt-4 text-accent font-medium">¥12,000 起</p>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Link href="/products" className="inline-block btn btn-primary">
                                    浏览全部作品
                                </Link>
                                <Link href="/contact" className="inline-block ml-4 text-accent font-medium hover:underline">
                                    预约定制咨询 &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 培训课程 */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="jp-divider text-3xl font-medium text-center mb-16">工艺体验课程</h2>

                    <div className="max-w-4xl mx-auto">
                        <p className="text-lg text-gray-600 text-center mb-12">
                            亲手感受日本传统金工之美。我们提供从入门体验到匠人深度课程的全系列工作坊，无论您是首次接触还是希望深入探索金工工艺，都能找到最适合的课程。
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "入门体验工作坊",
                                    description: "适合珠宝设计初学者，在匠人带领下亲手完成一件简单银饰，体验金工之美。",
                                    details: ["1天体验课程", "工具与材料认知", "基础槌打练习", "完成一件作品带走"],
                                    price: 3800
                                },
                                {
                                    title: "金工技艺进阶班",
                                    description: "系统学习日本传统金工技法，包括錾刻、掐丝、宝石镶嵌等核心工艺。",
                                    details: ["3天密集课程", "传统錾刻技法", "925纯银实操", "宝石基础镶嵌", "完成套装作品"],
                                    price: 8800,
                                    featured: true
                                },
                                {
                                    title: "大师定制工作坊",
                                    description: "由柏木首席工匠一对一指导，根据您的创意构思，共同打造一件专属珠宝作品。",
                                    details: ["5天私人定制课程", "设计理念深度沟通", "全程工匠陪同制作", "高级金工全套技法", "个人专属纪念作品"],
                                    price: 18000
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
