'use client';

import { PersonalProfile } from '@/lib/types';
import {
  User,
  Heart,
  Compass,
  Building2,
  GraduationCap,
  MapPin,
  Calendar,
  CheckCircle2,
  Film,
  BookOpen,
  Plane
} from 'lucide-react';

interface AboutProps {
  profile: PersonalProfile;
}

export default function About({ profile }: AboutProps) {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>Giới thiệu bản thân</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Về tôi & Chặng đường theo đuổi <br className="hidden sm:block" />
            <span className="gradient-text">Nghề Phân Tích Nghiệp Vụ</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Hội tụ giữa nền tảng học thuật bài bản từ trường Đại học Công nghiệp Hà Nội và kinh nghiệm thực chiến phát triển giải pháp quản trị doanh nghiệp tại FastWork Việt Nam.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Story & Philosophy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Câu chuyện & Đam mê nghề nghiệp</h3>
                  <p className="text-xs text-slate-400">Tư duy hệ thống • Trách nhiệm • Thấu cảm người dùng</p>
                </div>
              </div>

              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {profile.bioLong}
              </div>

              {/* Core Working Principles */}
              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                  Triết lý làm việc của tôi:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300">
                      <strong>Hiểu đúng trước khi làm:</strong> Đào sâu nguyên nhân gốc rễ (Root Cause) thay vì chỉ nhìn vào triệu chứng bề nổi.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300">
                      <strong>Rõ ràng & Không mập mờ:</strong> Mọi tài liệu SRS, Flowchart đều phải mạch lạc, logic để Dev và QA bắt tay vào là chuẩn.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300">
                      <strong>Giá trị thực tiễn:</strong> Phần mềm chỉ thực sự tốt khi giải quyết được nút thắt vận hành và tiết kiệm chi phí cho khách hàng.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300">
                      <strong>Cầu tiến & Học hỏi liên tục:</strong> Chủ động cập nhật xu hướng công nghệ mới, AI hỗ trợ BA và các mô hình quản trị tân tiến.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hobbies Card */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2.5 text-rose-400">
                <Heart className="w-5 h-5 fill-rose-500/20" />
                <h3 className="font-bold text-base text-white">Sở thích cá nhân & Nguồn cảm hứng</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Ngoài thời gian phân tích quy trình và làm việc với các hệ thống phần mềm, tôi luôn dành thời gian tái tạo năng lượng và trau dồi vốn sống:
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {profile.hobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs font-medium text-slate-200 hover:border-indigo-500/50 hover:text-white transition-colors"
                  >
                    {idx === 0 && <Plane className="w-3.5 h-3.5 text-cyan-400" />}
                    {idx === 1 && <Film className="w-3.5 h-3.5 text-purple-400" />}
                    {idx === 2 && <BookOpen className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{hobby}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Fact Matrix (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Fact Box 1: Profile Summary */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                Thông tin hồ sơ tóm tắt
              </h3>

              <div className="space-y-3.5 divide-y divide-slate-800/80 text-sm">
                
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Họ và tên</span>
                  </span>
                  <span className="font-bold text-white">{profile.name}</span>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Ngày sinh</span>
                  </span>
                  <span className="font-semibold text-slate-200">{profile.birthDate}</span>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>Quê quán</span>
                  </span>
                  <span className="font-semibold text-slate-200">{profile.hometown}</span>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Nơi ở hiện tại</span>
                  </span>
                  <span className="font-semibold text-cyan-300">{profile.currentLocation}</span>
                </div>

                <div className="pt-3 flex flex-col gap-1">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span>Đơn vị công tác</span>
                  </span>
                  <span className="font-semibold text-indigo-300 pl-6">
                    {profile.company}
                  </span>
                </div>

                <div className="pt-3 flex flex-col gap-1">
                  <span className="text-slate-400 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>Chuyên ngành tốt nghiệp</span>
                  </span>
                  <span className="font-medium text-slate-200 pl-6 text-xs sm:text-sm">
                    {profile.education}
                  </span>
                </div>

              </div>
            </div>

            {/* Fact Box 2: Highlight numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-5 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-extrabold text-indigo-400">30+</div>
                <div className="text-xs text-slate-400">Tài liệu SRS & Flowchart nghiệp vụ</div>
              </div>

              <div className="glass-card p-5 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-extrabold text-cyan-400">100%</div>
                <div className="text-xs text-slate-400">Tiến độ Sprint bàn giao đúng cam kết</div>
              </div>

              <div className="glass-card p-5 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-extrabold text-emerald-400">2004</div>
                <div className="text-xs text-slate-400">Gen Z tràn đầy nhiệt huyết & đam mê</div>
              </div>

              <div className="glass-card p-5 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-extrabold text-purple-400">HaUI</div>
                <div className="text-xs text-slate-400">Trường CNTT&TT - ĐH Công nghiệp HN</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
