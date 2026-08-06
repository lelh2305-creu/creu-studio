'use client';

import { useState, useEffect } from 'react';
import Footer from './Footer';
import { useLang } from '@/context/LangContext';

interface ContactPageProps {
  config?: any;
}

export default function ContactPage({ config: propsConfig }: ContactPageProps) {
  const { lang } = useLang();
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

    fetch('/api/data?t=' + Date.now(), { cache: 'no-store' })
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
      await fetch('https://formsubmit.co/ajax/lelh2305@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          _subject: `🔔 Dự án mới từ ${data.name || 'Khách hàng'} - CREU Studio Website`,
        }),
      });

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
            <span className="ey" style={{ display: 'block' }}>
              {lang === 'en' ? "Let's Talk" : 'Liên hệ'}
            </span>
            <h1 className="serif ct-pgt">
              {lang === 'en' ? (
                <>Let's build<br />something<br /><span className="pk">meaningful.</span></>
              ) : (
                <>Cùng CREU tạo nên<br />trải nghiệm thị giác<br /><span className="pk">giàu cảm xúc.</span></>
              )}
            </h1>
            <p className="ct-pgd">
              {lang === 'en'
                ? 'Whether a small project or a large campaign, we are always ready to listen and find the right solution.'
                : 'Dù là một dự án nhỏ hay một campaign lớn, chúng tôi luôn sẵn sàng lắng nghe và tìm ra giải pháp phù hợp nhất.'}
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
                  <div className="ct-vl">{lang === 'en' ? 'Thu Duc, Ho Chi Minh City' : config.location}</div>
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
                  <div className="ct-lb">{lang === 'en' ? 'Working Hours' : 'Giờ làm việc'}</div>
                  <div className="ct-vl">{lang === 'en' ? 'Monday – Friday, 9:00 – 18:00' : config.workingHours}</div>
                </div>
              </div>
            </div>

            {/* Social Media Link Buttons */}
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
            <div className="cf-t">{lang === 'en' ? 'Send project details' : 'Gửi thông tin dự án'}</div>
            <form onSubmit={handleSubmit}>
              <div className="fr">
                <div className="ff">
                  <label>{lang === 'en' ? 'Full name' : 'Họ và tên'}</label>
                  <input type="text" name="name" placeholder={lang === 'en' ? 'John Doe' : 'Nguyễn Văn A'} required />
                </div>
                <div className="ff">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="hello@brand.com" required />
                </div>
              </div>

              <div className="fr">
                <div className="ff">
                  <label>{lang === 'en' ? 'Brand / Company' : 'Thương hiệu / Công ty'}</label>
                  <input type="text" name="brand" placeholder={lang === 'en' ? 'Your Brand' : 'Brand của bạn'} />
                </div>
                <div className="ff">
                  <label>{lang === 'en' ? 'Service needed' : 'Dịch vụ quan tâm'}</label>
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
                  <label>{lang === 'en' ? 'Estimated budget' : 'Budget dự kiến'}</label>
                  <select name="budget" defaultValue="5 - 15 triệu">
                    <option value="Dưới 5 triệu">{lang === 'en' ? 'Under $200' : 'Dưới 5 triệu'}</option>
                    <option value="5 - 15 triệu">{lang === 'en' ? '$200 - $600' : '5 - 15 triệu'}</option>
                    <option value="15 - 50 triệu">{lang === 'en' ? '$600 - $2,000' : '15 - 50 triệu'}</option>
                    <option value="Trên 50 triệu">{lang === 'en' ? 'Over $2,000' : 'Trên 50 triệu'}</option>
                  </select>
                </div>
                <div className="ff">
                  <label>{lang === 'en' ? 'Target deadline' : 'Deadline dự kiến'}</label>
                  <input type="text" name="deadline" placeholder={lang === 'en' ? 'e.g. Sept 2026' : 'VD: Tháng 9/2026'} />
                </div>
              </div>

              <div className="fr" style={{ gridTemplateColumns: '1fr' }}>
                <div className="ff full">
                  <label>{lang === 'en' ? 'Project description' : 'Mô tả dự án'}</label>
                  <textarea name="message" placeholder={lang === 'en' ? 'What would you like to create? Tell us...' : 'Bạn muốn tạo ra điều gì? Kể cho chúng tôi nghe...'}></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="fs"
                style={submitted ? { background: 'var(--ac)', color: '#fff' } : {}}
                disabled={submitting || submitted}
              >
                {submitting
                  ? (lang === 'en' ? 'Sending...' : 'Đang gửi...')
                  : submitted
                  ? (lang === 'en' ? 'Sent successfully! We will reach out soon.' : 'Đã gửi thành công! Chúng tôi sẽ liên hệ sớm.')
                  : (lang === 'en' ? 'Send message →' : 'Gửi thông tin →')}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
