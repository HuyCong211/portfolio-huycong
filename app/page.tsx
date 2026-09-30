import { getDatabase } from '@/lib/server-storage';
import PortfolioView from '@/components/PortfolioView';

export default function Home() {
  const db = getDatabase();
  return <PortfolioView initialData={db.portfolio} />;
}
