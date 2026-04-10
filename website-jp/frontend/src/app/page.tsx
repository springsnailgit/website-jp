'use client';

import MainLayout from "@/components/layout/MainLayout";
import { API_BASE_URL } from "@/config";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  featured: boolean;
  rating?: number;
  material?: string;
}

// ── Hero ───────────────────────────────────────────────────────────────────────
const HeroSection = ({ onExploreClick }: { onExploreClick: () => void }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-stone-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>

    {/* 樱花粒子装饰 */}
    <div className="absolute inset-0 z-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute text-pink-300 opacity-20 animate-float select-none"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
            fontSize: `${14 + (i % 3) * 6}px`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${5 + i * 0.5}s`,
          }}
        >
          ✿
        </div>
      ))}
    </div>

    <div className="container mx-auto px-4 z-10 text-center">
      <p className="text-pink-300 text-sm tracking-[0.4em] mb-6 uppercase">Kashiwagi Design</p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight tracking-wide">
        花は散り また咲く<br />
        <span className="text-2xl md:text-3xl lg:text-4xl text-gray-300 font-light mt-2 block tracking-widest">
          一期一会を大切に
        </span>
      </h1>
      <p className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
        每一次相遇都是难得的缘分，如同花开花落<br className="hidden md:block" />
        我们用匠心制作每一件珠宝，传递生命的珍贵与美好
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onExploreClick}
          className="px-8 py-3 bg-white text-gray-900 text-sm font-medium tracking-widest hover:bg-gray-100 transition-all duration-300 rounded-sm"
        >
          探索作品
        </button>
        <Link
          href="/contact"
          className="px-8 py-3 border border-white text-white text-sm font-medium tracking-widest hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-sm"
        >
          定制咨询
        </Link>
      </div>
    </div>

    {/* 向下滚动提示 */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
      <svg className="w-5 h-5 text-white opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>
);

// ── 数字展示 ───────────────────────────────────────────────────────────────────
const StatsSection = () => (
  <section className="py-12 bg-stone-900 text-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { num: '15+', label: '年匠心经验' },
          { num: '2000+', label: '定制作品' },
          { num: '6', label: '产品系列' },
          { num: '98%', label: '客户满意度' },
        ].map((s, i) => (
          <div key={i}>
            <p className="text-3xl font-light text-white mb-1">{s.num}</p>
            <p className="text-sm text-gray-400 tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── 关于我们 ───────────────────────────────────────────────────────────────────
const AboutSection = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/5] bg-stone-100 rounded-sm overflow-hidden relative">
            <Image
              src="/images/design/Japanweb.png"
              alt="柏木设计工作室"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/10" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-stone-100 rounded-sm flex items-center justify-center p-4 shadow-lg">
            <div className="text-center">
              <p className="text-3xl font-light text-stone-800">15</p>
              <p className="text-xs text-stone-500 mt-1 leading-tight">年匠心<br />设计经验</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:pl-8">
          <p className="text-xs tracking-[0.3em] text-accent uppercase">About Us</p>
          <h2 className="text-3xl font-light text-gray-800 leading-snug">
            源自日本的<br />匠心工艺
          </h2>
          <div className="w-12 h-px bg-accent" />
          <p className="text-gray-600 leading-relaxed">
            柏木设计工作室成立于2010年，由日本首饰设计大师柏木杏子创立。我们秉承日本传统工艺精神，将现代设计美学融入每一件作品中，创造出独具风格的珠宝首饰。
          </p>
          <p className="text-gray-600 leading-relaxed">
            "一期一会"是我们的设计理念——每一件首饰都蕴含着独特的故事和情感，如同花开花落的自然循环，珍贵而短暂。
          </p>
          <Link href="/about" className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:gap-3 transition-all duration-200">
            了解更多
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// ── 精选作品 ───────────────────────────────────────────────────────────────────
const FeaturedWorksSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products?featured=true&limit=6`);
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          setProducts(data.data);
        } else {
          // 回退：取最新6件
          const res2 = await fetch(`${API_BASE_URL}/api/products?limit=6&sort=created_desc`);
          const data2 = await res2.json();
          if (data2.success) setProducts(data2.data || []);
        }
      } catch {
        /* 静默失败，显示空态 */
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getImageSrc = (urls: string[]) => {
    if (!urls?.length) return null;
    const url = urls[0];
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <section ref={sectionRef} id="featured-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">Featured Works</p>
          <h2 className="text-3xl font-light text-gray-800">我们的作品</h2>
          <div className="w-12 h-px bg-accent mx-auto mt-4" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-sm mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">作品即将上架</p>
            <p className="text-sm">敬请期待</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => {
              const imgSrc = getImageSrc(p.imageUrls);
              return (
                <Link key={p._id} href={`/products/${p._id}`} className="group block">
                  <div className="overflow-hidden rounded-sm bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="aspect-square relative overflow-hidden bg-stone-100">
                      {imgSrc ? (
                        <Image src={imgSrc} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300 text-4xl">✿</div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      {p.featured && (
                        <span className="absolute top-3 left-3 bg-accent text-white text-xs px-2 py-0.5 tracking-wide">
                          精选
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400 mb-1">{p.category}</p>
                      <h3 className="text-base font-medium text-gray-800 group-hover:text-accent transition-colors">{p.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{p.material || p.description}</p>
                      <p className="text-accent font-medium mt-2">¥{p.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/products" className="inline-flex items-center gap-2 border border-gray-800 text-gray-800 px-8 py-3 text-sm tracking-widest hover:bg-gray-800 hover:text-white transition-all duration-300 rounded-sm">
            查看全部作品
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// ── 品类导航 ───────────────────────────────────────────────────────────────────
const CategoriesSection = () => {
  const categories = [
    { name: '耳环', icon: '◎', desc: '垂坠与耳钉系列' },
    { name: '戒指', icon: '○', desc: '情侣与个性款' },
    { name: '项链', icon: '◇', desc: '吊坠与长链系列' },
    { name: '手链手镯', icon: '□', desc: '编链与开口款' },
    { name: '胸针', icon: '✦', desc: '花卉与动物系列' },
    { name: '套装', icon: '✧', desc: '礼盒搭配套装' },
  ];
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">Collections</p>
          <h2 className="text-3xl font-light text-gray-800">产品系列</h2>
          <div className="w-12 h-px bg-accent mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link key={c.name} href={`/products?category=${c.name}`}
              className="group text-center p-6 border border-gray-100 rounded-sm hover:border-accent hover:shadow-md transition-all duration-300">
              <div className="text-3xl text-gray-300 group-hover:text-accent transition-colors duration-300 mb-3">{c.icon}</div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">{c.name}</h3>
              <p className="text-xs text-gray-400">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── 工艺流程 ───────────────────────────────────────────────────────────────────
const ProcessSection = () => (
  <section className="py-24 bg-stone-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">Our Process</p>
        <h2 className="text-3xl font-light text-gray-800">匠心制作流程</h2>
        <div className="w-12 h-px bg-accent mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { step: '01', title: '概念设计', desc: '与客户深度沟通，将情感与故事转化为设计草图。' },
          { step: '02', title: '材料甄选', desc: '精选925纯银、18K金及天然宝石，确保品质卓越。' },
          { step: '03', title: '手工制作', desc: '经验丰富的匠人逐一手工打造，每件作品历时数天。' },
          { step: '04', title: '品质检验', desc: '严苛的质量检测，确保每件首饰完美呈现。' },
        ].map((p) => (
          <div key={p.step} className="text-center">
            <div className="w-14 h-14 rounded-full border-2 border-accent text-accent text-lg font-light flex items-center justify-center mx-auto mb-4">
              {p.step}
            </div>
            <h3 className="text-base font-medium text-gray-800 mb-2">{p.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── 客户评价 ───────────────────────────────────────────────────────────────────
const TestimonialsSection = () => {
  const testimonials = [
    { name: "佐藤明美", role: "常驻客户", text: "柏木设计的作品充满了日本传统美学的精髓，每一件都让我感受到匠人的用心。特别是樱花系列的耳环，简约而不失优雅。" },
    { name: "刘小红", role: "新婚客户", text: "定制的结婚戒指超出了我的期望！设计师亲自为我们设计，将我们的故事融入戒指的每一个细节中，终生难忘。" },
    { name: "Jennifer Smith", role: "设计师", text: "作为一名珠宝设计师，柏木团队的技术支持非常专业。Schematiq软件极大地提升了我的工作效率，强烈推荐！" },
  ];
  return (
    <section className="py-24 bg-stone-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-pink-300 uppercase mb-3">Testimonials</p>
          <h2 className="text-3xl font-light">客户心声</h2>
          <div className="w-12 h-px bg-pink-300 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-sm hover:bg-white/10 transition-colors">
              <p className="text-3xl text-pink-300 mb-4 font-serif">"</p>
              <p className="text-gray-300 leading-relaxed text-sm mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center text-white text-sm font-medium">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── 服务 ───────────────────────────────────────────────────────────────────────
const ServicesSection = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">Services</p>
        <h2 className="text-3xl font-light text-gray-800">我们的服务</h2>
        <div className="w-12 h-px bg-accent mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: '◈', title: '首饰定制', desc: '根据您的需求和喜好，提供个性化的首饰定制服务，为您创造独一无二的作品。', href: '/contact' },
          { icon: '◉', title: '设计咨询', desc: '专业的设计师团队为您提供珠宝设计咨询，帮助您选择最适合的材质和风格。', href: '/contact' },
          { icon: '◐', title: 'Schematiq 软件', desc: '自研珠宝设计软件培训，将传统工艺与现代技术完美结合，解放创作潜能。', href: '/services' },
        ].map((s) => (
          <div key={s.title} className="group border border-gray-100 p-8 rounded-sm hover:border-accent hover:shadow-md transition-all duration-300">
            <div className="text-3xl text-gray-200 group-hover:text-accent transition-colors duration-300 mb-4">{s.icon}</div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">{s.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{s.desc}</p>
            <Link href={s.href} className="inline-flex items-center gap-1 text-xs text-accent font-medium tracking-wide hover:gap-2 transition-all">
              了解详情
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA ────────────────────────────────────────────────────────────────────────
const CtaSection = () => (
  <section className="py-20 bg-accent">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-light text-white mb-4">开始您的定制之旅</h2>
      <p className="text-white/80 mb-8 text-sm">每一件作品都是一段故事，让我们共同创作属于您的珍贵记忆</p>
      <Link href="/contact" className="inline-block bg-white text-accent px-10 py-3 text-sm font-medium tracking-widest hover:bg-gray-50 transition-colors rounded-sm">
        立即咨询
      </Link>
    </div>
  </section>
);

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Home() {
  const handleExploreClick = () => {
    document.getElementById('featured-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <HeroSection onExploreClick={handleExploreClick} />
      <StatsSection />
      <AboutSection />
      <FeaturedWorksSection />
      <CategoriesSection />
      <ProcessSection />
      <TestimonialsSection />
      <ServicesSection />
      <CtaSection />
    </MainLayout>
  );
}
