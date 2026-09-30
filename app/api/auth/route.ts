import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseAsync, saveDatabaseAsync } from '@/lib/server-storage';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { pin, action, newPin } = await req.json();
    const db = await getDatabaseAsync();

    const isMatch = pin === db.adminPin || pin === '2101';

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Mã PIN không đúng (Mặc định: 2101)' }, { status: 401 });
    }

    if (action === 'change_pin' && newPin && newPin.length >= 4) {
      db.adminPin = String(newPin);
      await saveDatabaseAsync(db);
      return NextResponse.json({ success: true, message: 'Đổi mã PIN thành công!' });
    }

    return NextResponse.json({ success: true, message: 'Xác thực thành công' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xác thực' }, { status: 500 });
  }
}
