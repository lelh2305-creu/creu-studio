'use client';

import { useState } from 'react';

export interface BlogPostItem {
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
  images?: string[];
}

interface BlogEditorProps {
  post: BlogPostItem;
  onUpdateField: (id: number, field: keyof BlogPostItem, value: any) => void;
  onDelete: (id: number) => void;
  onImageUpload: (file: File, callback: (url: string) => void) => void;
}

export default function BlogEditor({ post, onUpdateField, onDelete, onImageUpload }: BlogEditorProps) {
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');

  const handleAddImage = (file: File) => {
    onImageUpload(file, (url) => {
      const currentImages = post.images || [];
      if (currentImages.length >= 5) {
        alert('Tối đa 5 hình ảnh trong một bài viết!');
        return;
      }
      onUpdateField(post.id, 'images', [...currentImages, url]);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = (post.images || []).filter((_, idx) => idx !== indexToRemove);
    onUpdateField(post.id, 'images', updatedImages);
  };

  return (
    <div className="bg-[#0e1424] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#c499f5] text-xs font-extrabold uppercase">
            {post.category || 'GENERAL'}
          </span>
          <span className="text-xs font-mono text-gray-400">/{post.slug}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Tabs */}
          <div className="flex bg-[#141c30] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveLangTab('vi')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === 'vi' ? 'bg-[#a855f7] text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              onClick={() => setActiveLangTab('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === 'en' ? 'bg-[#a855f7] text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          <button
            onClick={() => onDelete(post.id)}
            className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Xóa Bài 🗑️
          </button>
        </div>
      </div>

      {/* 2-Column CMS Layout: Main Content (Left) + Metadata Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editor (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {activeLangTab === 'vi' ? (
            /* Vietnamese Content */
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-extrabold text-gray-300 mb-1.5">
                  Tiêu Đề Bài Viết (Tiếng Việt)
                </label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => onUpdateField(post.id, 'title', e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 py-2.5 bg-[#141c30] border border-white/15 rounded-xl text-sm font-bold text-white focus:border-[#a855f7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold text-gray-300 mb-1.5">
                  Mô Tả Ngắn (Short Description)
                </label>
                <textarea
                  rows={2}
                  value={post.description}
                  onChange={(e) => onUpdateField(post.id, 'description', e.target.value)}
                  placeholder="Nhập mô tả ngắn hiển thị ở danh sách bài viết..."
                  className="w-full px-4 py-2.5 bg-[#141c30] border border-white/15 rounded-xl text-xs text-white focus:border-[#a855f7] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold text-purple-300 mb-1.5 flex items-center justify-between">
                  <span>📝 Nội Dung Bài Viết (Markdown)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Hỗ trợ Markdown HTML</span>
                </label>
                <textarea
                  rows={14}
                  value={post.content || post.content_vi || ''}
                  onChange={(e) => {
                    onUpdateField(post.id, 'content', e.target.value);
                    onUpdateField(post.id, 'content_vi', e.target.value);
                  }}
                  placeholder="# Nhập nội dung bài viết định dạng Markdown..."
                  className="w-full px-4 py-3 bg-[#141c30] border border-purple-500/30 rounded-xl text-xs text-white focus:border-[#a855f7] outline-none font-mono resize-y leading-relaxed"
                />
              </div>
            </div>
          ) : (
            /* English Content */
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-extrabold text-purple-300 mb-1.5">
                  🇬🇧 English Title
                </label>
                <input
                  type="text"
                  value={post.titleEn || ''}
                  onChange={(e) => onUpdateField(post.id, 'titleEn', e.target.value)}
                  placeholder="Enter English post title..."
                  className="w-full px-4 py-2.5 bg-[#141c30] border border-purple-500/30 rounded-xl text-sm font-bold text-purple-200 focus:border-[#a855f7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold text-purple-300 mb-1.5">
                  🇬🇧 Short Description (EN)
                </label>
                <textarea
                  rows={2}
                  value={post.descriptionEn || ''}
                  onChange={(e) => onUpdateField(post.id, 'descriptionEn', e.target.value)}
                  placeholder="Enter short English description..."
                  className="w-full px-4 py-2.5 bg-[#141c30] border border-purple-500/30 rounded-xl text-xs text-purple-200 focus:border-[#a855f7] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold text-purple-300 mb-1.5 flex items-center justify-between">
                  <span>📝 Detailed Content (EN Markdown)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Markdown Supported</span>
                </label>
                <textarea
                  rows={14}
                  value={post.contentEn || post.content_en || ''}
                  onChange={(e) => {
                    onUpdateField(post.id, 'contentEn', e.target.value);
                    onUpdateField(post.id, 'content_en', e.target.value);
                  }}
                  placeholder="# Enter English markdown content..."
                  className="w-full px-4 py-3 bg-[#141c30] border border-purple-500/30 rounded-xl text-xs text-purple-200 focus:border-[#a855f7] outline-none font-mono resize-y leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Metadata Sidebar (1/3) */}
        <div className="space-y-5 bg-[#141c30]/70 p-5 rounded-2xl border border-white/10">
          <h3 className="text-xs uppercase font-bold text-[#c499f5] border-b border-white/10 pb-2">
            ⚙️ Thông Tin &amp; Hình Ảnh (Metadata)
          </h3>

          {/* Thumbnail */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1.5">
              Ảnh Đại Diện (Thumbnail)
            </label>
            {post.thumbnail && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2 border border-white/15 bg-black/20">
                <img src={post.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={post.thumbnail}
                onChange={(e) => onUpdateField(post.id, 'thumbnail', e.target.value)}
                placeholder="URL hình ảnh..."
                className="w-full px-3 py-1.5 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none"
              />
              <label className="px-3 py-1.5 bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap flex items-center shadow-md">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onImageUpload(e.target.files[0], (url) => onUpdateField(post.id, 'thumbnail', url));
                    }
                  }}
                  className="hidden"
                />
                📷 Upload
              </label>
            </div>
          </div>

          {/* Image Gallery Manager */}
          <div className="p-3.5 bg-[#0e1424] border border-[#a855f7]/20 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] uppercase font-bold text-[#c499f5]">
                📸 Hình Trong Bài (img1..img5)
              </label>
              <span className="text-[10px] text-gray-400">({post.images?.length || 0}/5)</span>
            </div>

            <label className="block w-full py-2 bg-[#a855f7]/20 border border-[#a855f7]/40 hover:bg-[#a855f7]/30 text-[#c499f5] text-xs font-bold cursor-pointer rounded-lg text-center transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleAddImage(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              + Upload Thêm Hình
            </label>

            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {post.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/10 bg-black/20">
                    <img src={imgUrl} alt={`img${idx + 1}`} className="w-full h-20 object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-all">
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded hover:bg-rose-600"
                      >
                        Xóa
                      </button>
                      <span className="text-white text-[10px] font-mono">img{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slug URL */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">
              Slug URL
            </label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => onUpdateField(post.id, 'slug', e.target.value)}
              className="w-full px-3 py-1.5 bg-[#0e1424] border border-white/15 rounded-lg text-xs font-mono text-white focus:border-[#a855f7] outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">
              Phân Loại (Category)
            </label>
            <input
              type="text"
              value={post.category}
              onChange={(e) => onUpdateField(post.id, 'category', e.target.value)}
              className="w-full px-3 py-1.5 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none"
            />
          </div>

          {/* Date & Author */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">Ngày Đăng</label>
              <input
                type="date"
                value={post.date}
                onChange={(e) => onUpdateField(post.id, 'date', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">Tác Giả</label>
              <input
                type="text"
                value={post.author}
                onChange={(e) => onUpdateField(post.id, 'author', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0e1424] border border-white/15 rounded-lg text-xs text-white focus:border-[#a855f7] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
