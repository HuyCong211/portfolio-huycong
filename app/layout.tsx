import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nguyễn Huy Công | IT Business Analyst - Chuyên viên Phân tích Nghiệp vụ CNTT',
  description: 'Trang thông tin cá nhân và portfolio chuyên nghiệp của Nguyễn Huy Công (IT Business Analyst tại FastWork Việt Nam). Chuyên môn khơi gợi yêu cầu, thiết kế quy trình BPMN, tài liệu BRD/SRS, Wireframe và tư duy giải pháp chuyển đổi số.',
  keywords: [
    'Nguyễn Huy Công',
    'IT Business Analyst',
    'Chuyên viên phân tích nghiệp vụ',
    'FastWork Việt Nam',
    'Hệ thống thông tin HaUI',
    'BA Portfolio',
    'BRD',
    'SRS',
    'BPMN'
  ],
  authors: [{ name: 'Nguyễn Huy Công' }],
  creator: 'Nguyễn Huy Công',
  openGraph: {
    title: 'Nguyễn Huy Công | IT Business Analyst',
    description: 'Chuyên viên Phân tích Nghiệp vụ CNTT tại Công ty TNHH Công nghệ FastWork Việt Nam.',
    type: 'website',
    locale: 'vi_VN'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-600 selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
