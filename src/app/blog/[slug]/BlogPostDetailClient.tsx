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

function renderMarkdownContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (keyPrefix: number) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${keyPrefix}`} className="list-disc list-inside space-y-2.5 my-5 text-[#1f2937] dark:text-gray-200">
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

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList(idx);
      elements.push(
        <h3 key={idx} className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white mt-8 mb-4 tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>
          {trimmed.replace('### ', '')}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(idx);
      elements.push(
        <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white mt-10 mb-5 tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>
          {trimmed.replace('## ', '')}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(idx);
      elements.push(
        <h1 key={idx} className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white mt-12 mb-6 tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>
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
        <blockquote key={idx} className="my-6 p-5 rounded-2xl bg-[#a855f7]/10 dark:bg-[#a855f7]/20 border-l-4 border-[#a855f7] italic text-[#111827] dark:text-gray-100 text-base sm:text-lg font-medium leading-relaxed shadow-sm">
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
        <li key={idx} className="text-base sm:text-lg text-[#1f2937] dark:text-gray-200 leading-relaxed">
          {parseInlineFormatting(itemText)}
        </li>
      );
      return;
    }

    // Numbered List
    if (/^\d+\.\s+/.test(trimmed)) {
      flushList(idx);
      elements.push(
        <p key={idx} className="text-base sm:text-lg text-[#1f2937] dark:text-gray-200 leading-relaxed my-3 font-medium">
          {parseInlineFormatting(trimmed)}
        </p>
      );
      return;
    }

    // Paragraph
    flushList(idx);
    elements.push(
      <p key={idx} className="text-base sm:text-lg text-[#1f2937] dark:text-gray-200 leading-relaxed my-4">
        {parseInlineFormatting(trimmed)}
      </p>
    );
  });

  flushList(lines.length);

  return elements;
}

function parseInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-[#111827] dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-[#111827] dark:text-white">{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <Link key={i} href={linkMatch[2]} className="text-[#a855f7] dark:text-[#c499f5] font-bold underline hover:opacity-80">
          {linkMatch[1]}
        </Link>
      );
    }
    return part;
  });
}

export default function BlogPostDetailClient({ post }: BlogPostDetailClientProps) {
  const { lang } = useLang();
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('creu_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
  }, []);

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

  const activeTitle = (lang === 'en' && post.titleEn) ? post.titleEn : post.title;
  const activeContent = (lang === 'en' && post.contentEn) ? post.contentEn : post.content;

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
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-8">
            <Link href="/" className="hover:text-[#a855f7] transition-colors">
              {t('blog.home', lang)}
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#a855f7] transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-[#111827] dark:text-gray-100 font-bold truncate max-w-[200px] sm:max-w-md">
              {activeTitle}
            </span>
          </nav>

          {/* Category & Title Header */}
          <div className="space-y-4 mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/30 text-[#a855f7] dark:text-[#c499f5] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111827] dark:text-white tracking-tight leading-tight" style={{ fontFamily: 'var(--font-title)' }}>
              {activeTitle}
            </h1>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 pt-2 border-b border-gray-200 dark:border-white/10 pb-6">
              <span>{t('blog.publishedOn', lang)}: <strong className="text-[#111827] dark:text-white">{post.date}</strong></span>
              <span>·</span>
              <span>{t('blog.author', lang)}: <strong className="text-[#111827] dark:text-white">{post.author || 'CREU Studio'}</strong></span>
            </div>
          </div>

          {/* Featured Thumbnail */}
          {post.thumbnail && (
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl mb-10 border border-black/10 dark:border-white/10 bg-black/10">
              <img
                src={post.thumbnail}
                alt={activeTitle}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Content Wrapped in Frosted Glass Box */}
          <div className="bg-white/90 dark:bg-[#0e1424]/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
            {renderMarkdownContent(activeContent)}
          </div>

          {/* Footer Back & Share Actions */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/20 transition-all shadow-md"
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
