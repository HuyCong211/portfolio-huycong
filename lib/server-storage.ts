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

// Check if Upstash Redis / Vercel KV REST API is available
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function getFromKv(): Promise<DatabaseSchema | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/portfolio_db`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch from KV database:', err);
  }
  return null;
}

async function saveToKv(data: DatabaseSchema): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const res = await fetch(`${KV_URL}/set/portfolio_db`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save to KV database:', err);
    return false;
  }
}

export async function getDatabaseAsync(): Promise<DatabaseSchema> {
  // 1. Try Cloud KV (Vercel KV / Upstash)
  const kvData = await getFromKv();
  if (kvData && kvData.portfolio) {
    return kvData;
  }

  // 2. Try Local File
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        portfolio: parsed.portfolio || defaultDatabase.portfolio,
        messages: parsed.messages || defaultDatabase.messages,
        adminPin: parsed.adminPin || defaultDatabase.adminPin
      };
    }
  } catch (e) {
    // Read-only or missing
  }

  return defaultDatabase;
}

export function getDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        portfolio: parsed.portfolio || defaultDatabase.portfolio,
        messages: parsed.messages || defaultDatabase.messages,
        adminPin: parsed.adminPin || defaultDatabase.adminPin
      };
    }
  } catch (error) {
    // Ignore and fallback
  }
  return defaultDatabase;
}

export async function saveDatabaseAsync(data: DatabaseSchema): Promise<{
  success: boolean;
  persistedTo: 'cloud_kv' | 'local_file' | 'memory_only';
  message?: string;
}> {
  // 1. Try Cloud KV if configured
  if (KV_URL && KV_TOKEN) {
    const ok = await saveToKv(data);
    if (ok) {
      return { success: true, persistedTo: 'cloud_kv' };
    }
  }

  // 2. Try Local File system
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true, persistedTo: 'local_file' };
  } catch (error: any) {
    console.warn('Local filesystem write failed (expected on Vercel serverless):', error?.message);
    // On Vercel, the local filesystem is read-only.
    // We return success with 'memory_only' so the client knows to persist in localStorage
    return {
      success: true,
      persistedTo: 'memory_only',
      message: 'Hệ thống Vercel chạy dạng Serverless (Read-only). Dữ liệu đã được lưu vào trình duyệt.'
    };
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
    return false;
  }
}
