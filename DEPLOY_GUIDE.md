# HƯỚNG DẪN TRIỂN KHAI (DEPLOY) & GOLIVE MIỄN PHÍ 100%

Landing page cá nhân chuyên nghiệp của **Nguyễn Huy Công - IT Business Analyst** đã được đóng gói hoàn chỉnh bằng **Next.js 16 + Tailwind CSS + TypeScript + Serverless API Backend + Admin CMS**.

---

## 1. CHẠY THỬ NGHIỆM TRỰC TIẾP TRÊN MÁY TÍNH (LOCAL)

Mở terminal (PowerShell hoặc Command Prompt) tại thư mục dự án:
```bash
cd C:\Users\admin\.gemini\antigravity\scratch\portfolio-huycong
npm run dev
```
- **Landing Page công khai:** Mở trình duyệt truy cập `http://localhost:3000`
- **Trang Quản trị Backend (Admin CMS):** Truy cập `http://localhost:3000/admin`
- **Mã PIN bảo mật mặc định:** `2101` (dựa trên ngày sinh 21/01 của Huy Công)

---

## 2. TRIỂN KHAI GOLIVE MIỄN PHÍ LÊN VERCEL (KHUYÊN DÙNG - CỰC NHANH TRONG 1 PHÚT)

Vercel là công ty sáng lập Next.js, cung cấp gói **Hobby MIỄN PHÍ TRỌN ĐỜI** cho website cá nhân, tặng kèm chứng chỉ bảo mật HTTPS (SSL) và tên miền miễn phí dạng `*.vercel.app`.

### CÁCH 1: Triển khai trực tiếp từ dòng lệnh (Không cần tạo Git nếu muốn test ngay)
Chạy lệnh sau tại thư mục dự án:
```bash
npx vercel
```
1. Chọn đăng nhập hoặc tạo tài khoản miễn phí qua Email/GitHub.
2. Nhấn `Enter` để chấp nhận các thiết lập mặc định:
   - `Set up and deploy?` -> `Y`
   - `Which scope?` -> chọn tài khoản của bạn
   - `Link to existing project?` -> `N`
   - `What's your project's name?` -> `portfolio-nguyen-huy-cong`
   - `In which directory is your code located?` -> `./`
3. Đợi khoảng 30 - 45 giây, Vercel sẽ trả về đường link website trực tiếp của bạn (Ví dụ: `https://portfolio-nguyen-huy-cong.vercel.app`)!

---

### CÁCH 2: Kết nối qua GitHub (Chuẩn chỉ & Tự động cập nhật mỗi khi sửa code)

1. **Tạo Repository trên GitHub:**
   - Vào [https://github.com/new](https://github.com/new) tạo một repository mới (ví dụ đặt tên: `portfolio-huycong`).
   
2. **Đẩy code lên GitHub:**
   Mở terminal tại thư mục dự án và chạy:
   ```bash
   git add .
   git commit -m "feat: complete professional portfolio & admin cms for Nguyen Huy Cong"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-github-cua-ban>/portfolio-huycong.git
   git push -u origin main
   ```

3. **Kết nối và Golive trên Vercel:**
   - Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
   - Nhấn **"Add New..."** -> **"Project"**.
   - Chọn kho lưu trữ `portfolio-huycong` vừa tạo và bấm **"Deploy"**.
   - Website sẽ được tự động build và golive trực tiếp với tên miền miễn phí!

---

## 3. CÁC TÍNH NĂNG ĐÃ TÍCH HỢP SẴN SÀNG

1. **Giao diện Landing Page Chuyên Nghiệp:**
   - **Hero Section:** Ảnh đại diện, thông tin chức danh BA, sinh năm 2004, nút liên hệ, các huy hiệu mạng xã hội (Facebook, TikTok, Instagram, LinkedIn, GitHub).
   - **Về Tôi (About):** Quê quán Thanh Hóa, nơi sinh sống Hà Nội, công ty FastWork Việt Nam, tốt nghiệp Hệ thống thông tin HaUI, sở thích du lịch, đọc sách, xem phim...
   - **Thế Mạnh BA (BA Strengths):** 8 khối năng lực phân tích chuyên sâu (BPMN, SRS/BRD, Figma, SQL, Agile/Scrum, Stakeholder management...) kèm bộ lọc theo danh mục.
   - **Hành Trình (Journey Timeline):** Lộ trình học tập và làm việc bài bản với các điểm nhấn thành tựu.
   - **Khoảnh Khắc Đáng Nhớ (Moments Gallery):** Thẻ ảnh du lịch (Hà Giang, Đà Nẵng...), công tác khách hàng, gia đình, teambuilding FastWork kèm modal phóng to xem chi tiết câu chuyện.
   - **Kết Nối & Liên Hệ (Contact):** Form gửi thư trực tiếp lưu trữ vào backend, nút sao chép SĐT/Email, liên kết mạng xã hội.

2. **Hệ Thống Backend & Admin CMS (`/admin`):**
   - Đăng nhập bảo mật bằng PIN (`2101`).
   - Cập nhật toàn bộ thông tin cá nhân, sửa mốc hành trình, thêm/xóa ảnh khoảnh khắc.
   - Xem và quản lý hòm thư liên hệ từ khách truy cập.
   - Sao lưu dữ liệu dự phòng (Export/Import JSON).
