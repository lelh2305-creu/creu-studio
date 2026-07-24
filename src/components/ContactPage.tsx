'use client';

import { useState, useEffect } from 'react';
import Footer from './Footer';

interface ContactPageProps {
  config?: any;
}

export default function ContactPage({ config: propsConfig }: ContactPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [config, setConfig] = useState<any>(propsConfig || {
    email: 'hello@creu.vn',
    location: 'Thủ Đức, TP. Hồ Chí Minh',
    workingHours: 'Thứ Hai – Thứ Sáu, 9:00 – 18:00',
    instagram: 'https://instagram.com',
    behance: 'https://behance.net',
    facebook: 'https://www.facebook.com/CreU.VN/',
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch('https://formsubmit.co/ajax/hello@creu.vn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          _subject: `Dự án mới từ ${data.name || 'Khách hàng'} - CREU Studio Website`,
        }),
      });

      // Backup dispatch to lelh2305@gmail.com
      fetch('https://formsubmit.co/ajax/lelh2305@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          _subject: `[CREU Studio] Dự án mới từ ${data.name || 'Khách hàng'}`,
        }),
      }).catch(() => {});

      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
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
                  <input type="text" name="name" placeholder="Nguyễn Văn A" required />
                </div>
                <div className="ff">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="hello@brand.vn" required />
                </div>
              </div>

              <div className="fr">
                <div className="ff">
                  <label>Thương hiệu / Công ty</label>
                  <input type="text" name="brand" placeholder="Brand của bạn" />
                </div>
                <div className="ff">
                  <label>Dịch vụ quan tâm</label>
                  <select name="service" defaultValue="Video Production">
                    <option value="Video Production">Video Production</option>
                    <option value="Photography">Photography</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="Marketing Content">Marketing Content</option>
                    <option value="Monthly Partnership">Monthly Partnership</option>
                  </select>
                </div>
              </div>

              <div className="fr">
                <div className="ff">
                  <label>Budget dự kiến</label>
                  <select name="budget" defaultValue="5 - 15 triệu">
                    <option value="Dưới 5 triệu">Dưới 5 triệu</option>
                    <option value="5 - 15 triệu">5 - 15 triệu</option>
                    <option value="15 - 50 triệu">15 - 50 triệu</option>
                    <option value="Trên 50 triệu">Trên 50 triệu</option>
                  </select>
                </div>
                <div className="ff">
                  <label>Deadline dự kiến</label>
                  <input type="text" name="deadline" placeholder="VD: Tháng 9/2026" />
                </div>
              </div>

              <div className="fr" style={{ gridTemplateColumns: '1fr' }}>
                <div className="ff full">
                  <label>Mô tả dự án</label>
                  <textarea name="message" placeholder="Bạn muốn tạo ra điều gì? Kể cho chúng tôi nghe..."></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="fs"
                style={submitted ? { background: 'var(--ac)', color: '#fff' } : {}}
                disabled={submitting || submitted}
              >
                {submitting
                  ? 'Đang gửi...'
                  : submitted
                  ? 'Đã gửi thành công! Chúng tôi sẽ liên hệ sớm.'
                  : 'Gửi thông tin →'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
