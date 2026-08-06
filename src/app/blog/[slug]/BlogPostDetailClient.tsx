'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WatermarkLogo3D from '@/components/WatermarkLogo3D';
import { useLang } from '@/context/LangContext';
import { Post } from '@/lib/posts';

interface BlogPostDetailClientProps {
  post: Post;
}

// Simple & clean Markdown renderer for blog posts
function renderMarkdownContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (keyPrefix: number) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${keyPrefix}`} className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
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
        <h3 key={idx} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>
          {trimmed.replace('### ', '')}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(idx);
      elements.push(
        <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-10 mb-5 tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>
          {trimmed.replace('## ', '')}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(idx);
      elements.push(
        <h1 key={idx} className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-12 mb-6 tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>
          {trimmed.replace('# ', '')}
        </h1>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList(idx);
      const quoteText = trimmed.replace('> ', '').replace(/^"|"$/g, '');
      elements.push(
        <blockquote key={idx} className="my-6 p-5 rounded-2xl bg-[#a855f7]/10 border-l-4 border-[#a855f7] italic text-gray-800 dark:text-gray-200 text-base sm:text-lg font-medium leading-relaxed">
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
        <li key={idx} className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {parseInlineFormatting(itemText)}
        </li>
      );
      return;
    }

    // Paragraph
    flushList(idx);
    elements.push(
      <p key={idx} className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed my-4">
        {parseInlineFormatting(trimmed)}
      </p>
    );
  });

  flushList(lines.length);

  return elements;
}

function parseInlineFormatting(text: string): React.ReactNode {
  // Simple bold formatting **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
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

  return (
    <main className="relative min-h-screen">
      <WatermarkLogo3D />

      <Navbar
        currentTab="blog"
        onTabChange={handleNavTabChange}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      <article className="pt-28 pb-20">
        <div className="shell max-w-4xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-8">
            <Link href="/" className="hover:text-[#a855f7] transition-colors">
              {lang === 'en' ? 'Home' : 'Trang chủ'}
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#a855f7] transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-200 truncate max-w-[200px] sm:max-w-md">
              {post.title}
            </span>
          </nav>

          {/* Category & Title Header */}
          <div className="space-y-4 mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/30 text-[#a855f7] dark:text-[#c499f5] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight" style={{ fontFamily: 'var(--font-title)' }}>
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 pt-2 border-b border-gray-200 dark:border-white/10 pb-6">
              <span>{lang === 'en' ? 'Published on' : 'Đăng ngày'}: <strong>{post.date}</strong></span>
              <span>·</span>
              <span>{lang === 'en' ? 'Author' : 'Tác giả'}: <strong>{post.author || 'CREU Studio'}</strong></span>
            </div>
          </div>

          {/* Featured Thumbnail */}
          {post.thumbnail && (
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl mb-12 border border-white/10 bg-black/20">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            {renderMarkdownContent(post.content)}
          </div>

          {/* Footer Back & Share Actions */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/20 transition-all shadow-md"
            >
              {lang === 'en' ? '← Back to Blog' : '← Quay lại Blog'}
            </Link>

            <button
              onClick={() => handleNavTabChange('contact')}
              className="px-6 py-3 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              {lang === 'en' ? 'Start a Project ↗' : 'Bắt đầu dự án ↗'}
            </button>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
