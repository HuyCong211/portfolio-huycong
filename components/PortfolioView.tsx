'use client';

import { usePortfolio } from '@/lib/usePortfolio';
import { PortfolioData } from '@/lib/types';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import BaStrengths from './BaStrengths';
import JourneyTimeline from './JourneyTimeline';
import MomentsGallery from './MomentsGallery';
import ContactSection from './ContactSection';
import Footer from './Footer';

interface PortfolioViewProps {
  initialData: PortfolioData;
}

export default function PortfolioView({ initialData }: PortfolioViewProps) {
  const { data } = usePortfolio();
  const portfolio = data || initialData;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      <Navbar profile={portfolio.profile} />
      <main className="flex-1">
        <Hero profile={portfolio.profile} />
        <About profile={portfolio.profile} />
        <BaStrengths strengths={portfolio.strengths} />
        <JourneyTimeline journey={portfolio.journey} />
        <MomentsGallery activities={portfolio.activities} />
        <ContactSection profile={portfolio.profile} />
      </main>
      <Footer profile={portfolio.profile} />
    </div>
  );
}
