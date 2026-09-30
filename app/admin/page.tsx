'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PortfolioData,
  PersonalProfile,
  JourneyItem,
  ActivityMoment,
  BaStrength,
  ContactMessage
} from '@/lib/types';
import { initialPortfolioData } from '@/lib/default-data';
import {
  Shield,
  KeyRound,
  User,
  Milestone,
  Camera,
  Sparkles,
  Mail,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Eye,
  LogOut,
  Calendar,
  Building,
  GraduationCap,
  MapPin,
  Clock,
  Phone,
  Copy,
  Database,
  Images,
  Star,
  ImagePlus
} from 'lucide-react';

// Nén và chuyển đổi ảnh sang Base64 chuẩn WebP/JPEG chất lượng cao, dung lượng nhẹ
function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentPin, setCurrentPin] = useState('2101');

  // Portfolio state
  const [portfolio, setPortfolio] = useState<PortfolioData>(initialPortfolioData);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'journey' | 'moments' | 'strengths' | 'messages' | 'backup'
  >('profile');

  // Feedback status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Editing modals / draft state
  const [editingJourney, setEditingJourney] = useState<JourneyItem | null>(null);
  const [editingMoment, setEditingMoment] = useState<ActivityMoment | null>(null);
  const [editingStrength, setEditingStrength] = useState<BaStrength | null>(null);

  // Check existing session
  useEffect(() => {
    const savedPin = sessionStorage.getItem('huycong_admin_pin');
    if (savedPin) {
      verifyAndLogin(savedPin);
    }
  }, []);

  const verifyAndLogin = async (pinToTest: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinToTest })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setCurrentPin(pinToTest);
        sessionStorage.setItem('huycong_admin_pin', pinToTest);
        loadData(pinToTest);
      } else {
        setAuthError(data.error || 'Mã PIN không đúng.');
      }
    } catch (e) {
      setAuthError('Không thể kết nối máy chủ');
    }
  };

  const loadData = async (pin: string) => {
    try {
      // Load portfolio data
      const resProf = await fetch('/api/profile');
      if (resProf.ok) {
        const profData = await resProf.json();
        if (profData && profData.profile) {
          setPortfolio(profData);
        }
      }

      // Load contact messages
      const resMsg = await fetch(`/api/contact?pin=${encodeURIComponent(pin)}`);
      if (resMsg.ok) {
        const msgData = await resMsg.json();
        if (msgData && msgData.messages) {
          setMessages(msgData.messages);
        }
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    verifyAndLogin(pinInput);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('huycong_admin_pin');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Save all portfolio data
  const handleSaveAll = async () => {
    setSaveStatus('saving');
    // Thêm timestamp để đánh dấu đây là dữ liệu đã được chỉnh sửa (không phải mặc định)
    const portfolioWithTimestamp = { ...portfolio, _savedAt: new Date().toISOString() };
    // Luôn lưu tức thì vào LocalStorage để trình duyệt lập tức hiển thị nội dung mới nhất
    try {
      localStorage.setItem('huycong_portfolio_data_v1', JSON.stringify(portfolioWithTimestamp));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio: portfolioWithTimestamp, pin: currentPin })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSaveStatus('saved');
        if (data.persistedTo === 'cloud_kv') {
          setStatusMessage('Đã lưu thành công vào cơ sở dữ liệu đám mây Vercel KV!');
        } else if (data.persistedTo === 'local_file') {
          setStatusMessage('Đã lưu thành công vào file hệ thống máy chủ!');
        } else {
          setStatusMessage('Đã lưu dữ liệu vào bộ nhớ trình duyệt!');
        }
        setTimeout(() => setSaveStatus('idle'), 4000);
      } else {
        // Fallback lưu trên trình duyệt thành công
        setSaveStatus('saved');
        setStatusMessage('Đã lưu vào bộ nhớ thiết bị của bạn!');
        setTimeout(() => setSaveStatus('idle'), 4000);
      }
    } catch (err: any) {
      // Offline / network fallback
      setSaveStatus('saved');
      setStatusMessage('Đã lưu vào bộ nhớ cục bộ thiết bị của bạn!');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}&pin=${encodeURIComponent(currentPin)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    } catch (e) {
      alert('Lỗi khi xóa tin nhắn');
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(portfolio, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `portfolio-huycong-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.profile) {
            setPortfolio(parsed);
            alert('Nhập dữ liệu thành công! Hãy bấm "Lưu Thay Đổi" để cập nhật.');
          } else {
            alert('File JSON không đúng cấu trúc portfolio.');
          }
        } catch (error) {
          alert('Lỗi khi đọc file JSON.');
        }
      };
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (confirm('Khôi phục toàn bộ thông tin về dữ liệu mặc định ban đầu? Các dữ liệu đã chỉnh sửa sẽ bị ghi đè.')) {
      setPortfolio(initialPortfolioData);
      alert('Đã tải lại dữ liệu mặc định. Bấm "Lưu Thay Đổi" để áp dụng lên máy chủ.');
    }
  };

  // If not logged in, show PIN lock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white">Quản Trị Portfolio</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Khu vực dành riêng cho <strong>Nguyễn Huy Công</strong> để cập nhật hành trình, thông tin cá nhân và quản lý tin nhắn.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Mã PIN bảo mật
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Nhập mã PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 tracking-widest text-center"
                />
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Mở khóa Quản trị</span>
              <Shield className="w-4 h-4" />
            </button>
          </form>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gợi ý :</span>
            </div>
            <p>
              <strong>2101</strong> ().
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center justify-center gap-1"
            >
              <span>← Quay lại Landing Page xem trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard UI
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow">
            HC
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Hệ Thống Quản Trị Portfolio</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Admin Panel
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Quản lý bởi {portfolio.profile.name} (IT Business Analyst)
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Xem Landing Page</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saveStatus === 'saving' ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Status banner */}
      {saveStatus === 'saved' && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-300 px-4 py-2 text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="bg-rose-950/80 border-b border-rose-500/40 text-rose-300 px-4 py-2 text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          {[
            { id: 'profile', label: 'Thông tin cá nhân', icon: User },
            { id: 'journey', label: `Hành trình & Kinh nghiệm (${portfolio.journey.length})`, icon: Milestone },
            { id: 'moments', label: `Khoảnh khắc & Ảnh (${portfolio.activities.length})`, icon: Camera },
            { id: 'strengths', label: `Thế mạnh BA (${portfolio.strengths.length})`, icon: Sparkles },
            { id: 'messages', label: `Hộp thư Liên hệ (${messages.length})`, icon: Mail },
            { id: 'backup', label: 'Sao lưu & Cài đặt', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Profile Info */}
        {activeTab === 'profile' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Chỉnh sửa thông tin cá nhân</h2>
                <p className="text-xs text-slate-400">Cập nhật hồ sơ BA, công ty, trường học và liên kết mạng xã hội</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Họ và tên</label>
                <input
                  type="text"
                  value={portfolio.profile.name}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, name: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Ngày sinh</label>
                <input
                  type="text"
                  value={portfolio.profile.birthDate}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, birthDate: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Chức danh / Nghề nghiệp</label>
                <input
                  type="text"
                  value={portfolio.profile.title}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, title: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Quê quán</label>
                <input
                  type="text"
                  value={portfolio.profile.hometown}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, hometown: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nơi sinh sống hiện tại</label>
                <input
                  type="text"
                  value={portfolio.profile.currentLocation}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, currentLocation: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Đơn vị công tác (Công ty)</label>
                <input
                  type="text"
                  value={portfolio.profile.company}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, company: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Chuyên ngành tốt nghiệp (Trường)</label>
                <input
                  type="text"
                  value={portfolio.profile.education}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, education: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  value={portfolio.profile.phone}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, phone: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email công việc</label>
                <input
                  type="email"
                  value={portfolio.profile.email}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, email: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Ảnh đại diện (Avatar)</label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Chọn ảnh đại diện từ máy tính</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            const dataUrl = await compressImage(e.target.files[0], 800, 800, 0.85);
                            setPortfolio({
                              ...portfolio,
                              profile: { ...portfolio.profile, avatarUrl: dataUrl }
                            });
                          } catch (err) {
                            alert('Lỗi khi tải ảnh');
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                    <img
                      src={portfolio.profile.avatarUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Hoặc dán đường link ảnh..."
                      value={portfolio.profile.avatarUrl}
                      onChange={(e) =>
                        setPortfolio({
                          ...portfolio,
                          profile: { ...portfolio.profile, avatarUrl: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                    <div className="text-[11px] text-slate-400">
                      Hỗ trợ tải trực tiếp ảnh từ máy tính (tự động tối ưu dung lượng) hoặc dán link ảnh web.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Giới thiệu ngắn (Hero bio)</label>
                <textarea
                  rows={2}
                  value={portfolio.profile.bioShort}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, bioShort: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Giới thiệu chi tiết (Về tôi & Triết lý)</label>
                <textarea
                  rows={4}
                  value={portfolio.profile.bioLong}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      profile: { ...portfolio.profile, bioLong: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Social Links Sub-Section */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                Đường dẫn Mạng Xã Hội
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Link Facebook</label>
                  <input
                    type="text"
                    value={portfolio.profile.socials.facebook}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, facebook: e.target.value }
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Link TikTok</label>
                  <input
                    type="text"
                    value={portfolio.profile.socials.tiktok}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, tiktok: e.target.value }
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Link Instagram</label>
                  <input
                    type="text"
                    value={portfolio.profile.socials.instagram}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, instagram: e.target.value }
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Link LinkedIn</label>
                  <input
                    type="text"
                    value={portfolio.profile.socials.linkedin}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, linkedin: e.target.value }
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Link GitHub</label>
                  <input
                    type="text"
                    value={portfolio.profile.socials.github}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, github: e.target.value }
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Hobbies list management */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
                Sở Thích Cá Nhân
              </h3>
              <div className="space-y-2">
                {portfolio.profile.hobbies.map((hobby, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hobby}
                      onChange={(e) => {
                        const newHobbies = [...portfolio.profile.hobbies];
                        newHobbies[hIdx] = e.target.value;
                        setPortfolio({
                          ...portfolio,
                          profile: { ...portfolio.profile, hobbies: newHobbies }
                        });
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        const newHobbies = portfolio.profile.hobbies.filter((_, idx) => idx !== hIdx);
                        setPortfolio({
                          ...portfolio,
                          profile: { ...portfolio.profile, hobbies: newHobbies }
                        });
                      }}
                      className="p-2 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPortfolio({
                      ...portfolio,
                      profile: {
                        ...portfolio.profile,
                        hobbies: [...portfolio.profile.hobbies, 'Sở thích mới']
                      }
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm sở thích</span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveAll}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white text-sm shadow-md"
              >
                Lưu thông tin cá nhân
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Journey & Experience */}
        {activeTab === 'journey' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Quản lý Hành trình & Kinh nghiệm</h2>
                <p className="text-xs text-slate-400">Thêm, sửa, sắp xếp các mốc học tập và công tác</p>
              </div>
              <button
                onClick={() => {
                  const newItem: JourneyItem = {
                    id: 'journey-' + Date.now(),
                    period: '2026 - Tương lai',
                    role: 'Vị trí công việc mới',
                    organization: 'Tên cơ quan / Công ty',
                    location: 'Hà Nội',
                    type: 'work',
                    description: 'Mô tả tóm tắt vai trò và trách nhiệm...',
                    highlights: ['Dấu ấn hoặc thành tích nổi bật 1']
                  };
                  setPortfolio({
                    ...portfolio,
                    journey: [newItem, ...portfolio.journey]
                  });
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm mốc hành trình mới</span>
              </button>
            </div>

            {/* Journey List */}
            <div className="space-y-4">
              {portfolio.journey.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => {
                          const updated = [...portfolio.journey];
                          updated[idx].period = e.target.value;
                          setPortfolio({ ...portfolio, journey: updated });
                        }}
                        className="px-3 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-bold text-indigo-400 w-36"
                      />
                      <select
                        value={item.type}
                        onChange={(e) => {
                          const updated = [...portfolio.journey];
                          updated[idx].type = e.target.value as any;
                          setPortfolio({ ...portfolio, journey: updated });
                        }}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-300"
                      >
                        <option value="work">Công việc (Work)</option>
                        <option value="education">Học vấn (Education)</option>
                        <option value="achievement">Thành tựu (Achievement)</option>
                      </select>
                      <label className="flex items-center gap-1.5 text-xs text-emerald-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isCurrent || false}
                          onChange={(e) => {
                            const updated = [...portfolio.journey];
                            updated[idx].isCurrent = e.target.checked;
                            setPortfolio({ ...portfolio, journey: updated });
                          }}
                        />
                        <span>Đang làm việc tại đây</span>
                      </label>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Xóa mốc hành trình này?')) {
                          setPortfolio({
                            ...portfolio,
                            journey: portfolio.journey.filter((_, i) => i !== idx)
                          });
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Chức vụ / Ngành học</label>
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => {
                          const updated = [...portfolio.journey];
                          updated[idx].role = e.target.value;
                          setPortfolio({ ...portfolio, journey: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Cơ quan / Trường học</label>
                      <input
                        type="text"
                        value={item.organization}
                        onChange={(e) => {
                          const updated = [...portfolio.journey];
                          updated[idx].organization = e.target.value;
                          setPortfolio({ ...portfolio, journey: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Địa điểm</label>
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => {
                          const updated = [...portfolio.journey];
                          updated[idx].location = e.target.value;
                          setPortfolio({ ...portfolio, journey: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Mô tả tổng quát</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...portfolio.journey];
                        updated[idx].description = e.target.value;
                        setPortfolio({ ...portfolio, journey: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-indigo-400">
                        Các gạch đầu dòng nổi bật (Highlights)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...portfolio.journey];
                          updated[idx].highlights = [...(updated[idx].highlights || []), 'Dấu ấn mới...'];
                          setPortfolio({ ...portfolio, journey: updated });
                        }}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        + Thêm dòng
                      </button>
                    </div>
                    {item.highlights?.map((hl, hlIdx) => (
                      <div key={hlIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) => {
                            const updated = [...portfolio.journey];
                            updated[idx].highlights[hlIdx] = e.target.value;
                            setPortfolio({ ...portfolio, journey: updated });
                          }}
                          className="flex-1 px-3 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-300"
                        />
                        <button
                          onClick={() => {
                            const updated = [...portfolio.journey];
                            updated[idx].highlights = updated[idx].highlights.filter((_, i) => i !== hlIdx);
                            setPortfolio({ ...portfolio, journey: updated });
                          }}
                          className="text-rose-400 hover:text-rose-300 text-xs p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveAll}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white text-sm shadow-md"
              >
                Lưu hành trình
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Moments Gallery */}
        {activeTab === 'moments' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Quản lý Khoảnh Khắc & Link Ảnh</h2>
                <p className="text-xs text-slate-400">
                  Cập nhật ảnh du lịch, buổi công tác, làm việc với khách hàng hoặc khoảnh khắc bên gia đình
                </p>
              </div>
              <button
                onClick={() => {
                  const newMoment: ActivityMoment = {
                    id: 'act-' + Date.now(),
                    title: 'Chuyến đi / Hoạt động mới',
                    category: 'travel',
                    date: 'Tháng ' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),
                    location: 'Địa điểm',
                    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
                    description: 'Mô tả kỷ niệm và cảm xúc về hoạt động này...',
                    tags: ['Kỷ niệm', 'Mới']
                  };
                  setPortfolio({
                    ...portfolio,
                    activities: [newMoment, ...portfolio.activities]
                  });
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm khoảnh khắc ảnh mới</span>
              </button>
            </div>

            {/* Activities list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.activities.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Cover Image & Album Preview */}
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow">
                          <Star className="w-3 h-3 fill-amber-300" />
                          <span>Ảnh bìa đại diện</span>
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => {
                            if (confirm('Xóa toàn bộ khoảnh khắc này?')) {
                              setPortfolio({
                                ...portfolio,
                                activities: portfolio.activities.filter((_, i) => i !== idx)
                              });
                            }
                          }}
                          className="p-2 rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-700 shadow"
                          title="Xóa khoảnh khắc"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Multi-image Album Uploader */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                          <Images className="w-3.5 h-3.5" />
                          <span>
                            Album chi tiết ({item.images && item.images.length > 0 ? item.images.length : 1} ảnh)
                          </span>
                        </div>

                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Tải ảnh từ máy tính (chọn 1 hoặc nhiều ảnh)</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const files = Array.from(e.target.files);
                                try {
                                  const dataUrls = await Promise.all(
                                    files.map((f) => compressImage(f, 1200, 1200, 0.82))
                                  );
                                  const currentImages = item.images && item.images.length > 0
                                    ? [...item.images]
                                    : (item.imageUrl ? [item.imageUrl] : []);
                                  const updatedImages = [...currentImages, ...dataUrls];
                                  const updated = [...portfolio.activities];
                                  updated[idx].images = updatedImages;
                                  if (!updated[idx].imageUrl && dataUrls.length > 0) {
                                    updated[idx].imageUrl = dataUrls[0];
                                  }
                                  setPortfolio({ ...portfolio, activities: updated });
                                } catch (err) {
                                  alert('Lỗi khi nén ảnh.');
                                }
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Thumbnails of all images in this moment */}
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                        {(item.images && item.images.length > 0 ? item.images : [item.imageUrl]).map((imgSrc, imgIdx) => {
                          const isCover = item.imageUrl === imgSrc;
                          return (
                            <div
                              key={imgIdx}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 group/thumb ${
                                isCover ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-800'
                              }`}
                            >
                              <img src={imgSrc} alt={`Ảnh ${imgIdx + 1}`} className="w-full h-full object-cover" />
                              
                              {/* Hover controls */}
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                                {!isCover && (
                                  <button
                                    onClick={() => {
                                      const updated = [...portfolio.activities];
                                      updated[idx].imageUrl = imgSrc;
                                      setPortfolio({ ...portfolio, activities: updated });
                                    }}
                                    className="p-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-bold w-full text-center"
                                    title="Đặt làm ảnh bìa"
                                  >
                                    Làm bìa
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    const currentImages = item.images && item.images.length > 0 ? [...item.images] : [item.imageUrl];
                                    const filteredImgs = currentImages.filter((_, i) => i !== imgIdx);
                                    const updated = [...portfolio.activities];
                                    updated[idx].images = filteredImgs;
                                    if (isCover && filteredImgs.length > 0) {
                                      updated[idx].imageUrl = filteredImgs[0];
                                    }
                                    setPortfolio({ ...portfolio, activities: updated });
                                  }}
                                  className="p-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold w-full text-center"
                                  title="Xóa ảnh này khỏi album"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add image URL input */}
                      <div className="pt-1.5 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Hoặc dán thêm URL ảnh rồi nhấn Enter..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                const currentImages = item.images && item.images.length > 0 ? [...item.images] : [item.imageUrl];
                                const updated = [...portfolio.activities];
                                updated[idx].images = [...currentImages, val];
                                setPortfolio({ ...portfolio, activities: updated });
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Tiêu đề khoảnh khắc</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...portfolio.activities];
                          updated[idx].title = e.target.value;
                          setPortfolio({ ...portfolio, activities: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Danh mục</label>
                        <select
                          value={item.category}
                          onChange={(e) => {
                            const updated = [...portfolio.activities];
                            updated[idx].category = e.target.value as any;
                            setPortfolio({ ...portfolio, activities: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300"
                        >
                          <option value="travel">Du lịch khám phá</option>
                          <option value="work">Công tác & Khách hàng</option>
                          <option value="family">Gia đình & Đời sống</option>
                          <option value="company">FastWork Việt Nam</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Thời gian</label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) => {
                            const updated = [...portfolio.activities];
                            updated[idx].date = e.target.value;
                            setPortfolio({ ...portfolio, activities: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Địa điểm</label>
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => {
                          const updated = [...portfolio.activities];
                          updated[idx].location = e.target.value;
                          setPortfolio({ ...portfolio, activities: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Mô tả / Câu chuyện</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...portfolio.activities];
                          updated[idx].description = e.target.value;
                          setPortfolio({ ...portfolio, activities: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Thẻ gắn (cách nhau bởi dấu phẩy)</label>
                      <input
                        type="text"
                        value={item.tags.join(', ')}
                        onChange={(e) => {
                          const updated = [...portfolio.activities];
                          updated[idx].tags = e.target.value.split(',').map((s) => s.trim());
                          setPortfolio({ ...portfolio, activities: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveAll}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white text-sm shadow-md"
              >
                Lưu khoảnh khắc
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: BA Strengths & Skills */}
        {activeTab === 'strengths' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Quản lý Thế Mạnh & Kỹ Năng BA</h2>
                <p className="text-xs text-slate-400">Tùy biến các kỹ năng phân tích, tài liệu hóa và phương pháp luận</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.strengths.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...portfolio.strengths];
                        updated[idx].title = e.target.value;
                        setPortfolio({ ...portfolio, strengths: updated });
                      }}
                      className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-bold text-white flex-1"
                    />
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.level}
                        onChange={(e) => {
                          const updated = [...portfolio.strengths];
                          updated[idx].level = Number(e.target.value);
                          setPortfolio({ ...portfolio, strengths: updated });
                        }}
                        className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-indigo-400 font-bold text-center"
                      />
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Tóm tắt năng lực</label>
                    <textarea
                      rows={2}
                      value={item.summary}
                      onChange={(e) => {
                        const updated = [...portfolio.strengths];
                        updated[idx].summary = e.target.value;
                        setPortfolio({ ...portfolio, strengths: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveAll}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white text-sm shadow-md"
              >
                Lưu thế mạnh BA
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Contact Messages Inbox */}
        {activeTab === 'messages' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Hộp Thư Liên Hệ Từ Khách</h2>
                <p className="text-xs text-slate-400">
                  Xem và phản hồi các tin nhắn gửi từ form liên hệ trên Landing Page
                </p>
              </div>
              <button
                onClick={() => loadData(currentPin)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm mới</span>
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Chưa có tin nhắn nào. Khi khách gửi liên hệ từ landing page, thư sẽ xuất hiện tại đây.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="text-base font-bold text-white flex items-center gap-2">
                          <span>{msg.fullName}</span>
                          <span className="text-xs text-indigo-400 font-normal">({msg.email})</span>
                        </div>
                        {msg.phone && (
                          <div className="text-xs text-cyan-300 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{msg.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(msg.createdAt).toLocaleString('vi-VN')}</span>
                        </span>
                        <a
                          href={`mailto:${msg.email}?subject=Phản hồi: ${encodeURIComponent(msg.subject)}`}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Trả lời</span>
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800"
                          title="Xóa tin nhắn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-300">
                        Tiêu đề: {msg.subject}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Backup, Restore & PIN Settings */}
        {activeTab === 'backup' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white">Sao Lưu, Phục Hồi Dữ Liệu & Bảo Mật</h2>
              <p className="text-xs text-slate-400">
                Xuất file sao lưu dự phòng, khôi phục hoặc thay đổi mã PIN đăng nhập
              </p>
            </div>

            {/* Export & Import */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Download className="w-4 h-4" />
                  <span>Xuất file sao lưu (Export JSON)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tải toàn bộ nội dung landing page về máy tính dưới dạng file .json để lưu trữ an toàn hoặc chuyển giao.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải file backup về máy</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Upload className="w-4 h-4" />
                  <span>Nhập file sao lưu (Import JSON)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tải lên file JSON dự phòng đã lưu trước đó để phục hồi nội dung website.
                </p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn file JSON để tải lên</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Generate TypeScript Code for Git */}
            <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-4">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-base">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Cách 1: Sao chép mã nguồn dữ liệu để lưu vĩnh viễn vào Git (`lib/default-data.ts`)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vì Vercel là nền tảng Serverless (chống ghi đè file trực tiếp trên ổ cứng), bạn có thể xuất toàn bộ nội dung bạn vừa sửa thành mã nguồn, dán vào file <code>lib/default-data.ts</code> trên máy tính rồi chạy <code>git commit -am &quot;update&quot; ; git push</code>. Website trên mạng sẽ cập nhật vĩnh viễn cho tất cả mọi người xem!
              </p>
              <button
                onClick={() => {
                  const tsCode = `import { PortfolioData } from './types';\n\nexport const initialPortfolioData: PortfolioData = ${JSON.stringify(portfolio, null, 2)};\n`;
                  navigator.clipboard.writeText(tsCode);
                  alert('Đã sao chép toàn bộ mã dữ liệu vào bộ nhớ tạm!\nBây giờ bạn chỉ cần mở file lib/default-data.ts, dán đè vào và gõ git push!');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold text-white text-xs shadow-lg flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Sao chép mã code vào Clipboard</span>
              </button>
            </div>

            {/* Cloud Database (Vercel KV) Guide */}
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <Database className="w-5 h-5" />
                <span>Cách 2: Bật Database đám mây Vercel KV (Miễn phí 100% - Sửa web lưu tự động)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nếu bạn muốn mỗi khi bấm nút <strong>&quot;Lưu Thay Đổi&quot;</strong> trên trang Admin, website lập tức lưu vào cơ sở dữ liệu đám mây cho toàn thế giới xem mà không cần phải đụng vào Git:
              </p>
              <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-5">
                <li>Truy cập <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Vercel Dashboard</a> và chọn dự án portfolio của bạn.</li>
                <li>Bấm vào tab <strong>Storage</strong> ở menu trên cùng.</li>
                <li>Chọn <strong>Create Database</strong> ➔ Chọn <strong>KV (Durable Redis)</strong> ➔ Bấm <strong>Create</strong> (hoàn toàn miễn phí).</li>
                <li>Bấm nút <strong>Connect to Project</strong> để liên kết với dự án.</li>
                <li>Vercel sẽ tự động cấp biến môi trường và bạn chỉ cần redeploy 1 lần là xong!</li>
              </ol>
            </div>

            {/* Reset to Default */}
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <RotateCcw className="w-4 h-4" />
                <span>Khôi phục dữ liệu gốc ban đầu</span>
              </div>
              <p className="text-xs text-slate-400">
                Nếu bạn muốn hoàn tác toàn bộ các chỉnh sửa và nạp lại thông tin gốc đầy đủ của Nguyễn Huy Công (FastWork, HaUI, Thanh Hóa, các hoạt động du lịch và năng lực BA chuẩn ban đầu).
              </p>
              <button
                onClick={handleResetToDefault}
                className="px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold"
              >
                Khôi phục về dữ liệu chuẩn ban đầu
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
