'use client';

import { motion } from 'framer-motion';
import Footer from './Footer';

interface ServicesPageProps {
  onNavigate: (tab: string) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const servicesList = [
    {
      num: '01',
      title: 'Video Production',
      desc: 'Từ concept đến post-production, chúng tôi sản xuất video thương hiệu, TVC, Reels và documentary với chất lượng điện ảnh.',
      tags: ['TVC', 'Brand Film', 'Reels', 'Documentary'],
    },
    {
      num: '02',
      title: 'Photography',
      desc: 'Chụp ảnh sản phẩm, không gian, chân dung và sự kiện — mỗi bức ảnh là một câu chuyện được kể qua ánh sáng.',
      tags: ['Product', 'Architecture', 'Portrait', 'Event'],
    },
    {
      num: '03',
      title: 'Graphic Design',
      desc: 'Thiết kế poster, banner, key visual và tất cả collateral cần thiết — đẹp, đúng brand, và đúng deadline.',
      tags: ['Poster', 'Key Visual', 'Infographic'],
    },
    {
      num: '04',
      title: 'Brand Identity',
      desc: 'Xây dựng hệ thống nhận diện thương hiệu toàn diện: logo, typography, màu sắc, voice — tất cả thành một ngôn ngữ nhất quán.',
      tags: ['Logo', 'Brand System', 'Guideline'],
    },
    {
      num: '05',
      title: 'Marketing Content',
      desc: 'Nội dung Social Media, bài viết, caption và chiến lược content giúp thương hiệu nói đúng điệu, đúng lúc, đúng người.',
      tags: ['Social Media', 'Content Strategy', 'Copywriting'],
    },
  ];

  const steps = [
    { num: '01', title: 'Discovery', desc: 'Hiểu thương hiệu, mục tiêu và đối tượng mục tiêu — trước khi bắt đầu bất cứ điều gì.' },
    { num: '02', title: 'Concept', desc: 'Phát triển ý tưởng sáng tạo, mood board và hướng visual phù hợp với brand.' },
    { num: '03', title: 'Production', desc: 'Thực hiện với đội ngũ chuyên nghiệp — quay phim, chụp ảnh, thiết kế.' },
    { num: '04', title: 'Delivery', desc: 'Bàn giao file đúng định dạng, đúng deadline, kèm hỗ trợ sau dự án.' },
  ];

  return (
    <div className="min-h-screen pt-12">
      <div className="pg-h">
        <span className="ey" style={{ position: 'relative', zIndex: 1 }}>Services</span>
        <h1 className="serif pg-t">
          We craft<br /><span className="pk">experiences</span><br />that resonate.
        </h1>
        <p className="pg-s">
          Từ một campaign đơn lẻ đến một hệ sinh thái thương hiệu toàn diện - chúng tôi đem đúng craft cho từng điểm chạm.
        </p>
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
                {item.tags.map((t, tIdx) => (
                  <span key={tIdx} className="stag">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}

          <div className="sc2" style={{ cursor: 'default' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="serif" style={{ fontSize: '28px', fontWeight: 400, marginBottom: '16px', lineHeight: 1.2 }}>
                Not sure<br />what you<br /><span className="pk">need?</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '28px' }}>
                Nói chuyện với mình — chúng tôi sẽ giúp bạn tìm ra hướng đi phù hợp nhất.
              </p>
              <span className="btn-link" onClick={() => onNavigate('contact')}>Let's Talk &rarr;</span>
            </div>
          </div>
        </div>
      </div>

      <div className="spr shell">
        <span className="ey" style={{ display: 'block' }}>How We Work</span>
        <h2 className="serif" style={{ fontSize: 'clamp(30px,3.5vw,44px)', fontWeight: 400, marginTop: '16px', lineHeight: 1.15, color: 'var(--ink)' }}>
          From brief to<br /><span className="pk">beautiful.</span>
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
  );
}
