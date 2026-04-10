'use client';

import MainLayout from '@/components/layout/MainLayout';

export default function AboutPage() {
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
                        关于柏木设计
                    </h1>
                    <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
                        一期一会 - 源自日本的匠心与传承
                    </p>
                </div>
            </section>

            {/* 我们的故事 */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="jp-divider text-3xl font-medium text-center mb-16">我们的故事</h2>

                    <div className="max-w-4xl mx-auto space-y-8">
                        <p className="text-lg text-gray-700">
                            柏木设计工作室成立于2010年，由日本首饰设计大师柏木杏子创立于东京。柏木杏子出生于京都的一个传统工艺家庭，从小受到日本美学的熏陶，对物品之间的和谐与平衡有着独特的感知力。
                        </p>
                        <p className="text-lg text-gray-700">
                            在东京艺术大学学习期间，她结合了传统工艺与现代设计理念，开始创作独具个人风格的首饰作品。毕业后，她在巴黎和纽约等国际时尚之都工作和学习，吸收了多元文化的设计灵感。
                        </p>
                        <p className="text-lg text-gray-700">
                            2010年，柏木杏子回到日本，创立了柏木设计工作室，致力于将日本传统美学与现代设计语言融合，创造出既有东方含蓄之美，又具有国际视野的首饰作品。
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                            <div className="relative aspect-square">
                                <div className="w-full h-full bg-gray-200"></div>
                            </div>
                            <div className="relative aspect-square">
                                <div className="w-full h-full bg-gray-200"></div>
                            </div>
                        </div>

                        <p className="text-lg text-gray-700">
                            "一期一会"是日本茶道精神的核心理念之一，意味着每一次相遇都是难得的缘分，应当珍惜当下的每一刻。柏木设计将这一理念融入创作中，每一件作品都是独特的，蕴含着设计师的情感和故事。
                        </p>
                        <p className="text-lg text-gray-700">
                            如同花开花落的自然循环，我们的作品旨在唤醒人们对生命短暂而美好的珍视，以及对自然和谐的感知。我们希望，当您佩戴我们的作品时，不仅仅是欣赏它的外在美，更能感受到其中蕴含的人文关怀和情感共鸣。
                        </p>
                    </div>
                </div>
            </section>

            {/* 设计理念 */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="jp-divider text-3xl font-medium text-center mb-16">设计理念</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-4">自然与和谐</h3>
                            <p className="text-gray-600">
                                我们的设计灵感来自自然界的形态与节奏，追求人与自然的和谐共生。每一件作品都反映了我们对自然美的敬畏与热爱。
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-4">简约与精致</h3>
                            <p className="text-gray-600">
                                我们崇尚"少即是多"的设计哲学，通过简约的线条和形态表达深刻的情感与理念，在细节处彰显匠心与精致。
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-4">传统与创新</h3>
                            <p className="text-gray-600">
                                我们尊重传统工艺，同时不断探索新的材料和技术，将古老的智慧与现代美学融合，创造出既有文化底蕴又具时代感的作品。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 团队介绍 */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="jp-divider text-3xl font-medium text-center mb-16">我们的团队</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "柏木杏子",
                                title: "创始人兼首席设计师",
                                description: "毕业于东京艺术大学首饰设计专业，拥有超过15年的珠宝设计经验，作品曾在多个国际设计展中展出。",
                                image: "/assets/team-1.jpg"
                            },
                            {
                                name: "山田健一",
                                title: "首席工匠",
                                description: "传统金工技术传承人，拥有30年金属加工经验，精通各种首饰制作工艺，负责将设计理念转化为实际作品。",
                                image: "/assets/team-2.jpg"
                            },
                            {
                                name: "铃木美咲",
                                title: "产品设计师",
                                description: "专注于材料研究与创新，毕业于京都工艺纤维大学，擅长将非传统材料融入首饰设计中。",
                                image: "/assets/team-3.jpg"
                            },
                            {
                                name: "高桥龙太",
                                title: "品牌运营总监",
                                description: "负责柏木设计的品牌推广与海外市场拓展，在日本时尚与奢侈品行业拥有十余年丰富经验。",
                                image: "/assets/team-4.jpg"
                            }
                        ].map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="relative rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                                    <div className="w-full h-full bg-gray-200"></div>
                                </div>
                                <h3 className="text-xl font-medium">{member.name}</h3>
                                <p className="text-accent mb-2">{member.title}</p>
                                <p className="text-gray-600 text-sm">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
