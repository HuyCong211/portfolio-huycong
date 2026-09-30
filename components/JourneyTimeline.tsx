'use client';

import { JourneyItem } from '@/lib/types';
import {
  Milestone,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface JourneyTimelineProps {
  journey: JourneyItem[];
}

export default function JourneyTimeline({ journey }: JourneyTimelineProps) {
  return (
    <section id="journey" className="py-24 relative overflow-hidden bg-slate-950/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Milestone className="w-3.5 h-3.5" />
            <span>Hành trình phát triển</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kinh Nghiệm & <span className="gradient-text">Dấu Mốc Quan Trọng</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Từng chặng đường học tập, rèn luyện và cống hiến thực chiến trong ngành công nghệ thông tin.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500 before:to-slate-800">
          {journey.map((item, index) => (
            <div key={item.id} className="relative group">
              
              {/* Timeline Pin Indicator */}
              <div
                className={`absolute -left-[30px] sm:-left-[42px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  item.isCurrent
                    ? 'bg-indigo-600 border-white text-white shadow-lg shadow-indigo-500/50 scale-110 ring-4 ring-indigo-500/20'
                    : item.type === 'work'
                    ? 'bg-slate-900 border-indigo-400 text-indigo-400'
                    : item.type === 'education'
                    ? 'bg-slate-900 border-purple-400 text-purple-400'
                    : 'bg-slate-900 border-emerald-400 text-emerald-400'
                }`}
              >
                {item.type === 'work' && <Briefcase className="w-3.5 h-3.5" />}
                {item.type === 'education' && <GraduationCap className="w-3.5 h-3.5" />}
                {item.type === 'achievement' && <Award className="w-3.5 h-3.5" />}
              </div>

              {/* Content Card */}
              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-800/80 group-hover:border-indigo-500/40">
                
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                        item.isCurrent
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {item.period}
                    </span>
                    {item.isCurrent && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Đang công tác
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Title & Organization */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                  {item.role}
                </h3>
                <div className="text-sm font-semibold text-cyan-300 mb-3">
                  {item.organization}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Highlights List */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800/60">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Dấu ấn & Trọng tâm:
                    </div>
                    {item.highlights.map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
