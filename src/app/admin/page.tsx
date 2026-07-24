'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import defaultSiteData from '@/data/siteData.json';

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
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  bgClass: string;
}

interface PricingItem {
  id: number;
  plan: string;
  title: string;
  copy: string;
  price: string;
  per: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

interface SiteConfig {
  title: string;
  heroTitle: string;
  heroDesc: string;
  showreelUrl?: string;
  email: string;
  location: string;
  workingHours: string;
  instagram: string;
  behance: string;
  facebook: string;
}

interface SiteData {
  siteConfig: SiteConfig;
  works: WorkItem[];
  pricing: PricingItem[];
  team: TeamMember[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [data, setData] = useState<SiteData>(defaultSiteData as any);
  const [activeTab, setActiveTab] = useState<'works' | 'team' | 'pricing' | 'config'>('works');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // New Work Form state
  const [newWork, setNewWork] = useState<{ title: string; categoryText: string; category: string; description: string; image: string; videoUrl: string }>({
    title: '',
    categoryText: '',
    category: 'video',
    description: '',
    image: '',
    videoUrl: '',
  });

  useEffect(() => {
    const auth = localStorage.getItem('creu_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    // Load from localStorage first if present
    const saved = localStorage.getItem('creu_site_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.siteConfig) setData(parsed);
      } catch {}
    }

    // Fetch from API with fallback
    fetch('/api/data')
      .then((res) => res.json())
      .then((d) => {
        if (d && !d.error && d.siteConfig) {
          setData(d);
          localStorage.setItem('creu_site_data', JSON.stringify(d));
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === '123455') {
      setIsAuthenticated(true);
      localStorage.setItem('creu_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('✕ Sai ID hoặc Mật khẩu! (ID: admin / Mật khẩu: 123455)');
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
    localStorage.setItem('creu_site_data', JSON.stringify(payload));

    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMessage('✓ Đã lưu thay đổi thành công!');
    } catch (err) {
      setMessage('✓ Đã lưu thay đổi (Local Session)!');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
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
                placeholder="Nhập ID (admin)"
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
                placeholder="Nhập Mật Khẩu (123455)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#141c30] border border-white/15 rounded-xl text-sm text-white focus:border-[#a855f7] outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
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
      categoryText: newWork.categoryText || 'Project — 2026',
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
    setData({ ...data, works: updatedWorks });
  };

  // Team Actions
  const handleUpdateTeam = (id: number, field: keyof TeamMember, value: any) => {
    const updatedTeam = data.team.map((t) => (t.id === id ? { ...t, [field]: value } : t));
    setData({ ...data, team: updatedTeam });
  };

  // Config Actions
  const handleUpdateConfig = (field: keyof SiteConfig, value: string) => {
    setData({ ...data, siteConfig: { ...data.siteConfig, [field]: value } });
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
                            className="text-xs text-purple-200 bg-[#0e1424] border border-white/15 px-3 py-1 rounded-lg focus:border-[#a855f7] outline-none w-full md:w-3/4"
                          />
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
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Tiểu sử (Bio)</label>
                    <textarea
                      value={member.bio}
                      onChange={(e) => handleUpdateTeam(member.id, 'bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none resize-none"
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
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Mô tả gói</label>
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
      </div>
    </div>
  );
}
