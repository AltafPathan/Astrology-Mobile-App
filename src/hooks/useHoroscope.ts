import { useQuery } from '@tanstack/react-query';
import { generateDailyHoroscope, Horoscope } from '../constants/HoroscopeMock';

export const useHoroscope = (signId: string | undefined, dateString?: string) => {
  const targetDate = dateString || new Date().toDateString();

  return useQuery<Horoscope, Error>({
    queryKey: ['horoscope', signId, targetDate],
    queryFn: async () => {
      if (!signId) {
        throw new Error('Zodiac sign is required');
      }
      
      // Simulate network request delay (500ms) for high-fidelity feel
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return generateDailyHoroscope(signId, targetDate);
    },
    enabled: !!signId,
    staleTime: 1000 * 60 * 60 * 6, // 6 hours cache
  });
};
