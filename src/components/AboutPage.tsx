'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';
import defaultSiteData from '@/data/siteData.json';

interface AboutPageProps {
  team?: any[];
}

export default function AboutPage({ team: propsTeam }: AboutPageProps) {
  const [team, setTeam] = useState<any[]>(propsTeam || []);

  useEffect(() => {
    if (propsTeam && propsTeam.length > 0) {
      setTeam(propsTeam);
      return;
    }

    const saved = localStorage.getItem('creu_site_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.team) {
          setTeam(parsed.team);
          return;
        }
      } catch {}
    }

    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.team) setTeam(data.team);
      })
      .catch(() => setTeam(defaultSiteData.team));
  }, [propsTeam]);

  const stats = [
    { num: '50', em: '+', label: 'Dự án hoàn thành' },
    { num: '3', em: '+', label: 'Năm kinh nghiệm' },
    { num: '30', em: '+', label: 'Thương hiệu tin tưởng' },
    { num: '5', em: '★', label: 'Đánh giá khách hàng' },
  ];

  const teamList = team && team.length > 0 ? team : defaultSiteData.team;

  const values = [
    { icon: '✦', title: 'Craft First', desc: 'Chúng tôi không bao giờ thỏa hiệp với chất lượng. Mỗi chi tiết nhỏ đều được chú ý và chăm chút — vì đó là thứ tạo nên sự khác biệt.' },
    { icon: '◎', title: 'Brand Clarity', desc: 'Visual đẹp nhưng phải đúng. Mỗi lựa chọn sáng tạo đều phải phục vụ cho mục tiêu thương hiệu và nội dung điều thương hiệu muốn nói.' },
    { icon: '❯', title: 'Long-term Partnership', desc: 'Chúng tôi không làm một lần rồi thôi. Chúng tôi xây dựng mối quan hệ lâu dài — phát triển cùng thương hiệu theo thời gian.' },
  ];

  return (
    <div className="min-h-screen pt-4">
      <section className="ab-h">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="ey" style={{ display: 'block' }}>Who We Are</span>
          <h1 className="serif ab-tg">
            We're the<br />studio behind<br />the <span className="pk">story.</span>
          </h1>
        </div>
        <div className="ab-r">
          <p className="ab-in">
            CREU Studio là một creative studio đặt tại Thủ Đức, TP.HCM — chuyên biến ý tưởng thành hình ảnh và câu chuyện thương hiệu có chiều sâu. Chúng tôi tin rằng mỗi thương hiệu đều có một câu chuyện xứng đáng được kể theo cách đẹp nhất.
          </p>
          <div className="ab-st">
            {stats.map((st, idx) => (
              <motion.div
                key={idx}
                className="stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="stn">{st.num}<em>{st.em}</em></div>
                <div className="stl">{st.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-tm">
        <span className="ey" style={{ display: 'block' }}>The Team</span>
        <h2 className="serif" style={{ fontSize: 'clamp(28px,3.2vw,42px)', fontWeight: 400, marginTop: '14px', lineHeight: 1.15, color: 'var(--ink)' }}>
          People behind<br /><span className="pk">the lens.</span>
        </h2>
        <div className="tmg">
          {teamList.map((m, idx) => (
            <motion.div
              key={m.id || idx}
              className="tmc"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -6 }}
            >
              <div className="tmp">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="wb" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                ) : (
                  <div className={`wb ${m.bgClass || 'b1'}`} style={{ height: '100%' }} />
                )}
                <div className="tmpo" />
              </div>
              <div className="tmi">
                <div className="tmn">{m.name}</div>
                <div className="tmr">{m.role}</div>
                <div className="tmb">{m.bio}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="ab-vl">
        <span className="ey" style={{ display: 'block' }}>What Drives Us</span>
        <h2 className="serif" style={{ fontSize: 'clamp(28px,3.2vw,42px)', fontWeight: 400, marginTop: '14px', lineHeight: 1.15, color: 'var(--ink)' }}>
          Our <span className="pk">values.</span>
        </h2>
        <div className="vlg">
          {values.map((v, idx) => (
            <motion.div
              key={idx}
              className="vc2"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="vi2">{v.icon}</div>
              <div className="vt2">{v.title}</div>
              <div className="vd2">{v.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
