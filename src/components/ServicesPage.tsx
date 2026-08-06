'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';
import BriefFormModal from './BriefFormModal';

interface ServicesPageProps {
  onNavigate: (tab: string) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const { lang } = useLang();
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

  const servicesList = [
    {
      num: '01',
      title: 'Video Production',
      desc: lang === 'en'
        ? 'From concept to post-production, we produce brand films, TVCs, Reels, and documentaries with cinematic quality.'
        : 'Từ concept đến post-production, chúng tôi sản xuất video thương hiệu, TVC, Reels và documentary với chất lượng điện ảnh.',
      tags: ['TVC', 'Brand Film', 'Reels', 'Documentary'],
    },
    {
      num: '02',
      title: 'Photography',
      desc: lang === 'en'
        ? 'Product, architectural, portrait, and event photography: every shot tells a story crafted by light.'
        : 'Chụp ảnh sản phẩm, không gian, chân dung và sự kiện: mỗi bức ảnh là một câu chuyện được kể qua ánh sáng.',
      tags: ['Product', 'Architecture', 'Portrait', 'Event'],
    },
    {
      num: '03',
      title: 'Graphic Design',
      desc: lang === 'en'
        ? 'Designing posters, banners, key visuals, and all required collateral: beautiful, brand-accurate, on deadline.'
        : 'Thiết kế poster, banner, key visual và tất cả collateral cần thiết: đẹp, đúng brand, và đúng deadline.',
      tags: ['Poster', 'Key Visual', 'Infographic'],
    },
    {
      num: '04',
      title: 'Brand Identity',
      desc: lang === 'en'
        ? 'Building comprehensive brand identity systems: logo, typography, color palettes, unified into a consistent voice.'
        : 'Xây dựng hệ thống nhận diện thương hiệu toàn diện: logo, typography, màu sắc, voice, tất cả thành một ngôn ngữ nhất quán.',
      tags: ['Logo', 'Brand System', 'Guideline'],
    },
    {
      num: '05',
      title: 'Marketing Content',
      desc: lang === 'en'
        ? 'Social media content, copy, and strategy helping brands speak to the right audience at the right time.'
        : 'Nội dung Social Media, bài viết, caption và chiến lược content giúp thương hiệu nói đúng điệu, đúng lúc, đúng người.',
      tags: ['Social Media', 'Content Strategy', 'Copywriting'],
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Discovery',
      desc: lang === 'en'
        ? 'Understanding your brand, objectives, and target audience, before starting anything.'
        : 'Tìm hiểu thương hiệu, mục tiêu và đối tượng khách hàng, trước khi bắt đầu triển khai.',
    },
    {
      num: '02',
      title: 'Concept',
      desc: lang === 'en'
        ? 'Developing creative ideas, moodboards, and visual directions tailored to your brand.'
        : 'Phát triển ý tưởng sáng tạo, mood board và định hướng thị giác phù hợp với thương hiệu.',
    },
    {
      num: '03',
      title: 'Production',
      desc: lang === 'en'
        ? 'Executing with a dedicated professional team: filming, photography, and design.'
        : 'Thực hiện với đội ngũ chuyên nghiệp: quay phim, chụp ảnh, thiết kế.',
    },
    {
      num: '04',
      title: 'Delivery',
      desc: lang === 'en'
        ? 'Delivering formatted assets on time, complete with post-launch support.'
        : 'Bàn giao sản phẩm đúng định dạng, đúng tiến độ, kèm hỗ trợ sau dự án.',
    },
  ];

  return (
    <>
      <div className="min-h-screen pt-12">
        <div className="pg-h">
          <span className="ey" style={{ position: 'relative', zIndex: 1 }}>
            {lang === 'en' ? 'Services' : 'Dịch vụ'}
          </span>
          <h1 className="serif pg-t">
            {lang === 'en' ? (
              <>We craft<br /><span className="pk">experiences</span><br />that resonate.</>
            ) : (
              <>Tạo ra<br /><span className="pk">trải nghiệm</span><br />giàu cảm xúc.</>
            )}
          </h1>
          <p className="pg-s">
            {lang === 'en'
              ? 'From a single campaign to a full brand ecosystem, we bring the right craft to every touchpoint.'
              : 'Từ một chiến dịch đơn lẻ đến một hệ sinh thái thương hiệu toàn diện, chúng tôi mang tới giải pháp tinh tế cho từng điểm chạm.'}
          </p>

          <div className="mt-8">
            <button
              onClick={() => setIsBriefModalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t('brief.btn', lang)}
            </button>
          </div>
        </div>

        <div className="shell mt-10">
          <div className="sdl">
            {servicesList.map((item, idx) => (
              <motion.div
                key={idx}
                className="sc2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div className="sc2-n">{item.num}</div>
                <div className="sc2-ar">
                  <svg viewBox="0 0 12 12" fill="none" width="12">
                    <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="sc2-t">{item.title}</div>
                <div className="sc2-d">{item.desc}</div>
                <div className="sc2-tags">
                  {item.tags.map((tItem, tIdx) => (
                    <span key={tIdx} className="stag">{tItem}</span>
                  ))}
                </div>
              </motion.div>
            ))}

            <div className="sc2" style={{ cursor: 'default' }}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="serif" style={{ fontSize: '28px', fontWeight: 400, marginBottom: '16px', lineHeight: 1.2 }}>
                  {lang === 'en' ? (
                    <>Ready to<br />start your<br /><span className="pk">project?</span></>
                  ) : (
                    <>Sẵn sàng<br />bắt đầu dự án<br /><span className="pk">cùng CREU?</span></>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '20px' }}>
                  {lang === 'en'
                    ? 'Fill in our structured brief form to get an accurate quote and creative direction.'
                    : 'Điền form brief chi tiết để nhận báo giá & định hướng sáng tạo nhanh nhất.'}
                </p>
                <button
                  onClick={() => setIsBriefModalOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer text-center"
                >
                  {t('brief.btn', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="spr shell">
          <span className="ey" style={{ display: 'block' }}>
            {lang === 'en' ? 'How We Work' : 'Quy trình làm việc'}
          </span>
          <h2 className="serif" style={{ fontSize: 'clamp(30px,3.5vw,44px)', fontWeight: 400, marginTop: '16px', lineHeight: 1.15, color: 'var(--ink)' }}>
            {lang === 'en' ? (
              <>From brief to<br /><span className="pk">beautiful.</span></>
            ) : (
              <>Từ ý tưởng đến<br /><span className="pk">sản phẩm hoàn chỉnh.</span></>
            )}
          </h2>
          <div className="spg">
            {steps.map((st, sIdx) => (
              <motion.div
                key={sIdx}
                className="pst"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: sIdx * 0.1 }}
              >
                <div className="ps-n">{st.num}</div>
                <div className="ps-t">{st.title}</div>
                <div className="ps-d">{st.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      {/* Brief Form Modal */}
      <BriefFormModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
      />
    </>
  );
}
