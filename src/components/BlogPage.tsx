'use client';

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

  return (
    <div className="min-h-screen pt-12 text-gray-900 dark:text-white">
      {/* Header Section */}
      <div className="pg-h">
        <span className="ey" style={{ position: 'relative', zIndex: 1 }}>
          {lang === 'en' ? 'CREU Journal' : 'CREU Blog'}
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
          {posts.map((post, idx) => (
            <motion.div
              key={post.slug}
              className="group bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
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
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#a855f7] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {post.category}
                  </div>
                </Link>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 font-semibold">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.author || 'CREU Studio'}</span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-[#a855f7] transition-colors leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-title)' }}>
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a855f7] dark:text-[#c499f5] group-hover:translate-x-1 transition-transform"
                >
                  {t('blog.readMore', lang)}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
