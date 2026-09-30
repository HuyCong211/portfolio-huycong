export interface SocialLinks {
  facebook: string;
  tiktok: string;
  instagram: string;
  linkedin: string;
  github: string;
}

export interface BaStrength {
  id: string;
  title: string;
  category: 'core' | 'technical' | 'management' | 'soft-skills';
  level: number; // 0 to 100
  iconName: string;
  summary: string;
  details: string[];
}

export interface JourneyItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  type: 'work' | 'education' | 'achievement';
  description: string;
  highlights: string[];
  isCurrent?: boolean;
}

export interface ActivityMoment {
  id: string;
  title: string;
  category: 'travel' | 'work' | 'family' | 'company';
  date: string;
  location: string;
  imageUrl: string;
  images?: string[]; // Danh sách nhiều hình ảnh trong một khoảnh khắc
  description: string;
  tags: string[];
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PersonalProfile {
  name: string;
  birthDate: string; // "21/01/2004"
  title: string; // "Chuyên viên phân tích nghiệp vụ CNTT (IT Business Analyst)"
  hometown: string; // "Thanh Hóa"
  currentLocation: string; // "Hà Nội"
  company: string; // "Công ty TNHH Công nghệ FastWork Việt Nam"
  education: string; // "Ngành Hệ thống thông tin - Trường CNTT&TT - ĐH Công nghiệp Hà Nội"
  hobbies: string[];
  bioShort: string;
  bioLong: string;
  avatarUrl: string;
  coverUrl: string;
  email: string;
  phone: string;
  socials: SocialLinks;
  resumeUrl?: string;
}

export interface PortfolioData {
  profile: PersonalProfile;
  strengths: BaStrength[];
  journey: JourneyItem[];
  activities: ActivityMoment[];
  lastUpdated: string;
}
