'use client';

import { useState } from 'react';
import { PersonalProfile } from '@/lib/types';
import {
  Mail,
  Phone,
  MapPin,
  Building,
  Send,
  CheckCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ContactSectionProps {
  profile: PersonalProfile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      setErrorMessage('Vui lòng điền đầy đủ Họ tên, Email và Lời nhắn.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng liên hệ trực tiếp qua Email hoặc SĐT.');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-950/80">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Kết nối & Hợp tác</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Liên Hệ Với <span className="gradient-text">Nguyễn Huy Công</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Tôi luôn sẵn sàng đón nhận các cơ hội hợp tác dự án phân tích nghiệp vụ, tư vấn giải pháp phần mềm hoặc đơn giản là trò chuyện chia sẻ về nghề BA.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct info & Social links (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Thông tin kết nối trực tiếp</span>
              </h3>

              {/* Contact methods */}
              <div className="space-y-4">
                
                {/* Phone */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between group hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-medium">Số điện thoại / Zalo</div>
                      <a href={`tel:${profile.phone}`} className="text-sm font-semibold text-white hover:text-indigo-400">
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.phone, 'phone')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Sao chép SĐT"
                  >
                    {copiedType === 'phone' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Email */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between group hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-3 truncate mr-2">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="text-[11px] text-slate-400 uppercase font-medium">Hòm thư điện tử</div>
                      <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-white hover:text-cyan-400 truncate block">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.email, 'email')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 transition-colors"
                    title="Sao chép Email"
                  >
                    {copiedType === 'email' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Locations */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xs sm:text-sm">
                    <div className="text-[11px] text-slate-400 uppercase font-medium">Địa chỉ & Khu vực</div>
                    <div className="font-semibold text-slate-200">
                      Hiện tại: {profile.currentLocation}
                    </div>
                    <div className="text-slate-400 text-xs">
                      Quê quán: {profile.hometown}
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="text-xs sm:text-sm">
                    <div className="text-[11px] text-slate-400 uppercase font-medium">Nơi làm việc</div>
                    <div className="font-semibold text-slate-200">
                      {profile.company}
                    </div>
                  </div>
                </div>

              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mạng Xã Hội Cá Nhân
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {profile.socials.facebook && (
                    <a
                      href={profile.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 hover:bg-blue-600/10 text-slate-300 hover:text-white transition-all text-xs font-semibold"
                    >
                      <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">f</div>
                      <span>Facebook</span>
                    </a>
                  )}

                  {profile.socials.tiktok && (
                    <a
                      href={profile.socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/60 hover:bg-pink-600/10 text-slate-300 hover:text-white transition-all text-xs font-semibold"
                    >
                      <div className="w-5 h-5 rounded bg-pink-600 text-white flex items-center justify-center font-bold text-[10px]">T</div>
                      <span>TikTok</span>
                    </a>
                  )}

                  {profile.socials.instagram && (
                    <a
                      href={profile.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 hover:bg-purple-600/10 text-slate-300 hover:text-white transition-all text-xs font-semibold"
                    >
                      <div className="w-5 h-5 rounded bg-gradient-to-tr from-amber-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px]">IG</div>
                      <span>Instagram</span>
                    </a>
                  )}

                  {profile.socials.linkedin && (
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-600/60 hover:bg-blue-700/10 text-slate-300 hover:text-white transition-all text-xs font-semibold"
                    >
                      <div className="w-5 h-5 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-[10px]">in</div>
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {profile.socials.github && (
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-500 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs font-semibold"
                    >
                      <div className="w-5 h-5 rounded bg-slate-700 text-white flex items-center justify-center font-bold text-[10px]">GH</div>
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Send Email Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[2px]">
                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Gửi lời nhắn trực tiếp</h3>
                    <p className="text-xs text-slate-400">Tin nhắn sẽ được lưu vào hệ thống và gửi thông báo</p>
                  </div>
                </div>
              </div>

              {/* Status Alert Banner */}
              {status === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <strong>Gửi thành công!</strong> Cảm ơn bạn đã để lại lời nhắn. Nguyễn Huy Công sẽ phản hồi bạn trong thời gian sớm nhất qua email hoặc điện thoại.
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Họ và tên của bạn <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Địa chỉ Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ban@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Số điện thoại (tùy chọn)
                    </label>
                    <input
                      type="tel"
                      placeholder="09xx xxx xxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Tiêu đề liên hệ
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Trao đổi dự án BA / Phân tích hệ thống"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Nội dung lời nhắn <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Mô tả ngắn gọn về nhu cầu hợp tác, dự án hoặc nội dung bạn muốn trao đổi cùng Huy Công..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
                  />
                </div>

                {/* Submit button & Mailto fallback */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {status === 'submitting' ? (
                      <span>Đang gửi thông điệp...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Gửi Lời Nhắn Ngay</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${profile.email}?subject=${encodeURIComponent(
                      formData.subject || 'Liên hệ từ landing page cá nhân'
                    )}&body=${encodeURIComponent(
                      `Họ tên: ${formData.fullName}\nSĐT: ${formData.phone}\n\nLời nhắn:\n${formData.message}`
                    )}`}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                    title="Mở ứng dụng Email của bạn"
                  >
                    <span>Mở app Mail</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
