'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BlogPage from '@/components/BlogPage';
import WatermarkLogo3D from '@/components/WatermarkLogo3D';
import AnnouncementBar from '@/components/AnnouncementBar';
import { Post } from '@/lib/posts';
import { useRouter } from 'next/navigation';

interface BlogPageClientProps {
  initialPosts: Post[];
}

export default function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const [isDark, setIsDark] = useState(false);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const router = useRouter();

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('creu_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }

    // Dynamic live fetch from /api/blog-posts so Admin edits display instantly!
    fetch('/api/blog-posts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      })
      .catch(() => {});
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
    if (tab === 'blog') return;
    router.push(`/?tab=${tab}`);
  };

  return (
    <main className="relative min-h-screen">
      <AnnouncementBar />
      <WatermarkLogo3D />
      <Navbar
        currentTab="blog"
        onTabChange={handleNavTabChange}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />
      <BlogPage posts={posts} />
    </main>
  );
}
