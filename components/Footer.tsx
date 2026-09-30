'use client';

import Link from 'next/link';
import { ArrowUp, Heart, Shield } from 'lucide-react';
import { PersonalProfile } from '@/lib/types';

interface FooterProps {
  profile: PersonalProfile;
}

export default function Footer({ profile }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand info */}
          <div className="text-center md:text-left space-y-1">
            <div className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <span className="gradient-text">{profile.name}</span>
              <span className="text-xs text-slate-500 font-normal">| {profile.title}</span>
            </div>
            <p className="text-xs text-slate-400">
              {profile.company} • Tốt nghiệp {profile.education}
            </p>
          </div>

          {/* Quick links & Back to Top */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <a href="#hero" className="hover:text-indigo-400 transition-colors">Đầu trang</a>
            <a href="#about" className="hover:text-indigo-400 transition-colors">Về tôi</a>
            <a href="#strengths" className="hover:text-indigo-400 transition-colors">Thế mạnh BA</a>
            <a href="#journey" className="hover:text-indigo-400 transition-colors">Hành trình</a>
            <a href="#moments" className="hover:text-indigo-400 transition-colors">Khoảnh khắc</a>
            <a href="#contact" className="hover:text-indigo-400 transition-colors">Liên hệ</a>

            <Link
              href="/admin"
              className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 px-2 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
            >
              <Shield className="w-3 h-3 text-indigo-400" />
              <span>Admin CMS</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center justify-center"
              aria-label="Về đầu trang"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Nguyễn Huy Công. Bản quyền thuộc về tác giả.
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <span>Xây dựng với tâm huyết & phong cách của IT Business Analyst</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
}
