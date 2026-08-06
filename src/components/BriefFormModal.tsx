'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';

interface BriefFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BriefFormModal({ isOpen, onClose }: BriefFormModalProps) {
  const { lang } = useLang();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Section 1
    companyName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    industry: '',

    // Section 2
    posterPurpose: [] as string[],
    designVersions: '',
    usageLocation: [] as string[],

    // Section 3
    posterDimensions: '',
    socialSizes: [] as string[],
    fileFormats: [] as string[],

    // Section 4
    mainTitle: '',
    contentDetail: '',
    visualSource: [] as string[],
    visualType: [] as string[],
    brandingLogo: [] as string[],

    // Section 5
    creativeTone: [] as string[],
    preferredColors: '',
    avoidColors: '',
    references: '',
    avoidPoints: '',

    // Section 6
    deadline: '',
    estimatedBudget: '',
    revisionRounds: [] as string[],

    // Section 7
    sourceDiscovery: [] as string[],
    specialNotes: '',
  });

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev: any) => {
      const currentList: string[] = prev[field] || [];
      const exists = currentList.includes(value);
      const updated = exists
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      _subject: 'CREU Brief Form - Khách hàng mới',
      _next: 'https://creu.vn',
      'THÔNG TIN KHÁCH HÀNG': {
        'Công ty / Cá nhân': formData.companyName,
        'Người phụ trách': formData.contactName,
        'Số điện thoại': formData.contactPhone,
        Email: formData.contactEmail,
        'Ngành nghề': formData.industry,
      },
      'DỰ ÁN POSTER': {
        'Mục đích': formData.posterPurpose.join(', '),
        'Số phiên bản thiết kế': formData.designVersions,
        'Nơi sử dụng': formData.usageLocation.join(', '),
      },
      'CHI TIẾT KỸ THUẬT': {
        'Kích thước Poster': formData.posterDimensions,
        'Social Media Sizes': formData.socialSizes.join(', '),
        'Định dạng File': formData.fileFormats.join(', '),
      },
      'NỘI DUNG POSTER': {
        'Tiêu đề chính': formData.mainTitle,
        'Nội dung chi tiết': formData.contentDetail,
        'Hình ảnh / Visual': formData.visualSource.join(', '),
        'Loại hình ảnh': formData.visualType.join(', '),
        'Logo / Branding': formData.brandingLogo.join(', '),
      },
      'HƯỚNG ĐI CREATIVE': {
        'Tone / Cảm xúc': formData.creativeTone.join(', '),
        'Màu sắc yêu thích': formData.preferredColors,
        'Màu cần tránh': formData.avoidColors,
        'Reference / Ví dụ': formData.references,
        'Điểm cần tránh': formData.avoidPoints,
      },
      'TIMELINE & BUDGET': {
        Deadline: formData.deadline,
        'Budget dự kiến': formData.estimatedBudget,
        'Số vòng chỉnh sửa': formData.revisionRounds.join(', '),
      },
      'THÔNG TIN THÊM': {
        'Nguồn biết đến CREU': formData.sourceDiscovery.join(', '),
        'Ghi chú đặc biệt': formData.specialNotes,
      },
    };

    try {
      await fetch('https://formsubmit.co/ajax/01e5c9c8caf2bcac68e91025db13bbbf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      // Fallback
      try {
        await fetch('https://formsubmit.co/ajax/lelh2305@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch {}
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop Blur Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/75 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />

        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 dark:bg-white/10 dark:hover:bg-white/25 border border-white/30 text-white flex items-center justify-center text-lg font-bold backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Close brief form"
        >
          ✕
        </button>

        {/* Modal Container */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[88vh] bg-[#fff9fb] dark:bg-[#0e1424] border border-white/20 dark:border-white/10 rounded-3xl sm:rounded-[36px] shadow-2xl overflow-y-auto z-10 text-gray-900 dark:text-white p-6 sm:p-10 space-y-8"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-white/10 pb-6 text-center sm:text-left">
            <span className="ey text-xs uppercase tracking-widest text-[#a855f7] font-bold block mb-2">
              CREU STUDIO · CLIENT BRIEF
            </span>
            <h2 className="serif text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              {t('brief.title', lang)}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {t('brief.subtitle', lang)}
            </p>
          </div>

          {submitted ? (
            <motion.div
              className="py-16 text-center space-y-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-16 h-16 rounded-full bg-[#a855f7]/20 border border-[#a855f7] text-[#a855f7] dark:text-[#c499f5] flex items-center justify-center text-3xl font-bold mx-auto">
                ✓
              </div>
              <h3 className="serif text-2xl font-bold">{t('brief.success', lang)}</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {lang === 'en'
                  ? 'Our lead designer will review your brief and get back to you within 24 hours.'
                  : 'Đội ngũ CREU Studio sẽ phân tích thông tin và phản hồi trong thời gian sớm nhất.'}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#a855f7] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9333ea] transition-all cursor-pointer shadow-lg"
              >
                {lang === 'en' ? 'Close Window ✕' : 'Đóng cửa sổ ✕'}
              </button>
            </motion.div>
          ) : (
            <form
              action="https://formsubmit.co/01e5c9c8caf2bcac68e91025db13bbbf"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-10"
            >
              <input type="hidden" name="_subject" value="CREU Brief Form - Khách hàng mới" />
              <input type="hidden" name="_next" value="https://creu.vn" />
              {/* SECTION 1: CLIENT INFO */}
              <div className="space-y-4 p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#a855f7] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  {t('brief.sec1', lang)}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Tên công ty / Cá nhân</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: CREU Vietnam Co., Ltd"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Người phụ trách - Tên</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn A"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      required
                      placeholder="VD: 0901234567"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="VD: hello@brand.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase mb-1">Ngành nghề / Lĩnh vực hoạt động</label>
                    <input
                      type="text"
                      placeholder="VD: Thời trang, F&B, Bất động sản, Công nghệ..."
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: POSTER PROJECT */}
              <div className="space-y-4 p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#a855f7] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  {t('brief.sec2', lang)}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Mục đích sử dụng Poster (Chọn nhiều)</label>
                    <div className="flex flex-wrap gap-2">
                      {['Quảng cáo sản phẩm', 'Quảng cáo sự kiện/Họp báo', 'Tuyển dụng', 'Nội bộ công ty', 'Khác'].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => handleCheckboxChange('posterPurpose', item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            formData.posterPurpose.includes(item)
                              ? 'bg-[#a855f7] text-white border-[#a855f7]'
                              : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Số phiên bản thiết kế mong muốn</label>
                      <input
                        type="text"
                        placeholder="VD: 2 option layout khác nhau"
                        value={formData.designVersions}
                        onChange={(e) => handleInputChange('designVersions', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-2">Nơi sử dụng Poster</label>
                      <div className="flex flex-wrap gap-2">
                        {['In ra giấy', 'Social media', 'Cả hai', 'Khác'].map((item) => (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handleCheckboxChange('usageLocation', item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              formData.usageLocation.includes(item)
                                ? 'bg-[#a855f7] text-white border-[#a855f7]'
                                : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: TECHNICAL SPECS */}
              <div className="space-y-4 p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#a855f7] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  {t('brief.sec3', lang)}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Kích thước Poster mong muốn</label>
                    <input
                      type="text"
                      placeholder="VD: A2 (420x594mm), A3, hoặc kích thước tùy chỉnh..."
                      value={formData.posterDimensions}
                      onChange={(e) => handleInputChange('posterDimensions', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Size Social Media (Nếu có)</label>
                    <div className="flex flex-wrap gap-2">
                      {['Instagram Post 1080x1080', 'Instagram Story 1080x1920', 'Facebook 1200x628', 'TikTok 1080x1920', 'Khác'].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => handleCheckboxChange('socialSizes', item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            formData.socialSizes.includes(item)
                              ? 'bg-[#a855f7] text-white border-[#a855f7]'
                              : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Định dạng File cần bàn giao</label>
                    <div className="flex flex-wrap gap-2">
                      {['In ấn PDF/TIFF', 'Kỹ thuật số JPG/PNG', 'Cả hai', 'File nguồn PSD/AI'].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => handleCheckboxChange('fileFormats', item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            formData.fileFormats.includes(item)
                              ? 'bg-[#a855f7] text-white border-[#a855f7]'
                              : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: POSTER CONTENT */}
              <div className="space-y-4 p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#a855f7] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  {t('brief.sec4', lang)}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Tiêu đề chính (Headline)</label>
                    <input
                      type="text"
                      placeholder="VD: Bứt phá giới hạn sáng tạo 2026..."
                      value={formData.mainTitle}
                      onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Nội dung chi tiết / Phụ đề / Contact info trên Poster</label>
                    <textarea
                      rows={3}
                      placeholder="Nhập toàn bộ chữ, địa điểm, thời gian, CTA muốn đưa lên poster..."
                      value={formData.contentDetail}
                      onChange={(e) => handleInputChange('contentDetail', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2">Nguồn Hình ảnh / Visual</label>
                      <div className="flex flex-col gap-1.5">
                        {['Có sẵn (Khách gửi)', 'Muốn CREU chụp/thực hiện', 'Muốn CREU tìm stock'].map((item) => (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handleCheckboxChange('visualSource', item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                              formData.visualSource.includes(item)
                                ? 'bg-[#a855f7] text-white border-[#a855f7]'
                                : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-2">Loại hình ảnh ưu tiên</label>
                      <div className="flex flex-col gap-1.5">
                        {['Ảnh sản phẩm', 'Ảnh con người/lifestyle', 'Illustration/Vector art'].map((item) => (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handleCheckboxChange('visualType', item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                              formData.visualType.includes(item)
                                ? 'bg-[#a855f7] text-white border-[#a855f7]'
                                : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-2">Logo / Branding</label>
                      <div className="flex flex-col gap-1.5">
                        {['Có sẵn (Sẽ gửi file vector)', 'Chưa có (CREU tự thiết kế)', 'Chưa xác định'].map((item) => (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handleCheckboxChange('brandingLogo', item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                              formData.brandingLogo.includes(item)
                                ? 'bg-[#a855f7] text-white border-[#a855f7]'
                                : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: CREATIVE DIRECTION */}
              <div className="space-y-4 p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#a855f7] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  {t('brief.sec5', lang)}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Tone / Phong cách cảm xúc (Chọn nhiều)</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Modern / Hiện đại',
                        'Truyền thống / Cổ điển',
                        'Vui vẻ / Thân thiện',
                        'Luxury / Cao cấp',
                        'Bold / Mạnh mẽ',
                        'Minimalist / Tối giản',
                        'Khác',
                      ].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => handleCheckboxChange('creativeTone', item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            formData.creativeTone.includes(item)
                              ? 'bg-[#a855f7] text-white border-[#a855f7]'
                              : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Màu sắc chủ đạo yêu thích</label>
                      <input
                        type="text"
                        placeholder="VD: Tím pastel, đen nhám, vàng ánh kim..."
                        value={formData.preferredColors}
                        onChange={(e) => handleInputChange('preferredColors', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Màu sắc cần tránh</label>
                      <input
                        type="text"
                        placeholder="VD: Tránh màu đỏ chói, tránh xanh lá..."
                        value={formData.avoidColors}
                        onChange={(e) => handleInputChange('avoidColors', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Reference / Hình ảnh mẫu yêu thích (Link Pinterest, Behance...)</label>
                      <textarea
                        rows={2}
                        placeholder="Dán link các mẫu poster bạn thích..."
                        value={formData.references}
                        onChange={(e) => handleInputChange('references', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Những điểm cần TRÁNH trong thiết kế</label>
                      <textarea
                        rows={2}
                        placeholder="VD: Tránh rối mắt, không dùng quá 3 font chữ..."
                        value={formData.avoidPoints}
                        onChange={(e) => handleInputChange('avoidPoints', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7] resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: TIMELINE & BUDGET */}
              <div className="space-y-4 p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#a855f7] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  {t('brief.sec6', lang)}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Deadline cần hoàn thành</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Budget dự kiến (VND / USD)</label>
                    <input
                      type="text"
                      placeholder="VD: 5.000.000 VND hoặc 300$"
                      value={formData.estimatedBudget}
                      onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Số vòng chỉnh sửa mong muốn</label>
                    <div className="flex flex-wrap gap-2">
                      {['1 vòng', '2-3 vòng', 'Không giới hạn'].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => handleCheckboxChange('revisionRounds', item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            formData.revisionRounds.includes(item)
                              ? 'bg-[#a855f7] text-white border-[#a855f7]'
                              : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 7: ADDITIONAL INFO */}
              <div className="space-y-4 p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#a855f7] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  {t('brief.sec7', lang)}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Bạn biết đến CREU Studio từ đâu?</label>
                    <div className="flex flex-wrap gap-2">
                      {['Facebook', 'TikTok', 'Website', 'Giới thiệu từ bạn bè', 'Khách cũ', 'Khác'].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => handleCheckboxChange('sourceDiscovery', item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            formData.sourceDiscovery.includes(item)
                              ? 'bg-[#a855f7] text-white border-[#a855f7]'
                              : 'bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#a855f7]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Ghi chú đặc biệt thêm cho dự án</label>
                    <textarea
                      rows={3}
                      placeholder="Bất kỳ yêu cầu nào khác bạn muốn lưu ý với đội ngũ CREU Studio..."
                      value={formData.specialNotes}
                      onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c16] border border-gray-300 dark:border-white/15 rounded-xl text-xs font-medium outline-none focus:border-[#a855f7] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action Button */}
              <div className="pt-4 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel' : 'Hủy bỏ'}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? t('brief.submitting', lang) : t('brief.submit', lang)}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
