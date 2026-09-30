import fs from 'fs';
import path from 'path';
import { initialPortfolioData } from './default-data';
import { ContactMessage, PortfolioData } from './types';

export interface DatabaseSchema {
  portfolio: PortfolioData;
  messages: ContactMessage[];
  adminPin: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'database.json');

const defaultDatabase: DatabaseSchema = {
  portfolio: initialPortfolioData,
  messages: [
    {
      id: 'msg-sample-1',
      fullName: 'Trần Minh Đức',
      email: 'duc.tran@techcorp.vn',
      phone: '0912 345 678',
      subject: 'Trao đổi về cơ hội hợp tác dự án ERP cho chuỗi bán lẻ',
      message: 'Chào Huy Công, mình theo dõi các bài chia sẻ phân tích quy trình của bạn và rất ấn tượng với phong cách làm việc logic. Bên mình đang có dự án nâng cấp phân hệ quản trị kho và chuỗi cung ứng, rất mong có dịp mời bạn cafe trao đổi thêm về dự án này!',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      read: false
    }
  ],
  adminPin: '2101' // Default admin PIN (21/01)
};

export function getDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultDatabase, null, 2), 'utf-8');
      return defaultDatabase;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      portfolio: parsed.portfolio || defaultDatabase.portfolio,
      messages: parsed.messages || defaultDatabase.messages,
      adminPin: parsed.adminPin || defaultDatabase.adminPin
    };
  } catch (error) {
    console.warn('Error reading database file, returning default database:', error);
    return defaultDatabase;
  }
}

export function saveDatabase(data: DatabaseSchema): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving database file:', error);
    return false;
  }
}
