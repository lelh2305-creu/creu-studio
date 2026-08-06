'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from './Footer';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';
import { Post } from '@/lib/posts';

interface BlogPageProps {
  posts: Post[];
  onNavigate?: (tab: string) => void;
}

export default function BlogPage({ posts }: BlogPageProps) {
  const { lang } = useLang();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('creu_theme');
    if (savedTheme === 'dark' || document.body.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  return (
    <div className="min-h-screen pt-12 text-gray-900 dark:text-white">
      {/* Header Section */}
      <div className="pg-h">
        <span className="ey" style={{ position: 'relative', zIndex: 1 }}>
          {t('blog.label', lang)}
        </span>
        <h1 className="serif pg-t">
          {lang === 'en' ? (
            <>Creative<br /><span className="pk">Insights & Trends.</span></>
          ) : (
            <>Góc nhìn<br /><span className="pk">Sáng tạo Xu hướng.</span></>
          )}
        </h1>
        <p className="pg-s text-gray-800 dark:text-gray-200">
          {t('blog.subtitle', lang)}
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="shell mt-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => {
            const activeTitle = (lang === 'en' && post.titleEn) ? post.titleEn : post.title;
            const activeDesc = (lang === 'en' && post.descriptionEn) ? post.descriptionEn : post.description;

            return (
              <motion.div
                key={post.slug}
                className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                style={{
                  background: isDark ? 'rgba(14, 20, 36, 0.75)' : 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '24px',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div>
                  {/* Thumbnail Image */}
                  <Link href={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-[16/10] bg-black/10">
                    <img
                      src={post.thumbnail}
                      alt={activeTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#a855f7] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                      {post.category}
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs font-semibold" style={{ color: isDark ? '#cbd5e1' : '#4b5563' }}>
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.author || 'CREU Studio'}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2
                        className="text-xl font-extrabold group-hover:text-[#a855f7] transition-colors leading-snug line-clamp-2"
                        style={{ fontFamily: 'var(--font-title)', color: isDark ? '#ffffff' : '#111827' }}
                      >
                        {activeTitle}
                      </h2>
                    </Link>

                    <p
                      className="text-sm leading-relaxed line-clamp-3 font-normal"
                      style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}
                    >
                      {activeDesc}
                    </p>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                    style={{ color: isDark ? '#c499f5' : '#8b5cf6' }}
                  >
                    {t('blog.readMore', lang)} →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
