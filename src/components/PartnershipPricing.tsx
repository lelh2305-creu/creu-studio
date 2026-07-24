'use client';

import { motion } from 'framer-motion';

interface PartnershipPricingProps {
  onNavigate: (tab: string) => void;
}

export default function PartnershipPricing({ onNavigate }: PartnershipPricingProps) {
  const cards = [
    {
      id: 1,
      plan: 'Gói 01',
      title: 'Graphic Care',
      copy: 'Giải pháp thiết kế chuyên nghiệp & linh hoạt.',
      price: '2.000.000',
      per: 'VND / tháng',
      features: ['Thiết kế không giới hạn hợp lý', '03 Poster / tháng', '02 Lần chỉnh sửa', 'Phản hồi trong 24h'],
      btnText: 'Chọn gói này',
      popular: false,
    },
    {
      id: 2,
      plan: 'Gói 02',
      title: 'Creative Care',
      copy: 'Sản xuất nội dung sáng tạo toàn diện mỗi tháng.',
      price: '5.000.000',
      per: 'VND / tháng',
      features: ['Toàn bộ Graphic Care', '05 Production Days / tháng', '10 Bài viết Facebook', 'Dựng Reel / Motion Graphic'],
      btnText: 'Chọn gói này',
      popular: true,
      badge: 'Phổ biến nhất',
    },
    {
      id: 3,
      plan: 'Gói 03',
      title: 'Communication Partner',
      copy: 'Đối tác chiến lược truyền thông dài hạn cho doanh nghiệp.',
      price: '10.000.000+',
      per: 'VND / tháng',
      features: ['10 Production Days / tháng', 'Chiến lược nội dung', 'Báo cáo hiệu quả', 'Hỗ trợ 1–1 cùng Account Lead'],
      btnText: 'Liên hệ tư vấn',
      popular: false,
    },
  ];

  return (
    <section className="pricing" id="pricing">
      <div className="shell">
        <motion.div
          className="center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="eyebrow">Monthly partnership</div>
          <h2>
            Đồng hành dài hạn.<br />
            Tạo ra giá trị thật.
          </h2>
          <p>Ba gói dịch vụ linh hoạt, đồng hành cùng mục tiêu và ngân sách của bạn.</p>
        </motion.div>

        <div className="cards">
          {cards.map((c, idx) => (
            <motion.article
              key={c.id || idx}
              className={`card ${c.popular ? 'popular' : ''}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -12 }}
            >
              {c.badge && <span className="badge">{c.badge}</span>}
              <span className="plan">{c.plan}</span>
              <h3>{c.title}</h3>
              <div className="copy">{c.copy}</div>
              <div className="price">{c.price}</div>
              <div className="per">{c.per}</div>
              <ul className="features">
                {c.features.map((f, fIdx) => (
                  <li key={fIdx}>{f}</li>
                ))}
              </ul>
              <a className="choose" onClick={() => onNavigate('contact')} style={{ cursor: 'pointer' }}>
                <b>→</b>{c.btnText}
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
