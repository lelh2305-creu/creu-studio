'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InlineEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: { key: string; label: string; value: string; type?: 'text' | 'textarea' | 'image' | 'select'; options?: string[] }[];
  onSave: (updatedFields: Record<string, string>) => void;
}

export default function InlineEditModal({ isOpen, onClose, title, fields, onSave }: InlineEditModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      initial[f.key] = f.value || '';
    });
    setFormData(initial);
  }, [fields, isOpen]);

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (result.success) {
        setFormData((prev) => ({ ...prev, [key]: result.url }));
      } else {
        alert('Upload ảnh thất bại');
      }
    } catch {
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md grid place-items-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="w-full max-w-lg bg-[#0e1424] border border-white/20 rounded-3xl p-7 text-white shadow-2xl space-y-5"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold tracking-wide text-[#c499f5] flex items-center gap-2">
                <span>✏️</span> {title}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-400">
                    {f.label}
                  </label>

                  {f.type === 'textarea' ? (
                    <textarea
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-[#141c30] border border-white/15 rounded-xl text-sm text-white focus:border-[#a855f7] outline-none resize-none"
                    />
                  ) : f.type === 'image' ? (
                    <div className="space-y-2">
                      {formData[f.key] && (
                        <img
                          src={formData[f.key]}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-xl border border-white/20"
                        />
                      )}
                      <div className="flex gap-2 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleImageUpload(f.key, e.target.files[0]);
                          }}
                          className="text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#a855f7] file:text-white hover:file:bg-[#9333ea]"
                        />
                        {uploadingKey === f.key && <span className="text-xs text-purple-400 animate-pulse">Đang tải...</span>}
                      </div>
                    </div>
                  ) : f.type === 'select' ? (
                    <select
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#141c30] border border-white/15 rounded-xl text-sm text-white focus:border-[#a855f7] outline-none"
                    >
                      {(f.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#141c30] border border-white/15 rounded-xl text-sm text-white focus:border-[#a855f7] outline-none"
                    />
                  )}
                </div>
              ))}

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-xs uppercase font-bold tracking-wider text-white shadow-lg transition-all"
                >
                  LưuThay Đổi 💾
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
