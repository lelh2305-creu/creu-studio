'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ currentTab, onTabChange, isDark, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, toggle: toggleLang } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('nav.home', lang) },
    { id: 'work', label: t('nav.work', lang) },
    { id: 'services', label: t('nav.services', lang) },
    { id: 'blog', label: t('nav.blog', lang) },
    { id: 'about', label: t('nav.about', lang) },
    { id: 'contact', label: t('nav.contact', lang) },
  ];

  const handleMobileNav = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <a className="logo cursor-pointer" onClick={() => onTabChange('home')}>
          <b>CREU</b><i>✱</i>
        </a>

        {/* Desktop Nav Links */}
        <div className="navlinks hidden md:flex">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <a
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`cursor-pointer ${isActive ? 'on' : ''}`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute -bottom-[7px] left-0 right-0 h-[2px] bg-[#c499f5]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Switcher Button VI / EN */}
          <button
            onClick={toggleLang}
            style={{
              background: isDark ? '#18181b' : '#6d28d9',
              color: '#ffffff',
              border: `1px solid ${isDark ? '#3f3f46' : '#6d28d9'}`,
              padding: '5px 12px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
            }}
            title="Chuyển đổi ngôn ngữ / Switch language"
          >
            {lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
          </button>

          {/* Theme Switcher Button */}
          <button
            className="theme-btn"
            onClick={onToggleTheme}
            title={isDark ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối (GitHub Dark)'}
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <button className="talk hidden sm:block" onClick={() => onTabChange('contact')}>
            {t('nav.cta', lang)} ↗
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden w-10 h-10 rounded-full border border-white/20 bg-white/40 dark:bg-white/10 text-ink dark:text-white flex items-center justify-center text-lg font-bold transition-all cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Glass Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md pt-24 px-6 md:hidden flex flex-col justify-between pb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-[#fff9fb] dark:bg-[#0e1424] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Menu Navigation</div>
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNav(item.id)}
                    className={`text-left text-lg font-bold py-3 px-4 rounded-2xl transition-all cursor-pointer ${
                      currentTab === item.id
                        ? 'bg-[#a855f7] text-white'
                        : 'text-gray-800 dark:text-gray-200 hover:bg-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => handleMobileNav('contact')}
                  className="w-full py-3.5 rounded-2xl bg-[#a855f7] text-white text-xs font-bold uppercase tracking-wider text-center cursor-pointer"
                >
                  {t('nav.cta', lang)} ↗
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
