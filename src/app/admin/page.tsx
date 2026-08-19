'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import defaultSiteData from '@/data/siteData.json';
import BlogEditor from '@/components/BlogEditor';

interface WorkItem {
  id: number;
  title: string;
  categoryText: string;
  categories: string[];
  image: string;
  videoUrl?: string;
  bgClass: string;
  isWide?: boolean;
  description?: string;
  descriptionEn?: string;
  gallery?: string[];
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  roleEn?: string;
  bio: string;
  bioEn?: string;
  image: string;
  bgClass: string;
}

interface PricingItem {
  id: number;
  plan: string;
  title: string;
  copy: string;
  copyEn?: string;
  price: string;
  per: string;
  features: string[];
  featuresEn?: string[];
  popular?: boolean;
  badge?: string;
}

interface SiteConfig {
  title: string;
  heroTitle: string;
  heroDesc: string;
  showreelUrl?: string;
  heroBgImage?: string;
  email: string;
  location: string;
  workingHours: string;
  instagram: string;
  behance: string;
  facebook: string;
}

interface BlogPostItem {
  id: number;
  slug: string;
  title: string;
  titleEn?: string;
  date: string;
  description: string;
  descriptionEn?: string;
  thumbnail: string;
  category: string;
  author: string;
  content: string;
  content_vi?: string;
  content_en?: string;
  contentEn?: string;
  images?: string[]; // Hình ảnh trong bài (img1, img2, img3...)
}

interface SiteData {
  siteConfig: SiteConfig;
  works: WorkItem[];
  pricing: PricingItem[];
  team: TeamMember[];
  blogPosts?: BlogPostItem[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [data, setData] = useState<SiteData>(defaultSiteData as any);
  const [activeTab, setActiveTab] = useState<'works' | 'team' | 'pricing' | 'config' | 'blog' | 'promotion'>('works');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [promotionConfig, setPromotionConfig] = useState<any>({
    announcementBar: {
      enabled: true,
      text: '🎉 MIỄN PHÍ 2 tháng thiết kế Poster & Banner — Ưu đãi đến hết tháng 9/2026',
      textEn: '🎉 FREE 2 months of Poster & Banner design — Offer ends September 2026',
      bgColor: '#7C3AED',
      textColor: '#ffffff',
      ctaText: 'Đăng ký ngay',
      ctaTextEn: 'Register now',
      ctaLink: '/?tab=contact',
      backgroundImage: '',
      height: '80px',
    },
    heroBanner: {
      enabled: true,
      tag: 'KHUYẾN MÃI ĐẶC BIỆT',
      tagEn: 'SPECIAL OFFER',
      title: 'Miễn Phí 2 Tháng Thiết Kế Poster & Banner',
      titleEn: '2 Months Free Poster & Banner Design',
      description: 'Dành cho doanh nghiệp, startup, và đơn vị nhỏ tại TP.HCM. Không giới hạn số lượng. Ưu đãi kết thúc 30/09/2026.',
      descriptionEn: 'For businesses, startups, and small organizations in HCMC. No quantity limit. Offer ends 30/09/2026.',
      ctaText: 'Nhận ưu đãi ngay',
      ctaTextEn: 'Claim offer now',
      ctaLink: '/?tab=contact',
      deadline: '30/09/2026',
      bgGradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
      thumbnail: '',
      backgroundImage: '',
    },
  });

  // New Work Form state
  const [newWork, setNewWork] = useState<{ title: string; categoryText: string; category: string; description: string; image: string; videoUrl: string }>({
    title: '',
    categoryText: '',
    category: 'video',
    description: '',
    image: '',
    videoUrl: '',
  });

  // New Blog Post Form state
  const [newBlogPost, setNewBlogPost] = useState<Omit<BlogPostItem, 'id'>>({
    slug: '',
    title: '',
    titleEn: '',
    date: '',
    description: '',
    descriptionEn: '',
    thumbnail: '',
    category: 'BRAND IDENTITY',
    author: 'CREU Studio',
    content: '',
    contentEn: '',
    images: [],
  });

  useEffect(() => {
    const auth = localStorage.getItem('creu_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    const saved = localStorage.getItem('creu_site_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.siteConfig) setData(parsed);
      } catch {}
    }

    fetch('/api/promotion-config')
      .then((res) => res.json())
      .then((pData) => {
        if (pData && pData.announcementBar && pData.heroBanner) {
          setPromotionConfig(pData);
        }
      })
      .catch(() => {});

    fetch('/api/data')
      .then((res) => res.json())
      .then((d) => {
        if (d && !d.error && d.siteConfig) {
          setData((prev) => {
            const mergedMap = new Map();
            (prev.blogPosts || []).forEach((p) => mergedMap.set(p.slug, p));
            if (Array.isArray(d.blogPosts)) {
              d.blogPosts.forEach((p: any) => {
                if (p && p.slug) mergedMap.set(p.slug, p);
              });
            }
            return {
              ...d,
              blogPosts: Array.from(mergedMap.values()),
            };
          });
          localStorage.setItem('creu_site_data', JSON.stringify(d));
        }
      })
      .catch(() => {});

    fetch('/api/blog-posts')
      .then((res) => res.json())
      .then((posts) => {
        if (Array.isArray(posts) && posts.length > 0) {
          setData((prev) => {
            const existingMap = new Map((prev.blogPosts || []).map((p) => [p.slug, p]));
            posts.forEach((p: any, idx: number) => {
              const slug = p.slug;
              const existing = existingMap.get(slug);
              existingMap.set(slug, {
                id: existing?.id || p.id || (Date.now() + idx),
                slug: p.slug,
                title: existing?.title || p.title || 'Untitled Post',
                titleEn: existing?.titleEn || p.titleEn || p.title_en || '',
                date: existing?.date || p.date || '',
                description: existing?.description || p.description || '',
                descriptionEn: existing?.descriptionEn || p.descriptionEn || p.description_en || '',
                thumbnail: existing?.thumbnail || p.thumbnail || '/creu-logo.png',
                category: existing?.category || p.category || 'GENERAL',
                author: existing?.author || p.author || 'CREU Studio',
                content: existing?.content || p.content_vi || p.content || '',
                content_vi: existing?.content_vi || p.content_vi || p.content || '',
                content_en: existing?.content_en || p.content_en || p.contentEn || '',
                contentEn: existing?.contentEn || p.content_en || p.contentEn || '',
                images: existing?.images || p.images || [],
              });
            });
            return { ...prev, blogPosts: Array.from(existingMap.values()) };
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password === '123455') {
      setIsAuthenticated(true);
      localStorage.setItem('creu_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('✕ ID hoặc Mật khẩu không chính xác. Vui lòng thử lại!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('creu_admin_auth');
  };

  const handleSave = async (updatedData?: SiteData) => {
    setSaving(true);
    setMessage('');
    const payload = updatedData || data;

    try {
      localStorage.setItem('creu_site_data', JSON.stringify(payload));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('LocalStorage error', e);
    }

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 413) {
          setMessage('❌ Lỗi: Dung lượng ảnh quá lớn! Hãy thử chọn ảnh dung lượng nhỏ hơn.');
        } else {
          setMessage(`❌ Lỗi lưu dữ liệu: Mã lỗi ${res.status}`);
        }
        return;
      }

      const resData = await res.json();
      if (resData.kvAvailable === false) {
        setMessage('✓ Đã lưu thay đổi! (Đang chạy ở chế độ Dev)');
      } else {
        setMessage('✓ Đã lưu thay đổi thành công toàn cầu!');
      }
    } catch (err) {
      setMessage('❌ Không thể kết nối máy chủ để lưu thay đổi.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleSavePromotion = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/promotion-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promotionConfig),
      });
      if (res.ok) {
        setMessage('✓ Đã lưu cấu hình Promotion & Banner thành công!');
      } else {
        setMessage('❌ Lỗi khi lưu cấu hình Promotion.');
      }
    } catch (e) {
      setMessage('❌ Lỗi kết nối khi lưu Promotion.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  // High-performance Canvas Image Compressor for Mobile
  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 900;
      const MAX_HEIGHT = 900;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress image to optimized 75% quality JPEG data URL (~60KB)
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.75);
        callback(compressedUrl);
      } else {
        callback(objectUrl);
      }
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080c16] text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#0e1424] border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#c499f5] flex items-center justify-center mx-auto text-2xl font-bold">
              🔐
            </div>
            <h2 className="text-2xl font-bold tracking-wide text-white">Đăng Nhập Admin</h2>
            <p className="text-xs text-gray-400">Quản trị nội dung, Video &amp; Mạng xã hội</p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">ID Đăng Nhập</label>
              <input
                type="text"
                placeholder="Nhập ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#141c30] border border-white/15 rounded-xl text-sm text-white focus:border-[#a855f7] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Mật Khẩu</label>
              <input
                type="password"
                placeholder="Nhập Mật Khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#141c30] border border-white/15 rounded-xl text-sm text-white focus:border-[#a855f7] outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              Đăng Nhập Quản Trị ➔
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition-all">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Work Actions
  const handleAddWork = () => {
    if (!newWork.title) return alert('Vui lòng nhập tên dự án');
    const newItem: WorkItem = {
      id: Date.now(),
      title: newWork.title,
      categoryText: newWork.categoryText || 'Project · 2026',
      categories: [newWork.category],
      image: newWork.image,
      videoUrl: newWork.videoUrl,
      bgClass: 'b' + ((data.works.length % 9) + 1),
      isWide: false,
      description: newWork.description,
    };
    const updated = { ...data, works: [newItem, ...data.works] };
    setData(updated);
    handleSave(updated);
    setNewWork({ title: '', categoryText: '', category: 'video', description: '', image: '', videoUrl: '' });
  };

  const handleDeleteWork = (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa dự án này?')) return;
    const updated = { ...data, works: data.works.filter((w) => w.id !== id) };
    setData(updated);
    handleSave(updated);
  };

  const handleUpdateWorkField = (id: number, field: keyof WorkItem, value: any) => {
    const updatedWorks = data.works.map((w) => (w.id === id ? { ...w, [field]: value } : w));
    const updated = { ...data, works: updatedWorks };
    setData(updated);
    if (field === 'image') {
      handleSave(updated);
    }
  };

  // Team Actions
  const handleUpdateTeam = (id: number, field: keyof TeamMember, value: any) => {
    const updatedTeam = data.team.map((t) => (t.id === id ? { ...t, [field]: value } : t));
    const updated = { ...data, team: updatedTeam };
    setData(updated);
    if (field === 'image') {
      handleSave(updated);
    }
  };

  // Config Actions
  const handleUpdateConfig = (field: keyof SiteConfig, value: string) => {
    const updated = { ...data, siteConfig: { ...data.siteConfig, [field]: value } };
    setData(updated);
  };

  // Blog Post Actions
  const handleAddBlogPost = () => {
    if (!newBlogPost.title) return alert('Vui lòng nhập tiêu đề bài viết');
    const slug = newBlogPost.slug.trim() || newBlogPost.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const date = newBlogPost.date || new Date().toISOString().split('T')[0];

    const newItem: BlogPostItem = {
      id: Date.now(),
      slug,
      title: newBlogPost.title,
      titleEn: newBlogPost.titleEn,
      date,
      description: newBlogPost.description,
      descriptionEn: newBlogPost.descriptionEn,
      thumbnail: newBlogPost.thumbnail || '/creu-logo.png',
      category: newBlogPost.category || 'BRAND IDENTITY',
      author: newBlogPost.author || 'CREU Studio',
      content_vi: newBlogPost.content_vi || newBlogPost.content || '',
      content_en: newBlogPost.content_en || newBlogPost.contentEn || '',
      content: newBlogPost.content_vi || newBlogPost.content || '',
      images: newBlogPost.images || [],
    };

    const currentPosts = data.blogPosts || [];
    const updated = { ...data, blogPosts: [newItem, ...currentPosts] };
    setData(updated);
    handleSave(updated);
    setNewBlogPost({
      slug: '',
      title: '',
      titleEn: '',
      date: '',
      description: '',
      descriptionEn: '',
      thumbnail: '',
      category: 'BRAND IDENTITY',
      author: 'CREU Studio',
      content: '',
      contentEn: '',
      images: [],
    });
  };

  const handleUpdateBlogPostField = (id: number, field: keyof BlogPostItem, value: any) => {
    const currentPosts = data.blogPosts || [];
    const updatedPosts = currentPosts.map((post) => (post.id === id ? { ...post, [field]: value } : post));
    const updated = { ...data, blogPosts: updatedPosts };
    setData(updated);
    if (field === 'thumbnail' || field === 'images') {
      handleSave(updated);
    }
  };

  const handleDeleteBlogPost = (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết blog này?')) return;
    const currentPosts = data.blogPosts || [];
    const updated = { ...data, blogPosts: currentPosts.filter((p) => p.id !== id) };
    setData(updated);
    handleSave(updated);
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-white font-sans pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0e1424]/90 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-wider text-white flex items-center gap-2">
            CREU STUDIO <span className="text-xs bg-[#a855f7] text-white px-2.5 py-0.5 rounded-full font-semibold">ADMIN PANEL</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            >
              {message}
            </motion.div>
          )}

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-6 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md transition-all cursor-pointer"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi 💾'}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-300 rounded-full transition-all border border-white/15"
          >
            Đăng xuất 🚪
          </button>

          <Link href="/" className="px-4 py-2.5 text-xs text-gray-300 hover:text-white border border-white/20 rounded-full font-medium transition-all">
            Xem trang Web ↗
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* Navigation Tabs */}
        <div className="flex gap-3 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
          {[
            { id: 'works', label: '📂 Quản lý Dự án & Video' },
            { id: 'blog', label: '📝 Quản lý Bài viết Blog' },
            { id: 'promotion', label: '🎯 Promotion & Banner' },
            { id: 'team', label: '👥 Thành viên Team' },
            { id: 'pricing', label: '💳 Gói giá Partnership' },
            { id: 'config', label: '⚙️ Showreel Video & Link Mạng Xã Hội' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#a855f7] text-white shadow-lg shadow-purple-500/30'
                  : 'bg-[#0e1424] text-gray-400 border border-white/10 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: WORKS MANAGER */}
        {activeTab === 'works' && (
          <div className="space-y-8">
            <div className="bg-[#0e1424] p-6 rounded-2xl border border-white/15 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-[#c499f5] flex items-center gap-2">
                <span>➕</span> Thêm Dự Án Mới (Hình Ảnh &amp; Video)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Tên Dự án</label>
                  <input
                    type="text"
                    placeholder="VD: Mộc Coffee Rebrand"
                    value={newWork.title}
                    onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Phân loại &amp; Năm</label>
                  <input
                    type="text"
                    placeholder="VD: Brand Identity · 2026"
                    value={newWork.categoryText}
                    onChange={(e) => setNewWork({ ...newWork, categoryText: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Thể loại bộ lọc</label>
                  <select
                    value={newWork.category}
                    onChange={(e) => setNewWork({ ...newWork, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  >
                    <option value="video">Video Production</option>
                    <option value="photo">Photography</option>
                    <option value="design">Graphic Design</option>
                    <option value="brand">Brand Identity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🎬 Link Video (YouTube / Vimeo / MP4)</label>
                  <input
                    type="text"
                    placeholder="VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    value={newWork.videoUrl}
                    onChange={(e) => setNewWork({ ...newWork, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-[#a855f7]/50 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Upload Hình ảnh đại diện</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(e.target.files[0], (url) => setNewWork({ ...newWork, image: url }));
                        }
                      }}
                      className="text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#a855f7] file:text-white hover:file:bg-[#9333ea]"
                    />
                    {newWork.image && <span className="text-xs text-emerald-400 font-bold">✓ Đã chọn ảnh</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddWork}
                className="mt-2 px-5 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer shadow-lg"
              >
                Thêm dự án vào danh sách
              </button>
            </div>

            <div className="bg-[#0e1424] p-6 rounded-2xl border border-white/15 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">📋 Danh sách Dự Án Currently ({data.works.length})</h3>
              <div className="space-y-4">
                {data.works.map((work) => (
                  <div key={work.id} className="p-4 border border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-[#141c30]/60">
                    <div className="flex items-center gap-4 flex-1">
                      {work.image ? (
                        <img src={work.image} alt={work.title} className="w-16 h-12 object-cover rounded-lg border border-white/20" />
                      ) : (
                        <div className={`w-16 h-12 rounded-lg ${work.bgClass || 'bg-purple-900'} flex items-center justify-center text-xs font-bold text-white`}>
                          CREU
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={work.title}
                            onChange={(e) => handleUpdateWorkField(work.id, 'title', e.target.value)}
                            className="font-bold text-sm bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#a855f7] outline-none text-white w-1/2"
                          />
                          <input
                            type="text"
                            value={work.categoryText}
                            onChange={(e) => handleUpdateWorkField(work.id, 'categoryText', e.target.value)}
                            className="text-xs text-gray-400 bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#a855f7] outline-none w-1/2"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-purple-300 mr-2">🎬 Link Video:</label>
                          <input
                            type="text"
                            placeholder="Dán link Video (YouTube/Vimeo)"
                            value={work.videoUrl || ''}
                            onChange={(e) => handleUpdateWorkField(work.id, 'videoUrl', e.target.value)}
                            className="text-xs text-purple-200 bg-[#0e1424] border border-white/15 px-3 py-1 rounded-lg focus:border-[#a855f7] outline-none w-full"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Mô Tả Chi Tiết (VI)</label>
                            <textarea
                              value={work.description || ''}
                              onChange={(e) => handleUpdateWorkField(work.id, 'description', e.target.value)}
                              rows={2}
                              placeholder="Mô tả dự án tiếng Việt..."
                              className="w-full px-3 py-1.5 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-purple-300 mb-1">🇬🇧 Mô Tả Chi Tiết (EN)</label>
                            <textarea
                              value={work.descriptionEn || ''}
                              onChange={(e) => handleUpdateWorkField(work.id, 'descriptionEn', e.target.value)}
                              rows={2}
                              placeholder="English project description..."
                              className="w-full px-3 py-1.5 bg-[#0e1424] border border-purple-500/30 rounded-lg text-xs text-purple-200 focus:border-[#a855f7] outline-none resize-none"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[10px] uppercase font-bold text-purple-300 mb-1">🖼️ Gallery Ảnh (Mỗi dòng 1 link URL ảnh)</label>
                            <textarea
                              value={(work.gallery || []).join('\n')}
                              onChange={(e) => {
                                const lines = e.target.value.split('\n').filter(Boolean);
                                handleUpdateWorkField(work.id, 'gallery', lines);
                              }}
                              rows={3}
                              placeholder="https://image1.jpg&#10;https://image2.jpg"
                              className="w-full px-3 py-1.5 bg-[#0e1424] border border-purple-500/30 rounded-lg text-xs text-purple-200 focus:border-[#a855f7] outline-none resize-none font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-300 cursor-pointer flex items-center gap-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], (url) => handleUpdateWorkField(work.id, 'image', url));
                            }
                          }}
                          className="hidden"
                        />
                        <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20">Thay Ảnh 📷</span>
                      </label>

                      <button
                        onClick={() => handleDeleteWork(work.id)}
                        className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-bold rounded-lg transition-all"
                      >
                        Xóa 🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB PROMOTION & BANNER */}
        {activeTab === 'promotion' && (
          <div className="space-y-8">
            {/* Announcement Bar Form Box */}
            <div className="bg-[#0e1424] p-6 rounded-2xl border border-white/15 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#c499f5] flex items-center gap-2">
                    <span>📢</span> Announcement Bar (Thanh thông báo nổi đầu trang)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Hiển thị thanh ngang trên cùng của website</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-[#141c30] px-4 py-2 rounded-xl border border-white/15">
                  <input
                    type="checkbox"
                    checked={promotionConfig.announcementBar.enabled}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        announcementBar: { ...promotionConfig.announcementBar, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 accent-[#a855f7] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-white">Bật Announcement Bar</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Nội dung Text (VI)</label>
                  <input
                    type="text"
                    value={promotionConfig.announcementBar.text}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        announcementBar: { ...promotionConfig.announcementBar, text: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 Text Content (EN)</label>
                  <input
                    type="text"
                    value={promotionConfig.announcementBar.textEn}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        announcementBar: { ...promotionConfig.announcementBar, textEn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-purple-500/30 rounded-lg text-sm text-purple-200 focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Màu Nền (Background Color)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={promotionConfig.announcementBar.bgColor || '#7C3AED'}
                      onChange={(e) =>
                        setPromotionConfig({
                          ...promotionConfig,
                          announcementBar: { ...promotionConfig.announcementBar, bgColor: e.target.value },
                        })
                      }
                      className="w-10 h-9 bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={promotionConfig.announcementBar.bgColor}
                      onChange={(e) =>
                        setPromotionConfig({
                          ...promotionConfig,
                          announcementBar: { ...promotionConfig.announcementBar, bgColor: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Màu Chữ (Text Color)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={promotionConfig.announcementBar.textColor || '#ffffff'}
                      onChange={(e) =>
                        setPromotionConfig({
                          ...promotionConfig,
                          announcementBar: { ...promotionConfig.announcementBar, textColor: e.target.value },
                        })
                      }
                      className="w-10 h-9 bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={promotionConfig.announcementBar.textColor}
                      onChange={(e) =>
                        setPromotionConfig({
                          ...promotionConfig,
                          announcementBar: { ...promotionConfig.announcementBar, textColor: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Nút CTA Text (VI)</label>
                  <input
                    type="text"
                    value={promotionConfig.announcementBar.ctaText}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        announcementBar: { ...promotionConfig.announcementBar, ctaText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 CTA Text (EN)</label>
                  <input
                    type="text"
                    value={promotionConfig.announcementBar.ctaTextEn}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        announcementBar: { ...promotionConfig.announcementBar, ctaTextEn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-purple-500/30 rounded-lg text-sm text-purple-200 focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Link Nút CTA (Link khi click)</label>
                  <input
                    type="text"
                    value={promotionConfig.announcementBar.ctaLink}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        announcementBar: { ...promotionConfig.announcementBar, ctaLink: e.target.value },
                      })
                    }
                    placeholder="/?tab=contact"
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🖼️ Background Image URL (bar.png)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="VD: https://res.cloudinary.com/.../bar.png"
                      value={promotionConfig.announcementBar.backgroundImage || ''}
                      onChange={(e) =>
                        setPromotionConfig({
                          ...promotionConfig,
                          announcementBar: { ...promotionConfig.announcementBar, backgroundImage: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                    />
                    <label className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], (url) =>
                              setPromotionConfig({
                                ...promotionConfig,
                                announcementBar: { ...promotionConfig.announcementBar, backgroundImage: url },
                              })
                            );
                          }
                        }}
                        className="hidden"
                      />
                      Upload 📷
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setPromotionConfig((prev: any) => ({
                          ...prev,
                          announcementBar: {
                            ...prev.announcementBar,
                            backgroundImage: '',
                          },
                        }))
                      }
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255,0,0,0.15)',
                        border: '1px solid rgba(255,0,0,0.3)',
                        color: '#ff6b6b',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Xóa ảnh 🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Cat Playground Toggle Box */}
            <div className="bg-[#0e1424] p-6 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                    <span>🐱</span> Giao diện Mèo 3D (3D Cat Playground Hero)
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    Bật/Tắt giao diện phòng 3D với 2 chú mèo tương tác tự chủ trên trang chủ. Khi TẮT, trang chủ sẽ dùng Giao diện 2/9 / Hình ảnh Hero / Video Box.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-[#141c30] px-4 py-2 rounded-xl border border-amber-500/40 hover:bg-amber-500/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={promotionConfig.catPlayground?.enabled !== false}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        catPlayground: { enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-amber-200">Bật Giao diện Mèo 3D 🐈</span>
                </label>
              </div>
            </div>

            {/* Hero Banner Form Box */}
            <div className="bg-[#0e1424] p-6 rounded-2xl border border-white/15 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#c499f5] flex items-center gap-2">
                    <span>🖼️</span> Hero Banner Section (Banner lớn trang chủ)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Hiển thị section Banner khuyến mãi trên trang chủ</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-[#141c30] px-4 py-2 rounded-xl border border-white/15">
                  <input
                    type="checkbox"
                    checked={promotionConfig.heroBanner.enabled}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 accent-[#a855f7] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-white">Bật Hero Banner</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Tag Nhỏ (VI)</label>
                  <input
                    type="text"
                    value={promotionConfig.heroBanner.tag}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, tag: e.target.value },
                      })
                    }
                    placeholder="KHUYẾN MÃI ĐẶC BIỆT"
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 Tag (EN)</label>
                  <input
                    type="text"
                    value={promotionConfig.heroBanner.tagEn}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, tagEn: e.target.value },
                      })
                    }
                    placeholder="SPECIAL OFFER"
                    className="w-full px-3 py-2 bg-[#141c30] border border-purple-500/30 rounded-lg text-sm text-purple-200 focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Tiêu Đề Lớn (VI)</label>
                  <input
                    type="text"
                    value={promotionConfig.heroBanner.title}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 Title (EN)</label>
                  <input
                    type="text"
                    value={promotionConfig.heroBanner.titleEn}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, titleEn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-purple-500/30 rounded-lg text-sm text-purple-200 focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Mô Tả (VI)</label>
                  <textarea
                    rows={3}
                    value={promotionConfig.heroBanner.description}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 Description (EN)</label>
                  <textarea
                    rows={3}
                    value={promotionConfig.heroBanner.descriptionEn}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, descriptionEn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-purple-500/30 rounded-lg text-sm text-purple-200 focus:border-[#a855f7] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Hạn Ưu Đãi (Deadline)</label>
                  <input
                    type="text"
                    value={promotionConfig.heroBanner.deadline}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, deadline: e.target.value },
                      })
                    }
                    placeholder="30/09/2026"
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Link Nút CTA</label>
                  <input
                    type="text"
                    value={promotionConfig.heroBanner.ctaLink}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, ctaLink: e.target.value },
                      })
                    }
                    placeholder="/?tab=contact"
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Nút CTA Text (VI)</label>
                  <input
                    type="text"
                    value={promotionConfig.heroBanner.ctaText}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, ctaText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 CTA Text (EN)</label>
                  <input
                    type="text"
                    value={promotionConfig.heroBanner.ctaTextEn}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, ctaTextEn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#141c30] border border-purple-500/30 rounded-lg text-sm text-purple-200 focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Màu Nền Gradient (bgGradient)</label>
                  <input
                    type="text"
                    value={promotionConfig.heroBanner.bgGradient}
                    onChange={(e) =>
                      setPromotionConfig({
                        ...promotionConfig,
                        heroBanner: { ...promotionConfig.heroBanner, bgGradient: e.target.value },
                      })
                    }
                    placeholder="linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)"
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🖼️ Background Image Banner URL (banner.png)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="VD: https://res.cloudinary.com/.../banner.png"
                      value={promotionConfig.heroBanner.backgroundImage || ''}
                      onChange={(e) =>
                        setPromotionConfig({
                          ...promotionConfig,
                          heroBanner: { ...promotionConfig.heroBanner, backgroundImage: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                    />
                    <label className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], (url) =>
                              setPromotionConfig({
                                ...promotionConfig,
                                heroBanner: { ...promotionConfig.heroBanner, backgroundImage: url },
                              })
                            );
                          }
                        }}
                        className="hidden"
                      />
                      Upload 📷
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setPromotionConfig((prev: any) => ({
                          ...prev,
                          heroBanner: {
                            ...prev.heroBanner,
                            backgroundImage: '',
                          },
                        }))
                      }
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255,0,0,0.15)',
                        border: '1px solid rgba(255,0,0,0.3)',
                        color: '#ff6b6b',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Xóa ảnh 🗑️
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleSavePromotion}
                  disabled={saving}
                  className="px-8 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  {saving ? 'Đang lưu...' : 'Lưu Cấu Hình Promotion & Banner 🚀'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEAM MANAGER */}
        {activeTab === 'team' && (
          <div className="bg-[#0e1424] p-6 rounded-2xl border border-white/15 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white">👥 Thông Tin Đội Ngũ CREU Studio</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.team.map((member) => (
                <div key={member.id} className="p-5 border border-white/10 rounded-xl bg-[#141c30]/60 space-y-4">
                  <div className="relative group">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-48 object-cover rounded-xl border border-white/20" />
                    ) : (
                      <div className={`w-full h-48 rounded-xl ${member.bgClass || 'bg-purple-900'} flex items-center justify-center font-bold text-white`}>
                        {member.name}
                      </div>
                    )}
                    <label className="absolute bottom-3 right-3 bg-[#0e1424]/90 backdrop-blur-md text-xs px-3 py-1.5 rounded-lg border border-white/20 font-bold cursor-pointer hover:bg-[#0e1424] text-white">
                      Đổi Ảnh 📷
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], (url) => handleUpdateTeam(member.id, 'image', url));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Tên Thành Viên</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleUpdateTeam(member.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-sm font-bold text-white focus:border-[#a855f7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Chức Danh</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleUpdateTeam(member.id, 'role', e.target.value)}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-xs font-semibold text-white focus:border-[#a855f7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Tiểu sử Tiếng Việt (Bio VI)</label>
                    <textarea
                      value={member.bio}
                      onChange={(e) => handleUpdateTeam(member.id, 'bio', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 Bio Tiếng Anh (Bio EN)</label>
                    <textarea
                      value={member.bioEn || ''}
                      onChange={(e) => handleUpdateTeam(member.id, 'bioEn', e.target.value)}
                      rows={2}
                      placeholder="English biography..."
                      className="w-full px-3 py-2 bg-[#0e1424] border border-purple-500/30 rounded-lg text-xs text-purple-200 focus:border-[#a855f7] outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRICING MANAGER */}
        {activeTab === 'pricing' && (
          <div className="bg-[#0e1424] p-6 rounded-2xl border border-white/15 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white">💳 Quản Lý Gói Dịch Vụ Partnership</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.pricing.map((card) => (
                <div key={card.id} className="p-5 border border-white/10 rounded-xl bg-[#141c30]/60 space-y-3">
                  <div className="text-xs uppercase font-bold text-[#c499f5]">{card.plan}</div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Tên Gói</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = data.pricing.map((p) => (p.id === card.id ? { ...p, title: e.target.value } : p));
                        setData({ ...data, pricing: updated });
                      }}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-sm font-bold text-white focus:border-[#a855f7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Giá Tiền</label>
                    <input
                      type="text"
                      value={card.price}
                      onChange={(e) => {
                        const updated = data.pricing.map((p) => (p.id === card.id ? { ...p, price: e.target.value } : p));
                        setData({ ...data, pricing: updated });
                      }}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-sm font-bold text-white focus:border-[#a855f7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Mô tả (VI)</label>
                    <textarea
                      value={card.copy}
                      onChange={(e) => {
                        const updated = data.pricing.map((p) => (p.id === card.id ? { ...p, copy: e.target.value } : p));
                        setData({ ...data, pricing: updated });
                      }}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 Mô tả Tiếng Anh (Copy EN)</label>
                    <textarea
                      value={card.copyEn || ''}
                      onChange={(e) => {
                        const updated = data.pricing.map((p) => (p.id === card.id ? { ...p, copyEn: e.target.value } : p));
                        setData({ ...data, pricing: updated });
                      }}
                      rows={2}
                      placeholder="English copy..."
                      className="w-full px-3 py-2 bg-[#0e1424] border border-purple-500/30 rounded-lg text-xs text-purple-200 focus:border-[#a855f7] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 Quyền lợi Tiếng Anh (Features EN - Mỗi dòng 1 quyền lợi)</label>
                    <textarea
                      value={(card.featuresEn || []).join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        const updated = data.pricing.map((p) => (p.id === card.id ? { ...p, featuresEn: lines } : p));
                        setData({ ...data, pricing: updated });
                      }}
                      rows={4}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full px-3 py-2 bg-[#0e1424] border border-purple-500/30 rounded-lg text-xs text-purple-200 focus:border-[#a855f7] outline-none resize-none font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GENERAL CONFIG, SHOWREEL & SOCIAL LINKS */}
        {activeTab === 'config' && (
          <div className="bg-[#0e1424] p-6 rounded-2xl border border-white/15 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white">⚙️ Showreel Video &amp; Cấu Hình Mạng Xã Hội</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🎬 Link Video Showreel Hero (YouTube / Vimeo / MP4)</label>
                <input
                  type="text"
                  placeholder="VD: https://www.youtube.com/embed/dQw4w9WgXcQ"
                  value={data.siteConfig.showreelUrl || ''}
                  onChange={(e) => handleUpdateConfig('showreelUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-[#141c30] border border-[#a855f7]/60 rounded-xl text-sm font-semibold text-white focus:border-[#a855f7] outline-none shadow-inner"
                />
              </div>

              {/* HERO EVENT BACKGROUND IMAGE CONTROL BOX */}
              <div className="md:col-span-2 p-5 rounded-xl bg-[#141c30] border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase font-bold text-amber-300 flex items-center gap-2">
                    <span>🖼️ Ảnh Nền Hero Sự Kiện / Lễ (Ví dụ 2/9, Tết, Giáng Sinh...)</span>
                  </h4>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    data.siteConfig.heroBgImage ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {data.siteConfig.heroBgImage ? '✨ Đang bật: Ảnh nền Full-bleed (Ẩn box video)' : '🎬 Đang dùng: Giao diện gốc (Có Box Video)'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="VD: /images/hero-29.webp hoặc https://res.cloudinary.com/..."
                    value={data.siteConfig.heroBgImage || ''}
                    onChange={(e) => handleUpdateConfig('heroBgImage', e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#0e1424] border border-white/15 rounded-xl text-xs font-semibold text-white focus:border-[#a855f7] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdateConfig('heroBgImage', '/images/hero-29.webp')}
                    className="px-3.5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    title="Đặt lại hình 2/9"
                  >
                    🚩 Đặt hình 2/9
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateConfig('heroBgImage', '')}
                    className="px-3.5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    title="Xóa hình để quay về giao diện gốc có Box Video"
                  >
                    🗑️ Xóa (Về giao diện gốc)
                  </button>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  💡 <b>Cách hoạt động:</b> Khi ô này chứa đường dẫn/URL hình ảnh, giao diện Hero sẽ tự động chuyển sang <b>Full-bleed Image Mode</b> và ẩn box video. Khi <b>xóa rỗng</b> ô này, Hero sẽ tự động quay trở lại <b>Giao diện gốc có Box Video Showreel</b>.
                </p>
              </div>

              {/* SOCIAL MEDIA LINKS EDIT BOX */}
              <div className="md:col-span-2 p-5 rounded-xl bg-[#141c30] border border-purple-500/30 space-y-4">
                <h4 className="text-xs uppercase font-bold text-[#c499f5]">🔗 Link Mạng Xã Hội (Hiển thị ở Liên Hệ &amp; Chân Trang)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">📸 Link Instagram</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/creustudio"
                      value={data.siteConfig.instagram || ''}
                      onChange={(e) => handleUpdateConfig('instagram', e.target.value)}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">🎨 Link Behance</label>
                    <input
                      type="text"
                      placeholder="https://behance.net/creustudio"
                      value={data.siteConfig.behance || ''}
                      onChange={(e) => handleUpdateConfig('behance', e.target.value)}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">👍 Link Facebook</label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/creustudio"
                      value={data.siteConfig.facebook || ''}
                      onChange={(e) => handleUpdateConfig('facebook', e.target.value)}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Email Liên Hệ</label>
                <input
                  type="email"
                  value={data.siteConfig.email}
                  onChange={(e) => handleUpdateConfig('email', e.target.value)}
                  className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Địa Chỉ Studio</label>
                <input
                  type="text"
                  value={data.siteConfig.location}
                  onChange={(e) => handleUpdateConfig('location', e.target.value)}
                  className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Giờ Làm Việc</label>
                <input
                  type="text"
                  value={data.siteConfig.workingHours}
                  onChange={(e) => handleUpdateConfig('workingHours', e.target.value)}
                  className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Mô tả Giới thiệu Trang chủ</label>
                <textarea
                  value={data.siteConfig.heroDesc}
                  onChange={(e) => handleUpdateConfig('heroDesc', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BLOG POSTS */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            {/* Create New Blog Post Box */}
            <div className="p-6 bg-[#0e1424] border border-[#a855f7]/30 rounded-2xl shadow-xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <span>➕ Thêm Bài Viết Blog Mới</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Tiêu đề bài viết (*)</label>
                  <input
                    type="text"
                    placeholder="VD: Bí Quyết Thiết Kế Nhận Diện Thương Hiệu 2026..."
                    value={newBlogPost.title}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Phân loại (Category)</label>
                  <input
                    type="text"
                    placeholder="VD: BRAND IDENTITY, VIDEO PRODUCTION..."
                    value={newBlogPost.category}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Slug URL (Tùy chỉnh hoặc tự động)</label>
                  <input
                    type="text"
                    placeholder="VD: thiet-ke-brand-identity-2026"
                    value={newBlogPost.slug}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Ngày đăng</label>
                  <input
                    type="date"
                    value={newBlogPost.date}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Tác giả</label>
                  <input
                    type="text"
                    placeholder="VD: CREU Studio"
                    value={newBlogPost.author}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Hình ảnh đại diện (Thumbnail URL / File Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="VD: https://images.unsplash.com/... hoặc chọn upload bên cạnh"
                    value={newBlogPost.thumbnail}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none"
                  />
                  <label className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(e.target.files[0], (url) => setNewBlogPost((prev) => ({ ...prev, thumbnail: url })));
                        }
                      }}
                      className="hidden"
                    />
                    Upload Ảnh 📷
                  </label>
                </div>
              </div>

              {/* 📸 Image Gallery Manager for New Post */}
              <div className="p-4 bg-[#1a2332] border border-[#a855f7]/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase font-bold text-[#c499f5]">📸 Hình Trong Bài (img1, img2, img3...)</label>
                  <span className="text-[10px] text-gray-400">({newBlogPost.images?.length || 0}/5)</span>
                </div>

                {/* Upload Button */}
                <label className="block px-3 py-2 bg-[#a855f7]/20 border border-[#a855f7]/40 hover:bg-[#a855f7]/30 text-[#c499f5] text-xs font-semibold cursor-pointer rounded-lg text-center transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0], (url) => {
                          const currentImages = newBlogPost.images || [];
                          if (currentImages.length < 5) {
                            const newImages = [...currentImages, url];
                            setNewBlogPost({ ...newBlogPost, images: newImages });
                          } else {
                            alert('Tối đa 5 hình trên bài viết!');
                          }
                        });
                      }
                    }}
                    className="hidden"
                  />
                  + Thêm Hình
                </label>

                {/* Image Preview Gallery */}
                {newBlogPost.images && newBlogPost.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {newBlogPost.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={imgUrl}
                          alt={`img${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-white/10"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 rounded-lg transition-all">
                          <button
                            onClick={() => {
                              const newImages = newBlogPost.images?.filter((_, i) => i !== idx);
                              setNewBlogPost({ ...newBlogPost, images: newImages });
                            }}
                            className="px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded hover:bg-rose-600"
                          >
                            Xóa
                          </button>
                          <span className="text-white text-[10px] font-semibold">img{idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-xs">Chưa có hình nào. Bấm thêm hình để upload.</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Mô tả ngắn (VI)</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả ngắn tiếng Việt..."
                    value={newBlogPost.description}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-white/15 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 Short Description (EN)</label>
                  <textarea
                    rows={2}
                    placeholder="English short description..."
                    value={newBlogPost.descriptionEn || ''}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, descriptionEn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-purple-500/30 rounded-lg text-sm text-purple-200 focus:border-[#a855f7] outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇻🇳 Nội dung bài viết (VI - Markdown)</label>
                  <textarea
                    rows={8}
                    placeholder="Nhập nội dung tiếng Việt..."
                    value={newBlogPost.content}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-purple-500/30 rounded-lg text-sm text-white focus:border-[#a855f7] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-purple-300 mb-1">🇬🇧 Detailed Content (EN - Markdown)</label>
                  <textarea
                    rows={8}
                    placeholder="Enter English markdown content..."
                    value={newBlogPost.contentEn || ''}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, contentEn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141c30] border border-purple-500/30 rounded-lg text-sm text-purple-200 focus:border-[#a855f7] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleAddBlogPost}
                  className="px-6 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  Thêm Bài Viết Mới 🚀
                </button>
              </div>
            </div>

            {/* List of Existing Blog Posts */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                📝 Danh Sách Bài Viết Blog ({data.blogPosts?.length || 0})
              </h2>

              {(!data.blogPosts || data.blogPosts.length === 0) ? (
                <div className="p-8 text-center bg-[#0e1424] border border-white/10 rounded-2xl text-gray-400 text-xs">
                  Chưa có bài viết blog nào được tạo từ Admin Panel.
                </div>
              ) : (
                <div className="space-y-6">
                  {data.blogPosts.map((post) => (
                    <BlogEditor
                      key={post.id}
                      post={post}
                      onUpdateField={handleUpdateBlogPostField}
                      onDelete={handleDeleteBlogPost}
                      onImageUpload={handleImageUpload}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
