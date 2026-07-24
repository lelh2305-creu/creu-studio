'use client';

import { useState, useEffect } from 'react';
import Footer from './Footer';

interface ContactPageProps {
  config?: any;
}

export default function ContactPage({ config: propsConfig }: ContactPageProps) {
  const [submitted, setSubmitted] = useState(false);
  const [config, setConfig] = useState<any>(propsConfig || {
    email: 'hello@creu.vn',
    location: 'Thủ Đức, TP. Hồ Chí Minh',
    workingHours: 'Thứ Hai – Thứ Sáu, 9:00 – 18:00',
    instagram: 'https://instagram.com',
    behance: 'https://behance.net',
    facebook: 'https://facebook.com',
  });

  useEffect(() => {
    if (propsConfig) {
      setConfig(propsConfig);
      return;
    }

    const saved = localStorage.getItem('creu_site_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.siteConfig) {
          setConfig(parsed.siteConfig);
          return;
        }
      } catch {}
    }

    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.siteConfig) setConfig(data.siteConfig);
      })
      .catch(() => {});
  }, [propsConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-4">
      <div style={{ background: 'var(--header-bg)', paddingTop: '30px' }}>
        <div className="ct-pg">
          <div>
            <span className="ey" style={{ display: 'block' }}>Let's Talk</span>
            <h1 className="serif ct-pgt">
              Let's build<br />something<br /><span className="pk">meaningful.</span>
            </h1>
            <p className="ct-pgd">
              Dù là một dự án nhỏ hay một campaign lớn — chúng tôi luôn sẵn sàng lắng nghe và tìm ra giải pháp phù hợp nhất.
            </p>

            <div className="ct-inf">
              <div className="ct-row">
                <div className="ct-ic">
                  <svg viewBox="0 0 16 16" fill="none" stroke="var(--ac)" strokeWidth="1.5" width="14">
                    <rect x="1" y="3" width="14" height="10" rx="1.5" />
                    <path d="M1 5l7 5 7-5" />
                  </svg>
                </div>
                <div>
                  <div className="ct-lb">Email</div>
                  <div className="ct-vl">{config.email}</div>
                </div>
              </div>

              <div className="ct-row">
                <div className="ct-ic">
                  <svg viewBox="0 0 16 16" fill="none" stroke="var(--ac)" strokeWidth="1.5" width="14">
                    <path d="M8 1C5.2 1 3 3.2 3 6c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z" />
                    <circle cx="8" cy="6" r="1.5" />
                  </svg>
                </div>
                <div>
                  <div className="ct-lb">Studio</div>
                  <div className="ct-vl">{config.location}</div>
                </div>
              </div>

              <div className="ct-row">
                <div className="ct-ic">
                  <svg viewBox="0 0 16 16" fill="none" stroke="var(--ac)" strokeWidth="1.5" width="14">
                    <circle cx="8" cy="8" r="6" />
                    <path d="M8 4v4l3 2" />
                  </svg>
                </div>
                <div>
                  <div className="ct-lb">Giờ làm việc</div>
                  <div className="ct-vl">{config.workingHours}</div>
                </div>
              </div>
            </div>

            {/* Social Media Link Buttons (Dynamic Links) */}
            <div className="ct-soc">
              <a href={config.instagram || '#'} target="_blank" rel="noopener noreferrer" className="cs-btn">
                Instagram
              </a>
              <a href={config.behance || '#'} target="_blank" rel="noopener noreferrer" className="cs-btn">
                Behance
              </a>
              <a href={config.facebook || '#'} target="_blank" rel="noopener noreferrer" className="cs-btn">
                Facebook
              </a>
            </div>
          </div>

          <div className="cf">
            <div className="cf-t">Gửi thông tin dự án</div>
            <form onSubmit={handleSubmit}>
              <div className="fr">
                <div className="ff">
                  <label>Họ và tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" required />
                </div>
                <div className="ff">
                  <label>Email</label>
                  <input type="email" placeholder="hello@brand.vn" required />
                </div>
              </div>

              <div className="fr">
                <div className="ff">
                  <label>Thương hiệu / Công ty</label>
                  <input type="text" placeholder="Brand của bạn" />
                </div>
                <div className="ff">
                  <label>Dịch vụ quan tâm</label>
                  <select defaultValue="">
                    <option value="" disabled>Chọn dịch vụ...</option>
                    <option>Video Production</option>
                    <option>Photography</option>
                    <option>Graphic Design</option>
                    <option>Brand Identity</option>
                    <option>Marketing Content</option>
                    <option>Monthly Partnership</option>
                  </select>
                </div>
              </div>

              <div className="fr">
                <div className="ff">
                  <label>Budget dự kiến</label>
                  <select defaultValue="">
                    <option value="" disabled>Chọn ngân sách...</option>
                    <option>Dưới 5 triệu</option>
                    <option>5 - 15 triệu</option>
                    <option>15 - 50 triệu</option>
                    <option>Trên 50 triệu</option>
                  </select>
                </div>
                <div className="ff">
                  <label>Deadline dự kiến</label>
                  <input type="text" placeholder="VD: Tháng 9/2026" />
                </div>
              </div>

              <div className="fr" style={{ gridTemplateColumns: '1fr' }}>
                <div className="ff full">
                  <label>Mô tả dự án</label>
                  <textarea placeholder="Bạn muốn tạo ra điều gì? Kể cho chúng tôi nghe..."></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="fs"
                style={submitted ? { background: 'var(--ac)', color: '#fff' } : {}}
                disabled={submitted}
              >
                {submitted ? 'Đã gửi! Chúng tôi sẽ liên hệ sớm.' : 'Gửi thông tin →'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
