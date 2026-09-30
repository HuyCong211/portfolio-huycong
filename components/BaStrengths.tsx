'use client';

import { useState } from 'react';
import { BaStrength } from '@/lib/types';
import {
  Sparkles,
  MessageSquareText,
  GitBranch,
  FileSpreadsheet,
  LayoutTemplate,
  Database,
  Kanban,
  Users,
  Briefcase,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface BaStrengthsProps {
  strengths: BaStrength[];
}

// Icon mapper helper
const renderIcon = (name: string) => {
  switch (name) {
    case 'MessageSquareText':
      return <MessageSquareText className="w-5 h-5 text-indigo-400" />;
    case 'GitBranch':
      return <GitBranch className="w-5 h-5 text-cyan-400" />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    case 'LayoutTemplate':
      return <LayoutTemplate className="w-5 h-5 text-amber-400" />;
    case 'Database':
      return <Database className="w-5 h-5 text-purple-400" />;
    case 'Kanban':
      return <Kanban className="w-5 h-5 text-blue-400" />;
    case 'Users':
      return <Users className="w-5 h-5 text-rose-400" />;
    case 'Briefcase':
      return <Briefcase className="w-5 h-5 text-indigo-400" />;
    default:
      return <BarChart3 className="w-5 h-5 text-indigo-400" />;
  }
};

export default function BaStrengths({ strengths }: BaStrengthsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất cả năng lực' },
    { id: 'core', label: 'Nghiệp vụ cốt lõi' },
    { id: 'technical', label: 'Kỹ thuật & Tài liệu' },
    { id: 'management', label: 'Quản trị Agile/Scrum' },
    { id: 'soft-skills', label: 'Giao tiếp & Stakeholder' },
  ];

  const filteredStrengths =
    activeCategory === 'all'
      ? strengths
      : strengths.filter((s) => s.category === activeCategory);

  return (
    <section id="strengths" className="py-24 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Năng lực chuyên môn</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Thế Mạnh & Bộ Kỹ Năng <br className="hidden sm:block" />
            <span className="gradient-text">IT Business Analyst</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Kết hợp toàn diện giữa tư duy nghiệp vụ sắc sảo, kỹ năng tài liệu hóa chuẩn quốc tế và khả năng thấu hiểu kiến trúc kỹ thuật hệ thống.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredStrengths.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 border border-slate-800/80 hover:border-indigo-500/40"
            >
              <div className="space-y-4">
                {/* Header: Icon, Title, and Level */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                      {renderIcon(item.iconName)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                        {item.category === 'core' && 'Nghiệp vụ Cốt Lõi'}
                        {item.category === 'technical' && 'Kỹ thuật & Hệ thống'}
                        {item.category === 'management' && 'Agile & Quản trị'}
                        {item.category === 'soft-skills' && 'Giao tiếp & Đàm phán'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    {item.level}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.level}%` }}
                  />
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                {/* Bullet details */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools and Tech Stack Badges */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl glass-panel text-center max-w-4xl mx-auto space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Công Cụ & Tiêu Chuẩn Thực Hành Thường Xuyên
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              'BPMN 2.0',
              'UML Diagrams',
              'Draw.io / Lucidchart',
              'Figma Wireframing',
              'Jira & Confluence',
              'PostgreSQL & MySQL',
              'Postman API Testing',
              'Notion & Trello',
              'FastWork SaaS Platform',
              'Scrum / Kanban',
              'BABOK Guide Principles',
              'User Story Mapping'
            ].map((tool, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
