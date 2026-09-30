'use client';

import { useState } from 'react';
import { ActivityMoment } from '@/lib/types';
import { Camera, MapPin, Calendar, Maximize2, Sparkles } from 'lucide-react';
import ImageModal from './ImageModal';

interface MomentsGalleryProps {
  activities: ActivityMoment[];
}

export default function MomentsGallery({ activities }: MomentsGalleryProps) {
  const [selectedMoment, setSelectedMoment] = useState<ActivityMoment | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'Tất cả khoảnh khắc' },
    { id: 'travel', label: 'Du lịch khám phá' },
    { id: 'work', label: 'Công tác & Khách hàng' },
    { id: 'family', label: 'Gia đình & Đời sống' },
    { id: 'company', label: 'FastWork Việt Nam' },
  ];

  const filtered =
    filter === 'all'
      ? activities
      : activities.filter((act) => act.category === filter);

  return (
    <section id="moments" className="py-24 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Hoạt động cá nhân & Kỷ niệm</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Những Khoảnh Khắc <span className="gradient-text">Đáng Nhớ</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Những chuyến đi mở rộng tầm nhìn, những buổi hội thảo cùng khách hàng doanh nghiệp và khoảnh khắc ấm áp bên gia đình.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMoment(item)}
              className="group glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between border border-slate-800/80 hover:border-indigo-500/50"
            >
              {/* Image with zoom on hover */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 group-hover:from-slate-950/90 transition-all duration-300" />
                
                {/* Category Pill on top-left */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-slate-700/60 shadow">
                    {item.category === 'travel' && 'Du lịch'}
                    {item.category === 'work' && 'Công tác'}
                    {item.category === 'family' && 'Gia đình'}
                    {item.category === 'company' && 'FastWork'}
                  </span>
                </div>

                {/* Multiple Images Counter Pill */}
                {item.images && item.images.length > 1 && (
                  <div className="absolute top-3 right-12">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-950/85 backdrop-blur-md text-cyan-300 border border-slate-700/60 flex items-center gap-1 shadow">
                      <Camera className="w-3 h-3" />
                      <span>{item.images.length} ảnh</span>
                    </span>
                  </div>
                )}

                {/* Enlarge icon on top-right */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Date & Location at bottom over image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                  <span className="flex items-center gap-1 truncate max-w-[60%]">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.date}</span>
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  {item.tags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Image Zoom Modal */}
      <ImageModal
        moment={selectedMoment}
        onClose={() => setSelectedMoment(null)}
      />
    </section>
  );
}
