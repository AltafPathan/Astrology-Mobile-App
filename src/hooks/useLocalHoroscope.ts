import { useQuery } from '@tanstack/react-query';
import horoscopeData from '../constants/horoscope.json';

export interface LocalForecast {
  summary: string;
  love: string;
  career: string;
  health?: string;
  wellness?: string;
  finance: string;
}

export interface LocalDailyForecast extends LocalForecast {
  luckyNumber: number;
  luckyTime: string;
  mood: string;
  loveRating: number;
  careerRating: number;
  healthRating: number;
  financeRating: number;
}

export interface LocalWeeklyForecast {
  range: string;
  summary: string;
  love: string;
  career: string;
  health: string;
  finance: string;
}

export interface LocalMonthlyForecast {
  month: string;
  summary: string;
  love: string;
  career: string;
  health: string;
  finance: string;
}

export interface LocalSignHoroscope {
  daily: LocalDailyForecast;
  weekly: LocalWeeklyForecast;
  monthly: LocalMonthlyForecast;
}

export const useLocalHoroscope = (signId: string | undefined) => {
  return useQuery<LocalSignHoroscope, Error>({
    queryKey: ['local-horoscope', signId],
    queryFn: async () => {
      if (!signId) {
        throw new Error('Zodiac sign is required');
      }
      
      // Simulate network request delay (500ms) for high-fidelity feel
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const key = signId.toLowerCase();
      const data = (horoscopeData as any)[key];
      if (!data) {
        throw new Error(`Horoscope not found for sign: ${signId}`);
      }
      
      return data as LocalSignHoroscope;
    },
    enabled: !!signId,
    staleTime: 1000 * 60 * 60 * 6, // 6 hours cache
  });
};
