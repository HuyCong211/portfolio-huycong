'use client';

import { useState, useEffect } from 'react';
import { ActivityMoment } from '@/lib/types';
import { X, MapPin, Calendar, Tag, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface ImageModalProps {
  moment: ActivityMoment | null;
  onClose: () => void;
}

export default function ImageModal({ moment, onClose }: ImageModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Extract all photos: either from images array or fallback to single imageUrl
  const allImages = moment
    ? moment.images && moment.images.length > 0
      ? moment.images
      : [moment.imageUrl]
    : [];

  // Reset to first image when modal opens or moment changes
  useEffect(() => {
    setCurrentIdx(0);
  }, [moment]);

  // Keyboard navigation (Esc to close, Arrow keys to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentIdx((prev) => (prev + 1) % allImages.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
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
  }, [moment, onClose, allImages.length]);

  if (!moment) return null;

  const currentImage = allImages[currentIdx] || moment.imageUrl;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-all shadow-lg"
          aria-label="Đóng ảnh"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Main Photo Viewer Column (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 flex flex-col items-center justify-center relative min-h-[320px] lg:min-h-[500px] select-none">
            
            {/* Active Display Image */}
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[450px] flex items-center justify-center overflow-hidden bg-black/40">
              <img
                key={currentImage}
                src={currentImage}
                alt={`${moment.title} - Ảnh ${currentIdx + 1}`}
                className="w-full h-full object-contain animate-in fade-in duration-300"
              />

              {/* Photo Index Counter Badge */}
              {allImages.length > 1 && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-white text-xs font-semibold flex items-center gap-1.5 shadow">
                  <Images className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Ảnh {currentIdx + 1} / {allImages.length}
                  </span>
                </div>
              )}

              {/* Left / Prev Button */}
              {allImages.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 flex items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Right / Next Button */}
              {allImages.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 flex items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95"
                  aria-label="Ảnh kế tiếp"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Thumbnail Strip (if more than 1 photo) */}
            {allImages.length > 1 && (
              <div className="w-full p-2.5 bg-slate-950/95 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      currentIdx === idx
                        ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/30'
                        : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {moment.category === 'travel' && 'Du lịch & Khám phá'}
                  {moment.category === 'work' && 'Công tác & Khách hàng'}
                  {moment.category === 'family' && 'Gia đình & Đời sống'}
                  {moment.category === 'company' && 'FastWork Việt Nam'}
                </span>
                {allImages.length > 1 && (
                  <span className="text-xs text-slate-400 font-medium">
                    (Album {allImages.length} ảnh)
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {moment.title}
              </h3>

              <div className="space-y-2 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-slate-200">{moment.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-200">{moment.date}</span>
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
