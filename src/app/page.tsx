'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesBar from '@/components/ServicesBar';
import SelectedWorks from '@/components/SelectedWorks';
import PartnershipPricing from '@/components/PartnershipPricing';
import ContactBanner from '@/components/ContactBanner';
import VideoModal from '@/components/VideoModal';
import WatermarkLogo3D from '@/components/WatermarkLogo3D';

import WorkPage from '@/components/WorkPage';
import ServicesPage from '@/components/ServicesPage';
import AboutPage from '@/components/AboutPage';
import ContactPage from '@/components/ContactPage';
import defaultSiteData from '@/data/siteData.json';

import AnnouncementBar from '@/components/AnnouncementBar';
import PromoBanner from '@/components/PromoBanner';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [activeVideoTitle, setActiveVideoTitle] = useState('');

  // Site Data State
  const [siteData, setSiteData] = useState<any>(defaultSiteData);

  const loadSiteData = () => {
    fetch('/api/data?t=' + Date.now(), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => res.json())
      .then((d) => {
        if (d && !d.error && d.siteConfig) {
          setSiteData(d);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('creu_site_data', JSON.stringify(d));
            } catch {}
          }
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('creu_site_data');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed?.siteConfig) setSiteData(parsed);
            } catch {}
          }
        }
      });
  };

  useEffect(() => {
    loadSiteData();

    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam && ['home', 'work', 'services', 'about', 'contact'].includes(tabParam)) {
          setCurrentTab(tabParam);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    handleUrlChange();

    const savedTheme = localStorage.getItem('creu_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }

    const handleStorageChange = () => {
      loadSiteData();
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('creu_theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('creu_theme', 'light');
    }
  }, [isDark]);

  const handleTabChange = (tab: string) => {
    if (tab === 'blog') {
      router.push('/blog');
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadSiteData();
  };

  const handlePlayVideo = (url?: string, title?: string) => {
    const videoToPlay = url || siteData?.siteConfig?.showreelUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    setActiveVideoUrl(videoToPlay);
    setActiveVideoTitle(title || 'Showreel');
    setIsVideoModalOpen(true);
  };

  return (
    <main className="relative min-h-screen">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* 3D Interactive Scroll Watermark Logo */}
      <WatermarkLogo3D />

      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      <AnimatePresence mode="wait">
        {currentTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <Hero
              onPlayShowreel={() => handlePlayVideo(siteData?.siteConfig?.showreelUrl, 'Hero Showreel')}
              onNavigate={handleTabChange}
              heroTitle={siteData?.siteConfig?.heroTitle}
              heroDesc={siteData?.siteConfig?.heroDesc}
              isDark={isDark}
              heroBgImage={siteData?.siteConfig?.heroBgImage}
            />

            <div className="shell">
              <ServicesBar />
            </div>

            {/* Hero Promotion Banner */}
            <PromoBanner />

            <SelectedWorks
              onNavigate={handleTabChange}
              onPlayVideo={(url, title) => handlePlayVideo(url, title)}
              works={siteData?.works}
            />

            <PartnershipPricing
              onNavigate={handleTabChange}
              pricing={siteData?.pricing}
            />

            <ContactBanner />
          </motion.div>
        )}

        {currentTab === 'work' && (
          <motion.div
            key="work"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <WorkPage
              onPlayVideo={(url, title) => handlePlayVideo(url, title)}
              works={siteData?.works}
            />
          </motion.div>
        )}

        {currentTab === 'services' && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <ServicesPage onNavigate={handleTabChange} />
          </motion.div>
        )}

        {currentTab === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <AboutPage team={siteData?.team} />
          </motion.div>
        )}

        {currentTab === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <ContactPage config={siteData?.siteConfig} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Video Modal Player */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={activeVideoUrl}
        title={activeVideoTitle}
      />
    </main>
  );
}
