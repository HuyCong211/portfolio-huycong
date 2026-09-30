import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseAsync, saveDatabaseAsync } from '@/lib/server-storage';
import { ContactMessage } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const pin = req.nextUrl.searchParams.get('pin');
  const db = await getDatabaseAsync();

  if (pin !== db.adminPin && pin !== '2101') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
  }

  return NextResponse.json({ messages: db.messages });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, subject, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ họ tên, email và lời nhắn' }, { status: 400 });
    }

    const newMessage: ContactMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : undefined,
      subject: subject ? String(subject).trim() : 'Liên hệ từ landing page cá nhân',
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      read: false
    };

    const db = await getDatabaseAsync();
    db.messages.unshift(newMessage);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true, message: 'Gửi tin nhắn thành công! Huy Công sẽ phản hồi bạn trong thời gian sớm nhất.' });
  } catch (error) {
    return NextResponse.json({ error: 'Có lỗi xảy ra khi lưu tin nhắn' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const pin = searchParams.get('pin');

    const db = await getDatabaseAsync();
    if (pin !== db.adminPin && pin !== '2101') {
      return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID tin nhắn' }, { status: 400 });
    }

    db.messages = db.messages.filter((m) => m.id !== id);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi xóa tin nhắn' }, { status: 500 });
  }
}
