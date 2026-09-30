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
        // Ưu tiên dữ liệu đã lưu trong localStorage (do Admin CMS cập nhật)
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setData(parsed);
            // Đã có dữ liệu local → không cần gọi API (tránh bị ghi đè bởi dữ liệu mặc định)
            setLoading(false);
            return;
          } catch (e) {
            console.error('Failed to parse cached portfolio', e);
            // Nếu parse lỗi → xoá cache và thử lấy từ API
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        // Không có cache → thử lấy từ API (chỉ dùng nếu server có Vercel KV)
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const remoteData = await res.json();
            // Chỉ dùng API data nếu nó đã được lưu thực sự (có field lastSaved)
            // để tránh dùng dữ liệu mặc định từ server
            if (remoteData && remoteData.profile && remoteData._savedAt) {
              setData(remoteData);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
            }
          }
        } catch (apiErr) {
          console.warn('API unavailable, using default data');
        }
      } catch (err: any) {
        console.warn('Could not load portfolio data:', err);
        setError(err.message || 'Không thể tải dữ liệu');
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
