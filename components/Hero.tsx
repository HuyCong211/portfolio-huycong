'use client';

import { PersonalProfile } from '@/lib/types';
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  Send,
  FileText,
  Sparkles,
  ArrowDown
} from 'lucide-react';

interface HeroProps {
  profile: PersonalProfile;
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
      {/* Background ambient lighting and grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Profile Info */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Sẵn sàng kết nối dự án & chia sẻ cơ hội hợp tác</span>
            </div>

            {/* Main Title / Name */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Xin chào, tôi là <br className="hidden sm:block" />
                <span className="gradient-text">{profile.name}</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-300 flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>{profile.title}</span>
              </p>
            </div>

            {/* Bio summary */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {profile.bioShort}
            </p>

            {/* Quick Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Ngày sinh</div>
                  <div className="text-sm font-semibold text-slate-200">{profile.birthDate}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <Briefcase className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Đơn vị công tác</div>
                  <div className="text-sm font-semibold text-slate-200 truncate max-w-[180px]" title={profile.company}>
                    FastWork Việt Nam
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <GraduationCap className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Học vấn</div>
                  <div className="text-sm font-semibold text-slate-200 truncate max-w-[180px]" title={profile.education}>
                    Hệ thống thông tin - HaUI
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Khu vực</div>
                  <div className="text-sm font-semibold text-slate-200">{profile.currentLocation} • {profile.hometown}</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
              >
                <Send className="w-4 h-4" />
                <span>Liên hệ trao đổi công việc</span>
              </a>

              <a
                href="#journey"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all duration-200 text-sm sm:text-base"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Xem hồ sơ hành trình</span>
              </a>
            </div>

            {/* Social Icons row */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs text-slate-400 font-medium mr-1">Kết nối mạng xã hội:</span>
              {profile.socials.facebook && (
                <a
                  href={profile.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  title="Facebook"
                >
                  <span className="font-bold text-xs">FB</span>
                </a>
              )}
              {profile.socials.tiktok && (
                <a
                  href={profile.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-pink-600 border border-slate-800 hover:border-pink-500 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  title="TikTok"
                >
                  <span className="font-bold text-xs">TT</span>
                </a>
              )}
              {profile.socials.instagram && (
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  title="Instagram"
                >
                  <span className="font-bold text-xs">IG</span>
                </a>
              )}
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-700 border border-slate-800 hover:border-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  title="LinkedIn"
                >
                  <span className="font-bold text-xs">IN</span>
                </a>
              )}
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-800 hover:border-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  title="GitHub"
                >
                  <span className="font-bold text-xs">GH</span>
                </a>
              )}
            </div>

          </div>

          {/* Right Column: Hero Profile Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Outer decorative gradient border */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              
              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 backdrop-blur-xl shadow-2xl">
                
                {/* Image container */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 mb-5 border border-slate-800">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Floating role badge over image */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-indigo-400 font-semibold tracking-wide uppercase">Vị trí hiện tại</div>
                        <div className="text-sm font-bold text-white">Chuyên viên BA • FastWork VN</div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                        <Briefcase className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card footer details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2.5">
                    <span>Định hướng nghề nghiệp</span>
                    <span className="font-semibold text-emerald-400">Senior Business Analyst / PO</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Trọng tâm chuyên môn</span>
                    <span className="font-medium text-slate-300">SaaS, BPMN, BRD/SRS, Agile</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Scroll down indicator */}
        <div className="pt-16 flex justify-center">
          <a
            href="#about"
            className="flex flex-col items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <span>Cuộn xuống khám phá</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
}
