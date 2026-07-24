'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === '123455') {
      setError('');
      localStorage.setItem('creu_admin_auth', 'true');
      onLoginSuccess();
      onClose();
    } else {
      setError('✕ Sai ID hoặc Mật khẩu! (ID: admin / Mật khẩu: 123455)');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="w-full max-w-md bg-[#0e1424] border border-white/20 rounded-3xl p-8 text-white shadow-2xl space-y-6"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#c499f5] flex items-center justify-center mx-auto text-xl font-bold">
                🔐
              </div>
              <h2 className="text-xl font-bold tracking-wide text-white">Đăng Nhập Quản Trị CREU</h2>
              <p className="text-xs text-gray-400">Vui lòng nhập ID và Mật khẩu để bật chế độ chỉnh sửa</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">ID Đăng Nhập</label>
                <input
                  type="text"
                  placeholder="Nhập ID (admin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-[#141c30] border border-white/15 rounded-xl text-sm text-white focus:border-[#a855f7] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Mật Khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập Mật Khẩu (123455)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#141c30] border border-white/15 rounded-xl text-sm text-white focus:border-[#a855f7] outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-3 rounded-xl border border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
                >
                  Đăng Nhập ➔
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
