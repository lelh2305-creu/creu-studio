'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ currentTab, onTabChange, isDark, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'Work' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <a className="logo" onClick={() => onTabChange('home')}>
        <b>CREU</b><i>✱</i>
      </a>

      <div className="navlinks">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <a
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={isActive ? 'on' : ''}
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

      <div className="flex items-center gap-3">
        {/* Theme Switcher Button */}
        <button
          className="theme-btn"
          onClick={onToggleTheme}
          title={isDark ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối (GitHub Dark)'}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        <button className="talk" onClick={() => onTabChange('contact')}>
          Let's talk ↗
        </button>
      </div>
    </nav>
  );
}
