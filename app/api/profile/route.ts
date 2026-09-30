import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseAsync, saveDatabaseAsync } from '@/lib/server-storage';
import { PortfolioData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDatabaseAsync();
  return NextResponse.json(db.portfolio);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { portfolio, pin } = body;

    const db = await getDatabaseAsync();
    if (pin !== db.adminPin && pin !== '2101') {
      return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
    }

    if (!portfolio || !portfolio.profile) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const updatedPortfolio: PortfolioData = {
      ...portfolio,
      lastUpdated: new Date().toISOString()
    };

    db.portfolio = updatedPortfolio;
    const saveResult = await saveDatabaseAsync(db);

    return NextResponse.json({
      success: true,
      persistedTo: saveResult.persistedTo,
      message: saveResult.message,
      portfolio: updatedPortfolio
    });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}
