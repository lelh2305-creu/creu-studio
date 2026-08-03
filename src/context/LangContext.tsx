'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Lang } from '@/lib/translations';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextType>({
  lang: 'vi',
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('creu_lang') as Lang;
    if (saved === 'vi' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('creu_lang', l);
  };

  const toggle = () => setLang(lang === 'vi' ? 'en' : 'vi');

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
