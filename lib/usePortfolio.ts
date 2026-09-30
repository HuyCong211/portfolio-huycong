'use client';

import { useState, useEffect } from 'react';
import { PortfolioData } from './types';
import { initialPortfolioData } from './default-data';

const STORAGE_KEY = 'huycong_portfolio_data_v1';

export function usePortfolio() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // First check local storage for instant hydration
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            setData(JSON.parse(cached));
          } catch (e) {
            console.error('Failed to parse cached portfolio', e);
          }
        }

        // Fetch latest from API
        const res = await fetch('/api/profile');
        if (res.ok) {
          const remoteData = await res.json();
          if (remoteData && remoteData.profile) {
            setData(remoteData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
          }
        }
      } catch (err: any) {
        console.warn('Could not fetch remote portfolio data, using local/default:', err);
        setError(err.message || 'Không thể tải dữ liệu từ máy chủ');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const savePortfolio = async (updated: PortfolioData, pin: string = '2101'): Promise<{ success: boolean; error?: string }> => {
    try {
      // Optimistic update
      setData(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio: updated, pin })
      });

      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Lỗi khi lưu dữ liệu lên máy chủ' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
    }
  };

  const resetToDefault = async (pin: string = '2101') => {
    return savePortfolio(initialPortfolioData, pin);
  };

  return { data, loading, error, savePortfolio, resetToDefault, setData };
}
