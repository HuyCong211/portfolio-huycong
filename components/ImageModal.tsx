'use client';

import { useEffect } from 'react';
import { ActivityMoment } from '@/lib/types';
import { X, MapPin, Calendar, Tag } from 'lucide-react';

interface ImageModalProps {
  moment: ActivityMoment | null;
  onClose: () => void;
}

export default function ImageModal({ moment, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (moment) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moment, onClose]);

  if (!moment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-all"
          aria-label="Đóng ảnh"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Image */}
          <div className="lg:col-span-7 bg-slate-950 flex items-center justify-center relative min-h-[300px] lg:min-h-[450px]">
            <img
              src={moment.imageUrl}
              alt={moment.title}
              className="w-full h-full object-cover max-h-[500px]"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {moment.category === 'travel' && 'Du lịch & Khám phá'}
                  {moment.category === 'work' && 'Công tác & Khách hàng'}
                  {moment.category === 'family' && 'Gia đình & Đời sống'}
                  {moment.category === 'company' && 'FastWork Việt Nam'}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {moment.title}
              </h3>

              <div className="space-y-2 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{moment.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{moment.date}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                {moment.description}
              </p>
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Tag className="w-3.5 h-3.5" />
                <span>Thẻ gắn:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {moment.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-medium text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
