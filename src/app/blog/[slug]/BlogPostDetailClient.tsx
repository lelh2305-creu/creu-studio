'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WatermarkLogo3D from '@/components/WatermarkLogo3D';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';
import { Post } from '@/lib/posts';

interface BlogPostDetailClientProps {
  post: Post;
}

function renderMarkdownContent(content: string, isDark: boolean) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (keyPrefix: number) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${keyPrefix}`} className="list-disc list-inside space-y-2.5 my-5" style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}>
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(idx);
      return;
    }

    // Image Markdown: ![alt](src)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushList(idx);
      elements.push(
        <div key={idx} className="my-8 rounded-2xl overflow-hidden shadow-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1] || 'Blog image'}
            className="w-full h-auto object-cover max-h-[600px]"
            loading="lazy"
          />
          {imgMatch[1] && (
            <div className="text-center text-xs sm:text-sm py-2 px-4 italic text-gray-500 dark:text-gray-400 border-t border-black/5 dark:border-white/5">
              {imgMatch[1]}
            </div>
          )}
        </div>
      );
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList(idx);
      elements.push(
        <h3 key={idx} className="text-xl sm:text-2xl font-bold mt-8 mb-4 tracking-tight" style={{ fontFamily: 'var(--font-title)', color: isDark ? '#ffffff' : '#111827' }}>
          {trimmed.replace('### ', '')}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(idx);
      elements.push(
        <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold mt-10 mb-5 tracking-tight" style={{ fontFamily: 'var(--font-title)', color: isDark ? '#ffffff' : '#111827' }}>
          {trimmed.replace('## ', '')}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(idx);
      elements.push(
        <h1 key={idx} className="text-3xl sm:text-4xl font-extrabold mt-12 mb-6 tracking-tight" style={{ fontFamily: 'var(--font-title)', color: isDark ? '#ffffff' : '#111827' }}>
          {trimmed.replace('# ', '')}
        </h1>
      );
      return;
    }

    // Horizontal Rule
    if (trimmed === '---') {
      flushList(idx);
      elements.push(
        <hr key={idx} className="my-8 border-gray-300 dark:border-white/15" />
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList(idx);
      const quoteText = trimmed.replace('> ', '').replace(/^"|"$/g, '');
      elements.push(
        <blockquote key={idx} className="my-6 p-5 rounded-2xl bg-[#a855f7]/10 dark:bg-[#a855f7]/20 border-l-4 border-[#a855f7] italic text-base sm:text-lg font-medium leading-relaxed shadow-sm" style={{ color: isDark ? '#f1f5f9' : '#111827' }}>
          "{quoteText}"
        </blockquote>
      );
      return;
    }

    // Bullet List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      const itemText = trimmed.substring(2);
      listItems.push(
        <li key={idx} className="text-base sm:text-lg leading-relaxed" style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}>
          {parseInlineFormatting(itemText, isDark)}
        </li>
      );
      return;
    }

    // Numbered List
    if (/^\d+\.\s+/.test(trimmed)) {
      flushList(idx);
      elements.push(
        <p key={idx} className="text-base sm:text-lg leading-relaxed my-3 font-medium" style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}>
          {parseInlineFormatting(trimmed, isDark)}
        </p>
      );
      return;
    }

    // Paragraph
    flushList(idx);
    elements.push(
      <p key={idx} className="text-base sm:text-lg leading-relaxed my-4" style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}>
        {parseInlineFormatting(trimmed, isDark)}
      </p>
    );
  });

  flushList(lines.length);

  return elements;
}

function parseInlineFormatting(text: string, isDark: boolean): React.ReactNode {
  const parts = text.split(/(!\[.*?\]\(.*?\)\s*|\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('![') && part.includes('](')) {
      const imgMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        return (
          <span key={i} className="block my-6 rounded-2xl overflow-hidden shadow-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <img src={imgMatch[2]} alt={imgMatch[1] || 'Blog image'} className="w-full h-auto object-cover max-h-[600px]" loading="lazy" />
            {imgMatch[1] && (
              <span className="block text-center text-xs sm:text-sm py-2 px-4 italic text-gray-500 dark:text-gray-400 border-t border-black/5 dark:border-white/5">
                {imgMatch[1]}
              </span>
            )}
          </span>
        );
      }
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold" style={{ color: isDark ? '#ffffff' : '#111827' }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic" style={{ color: isDark ? '#ffffff' : '#111827' }}>{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      let href = linkMatch[2];
      if (href === '/lien-he' || href === '/contact') {
        href = '/?tab=services';
      }
      return (
        <Link key={i} href={href} className="font-bold underline hover:opacity-80 transition-opacity" style={{ color: isDark ? '#c499f5' : '#8b5cf6' }}>
          {linkMatch[1]}
        </Link>
      );
    }
    return part;
  });
}

export default function BlogPostDetailClient({ post }: BlogPostDetailClientProps) {
  const { lang, setLang } = useLang();
  const [isDark, setIsDark] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('creu_site_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.blogPosts)) {
            const found = parsed.blogPosts.find((p: any) => p && p.slug === post.slug);
            if (found) return found;
          }
        }
      } catch (e) {}
    }
    return post;
  });
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('creu_theme');
    if (savedTheme === 'dark' || document.body.classList.contains('dark')) {
      setIsDark(true);
      document.body.classList.add('dark');
    }

    // Dynamic live fetch from /api/blog-posts so Admin edits display instantly!
    fetch('/api/blog-posts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const live = data.find((item: any) => item.slug === post.slug);
          if (live) {
            setCurrentPost(live);
          }
        }
      })
      .catch(() => {});
  }, [post.slug]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('creu_theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('creu_theme', 'light');
    }
  };

  const handleNavTabChange = (tab: string) => {
    if (tab === 'blog') {
      router.push('/blog');
    } else {
      router.push(`/?tab=${tab}`);
    }
  };

  // Explicit language selection with clean fallback to VI
  const isEn = lang === 'en';

  const activeContent = isEn
    ? (currentPost.content_en && currentPost.content_en.trim().length > 0 ? currentPost.content_en : (currentPost.content_vi || currentPost.content))
    : (currentPost.content_vi || currentPost.content);

  const activeTitle = isEn
    ? (currentPost.titleEn && currentPost.titleEn.trim().length > 0 ? currentPost.titleEn : ((currentPost as any).title_en && (currentPost as any).title_en.trim().length > 0 ? (currentPost as any).title_en : currentPost.title))
    : currentPost.title;

  return (
    <main className="relative min-h-screen text-gray-900 dark:text-white">
      <WatermarkLogo3D />

      <Navbar
        currentTab="blog"
        onTabChange={handleNavTabChange}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      <article className="pt-28 pb-20">
        <div className="shell max-w-4xl mx-auto px-4">
          {/* Top Control Bar: Breadcrumb + Language Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
            {/* Breadcrumbs Navigation */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold" style={{ color: isDark ? '#94a3b8' : '#4b5563' }}>
              <Link href="/" className="hover:text-[#a855f7] transition-colors">
                {t('blog.home', lang)}
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-[#a855f7] transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="font-bold truncate max-w-[180px] sm:max-w-md" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                {activeTitle}
              </span>
            </nav>

            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang('vi')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  lang === 'vi'
                    ? 'bg-[#a855f7] text-white shadow-md font-extrabold'
                    : 'bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/10'
                }`}
              >
                🇻🇳 VI
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#a855f7] text-white shadow-md font-extrabold'
                    : 'bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/10'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          {/* Category & Title Header */}
          <div className="space-y-4 mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/30 text-[#a855f7] dark:text-[#c499f5] text-xs font-bold uppercase tracking-wider">
              {currentPost.category}
            </span>

            <h1
              className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-title)', color: isDark ? '#ffffff' : '#111827' }}
            >
              {activeTitle}
            </h1>

            <div className="flex items-center gap-4 text-xs sm:text-sm pt-2 border-b border-gray-200 dark:border-white/10 pb-6" style={{ color: isDark ? '#cbd5e1' : '#4b5563' }}>
              <span>{t('blog.publishedOn', lang)}: <strong style={{ color: isDark ? '#ffffff' : '#111827' }}>{currentPost.date}</strong></span>
              <span>·</span>
              <span>{t('blog.author', lang)}: <strong style={{ color: isDark ? '#ffffff' : '#111827' }}>{currentPost.author || 'CREU Studio'}</strong></span>
            </div>
          </div>

          {/* Featured Thumbnail */}
          {currentPost.thumbnail && (
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl mb-10 border border-black/10 dark:border-white/10 bg-black/10">
              <img
                src={currentPost.thumbnail}
                alt={activeTitle}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Content Wrapped in Translucent Glass Box */}
          <div
            className="shadow-xl space-y-6"
            style={{
              background: isDark ? 'rgba(14, 20, 36, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '24px',
              padding: '2rem',
            }}
          >
            {renderMarkdownContent(activeContent, isDark)}
          </div>

          {/* Footer Back & Share Actions */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb',
                color: isDark ? '#ffffff' : '#111827',
              }}
            >
              {t('blog.backToBlog', lang)}
            </Link>

            <button
              onClick={() => handleNavTabChange('contact')}
              className="px-6 py-3 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              {t('blog.startProject', lang)}
            </button>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
