'use client';

import React from 'react';

export default function MessengerWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-auto">
      {/* Zalo Button (Top) */}
      <a
        href="https://zalo.me/0931893567"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo với CREU Studio"
        className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#0068FF] hover:bg-[#0052CC] text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border border-white/20"
        style={{
          boxShadow: '0 8px 32px rgba(0, 104, 255, 0.45)',
        }}
      >
        <div className="relative w-7 h-7 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="relative z-10">
            <path d="M14 2C7.373 2 2 6.925 2 13c0 3.226 1.522 6.103 3.926 8.076L5 26l5.17-2.585A12.57 12.57 0 0014 24c6.627 0 12-4.925 12-11S20.627 2 14 2z" fill="white"/>
            <path d="M8.5 11.5h2M12.5 11.5h7M8.5 15h5M15.5 15h1" stroke="#0068FF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-xs font-bold tracking-wide uppercase pr-1 hidden sm:inline-block">
          Chat Zalo
        </span>
      </a>

      {/* Messenger Button (Bottom) */}
      <a
        href="https://m.me/101197947900494"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Messenger với CREU Studio"
        className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border border-white/20"
        style={{
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.45)',
        }}
      >
        <div className="relative w-7 h-7 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 relative z-10">
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.909 1.458 5.505 3.743 7.162V22l3.414-1.874c.895.248 1.84.385 2.843.385 5.523 0 10-4.145 10-9.253C22 6.145 17.523 2 12 2zm1.082 12.433l-2.584-2.757-5.042 2.757 5.546-5.887 2.646 2.757 4.98-2.757-5.546 5.887z" />
          </svg>
        </div>
        <span className="text-xs font-bold tracking-wide uppercase pr-1 hidden sm:inline-block">
          Chat Messenger
        </span>
      </a>
    </div>
  );
}
