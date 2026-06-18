import { ZodiacSign } from './ZodiacData';

export interface Horoscope {
  signId: string;
  date: string;
  summary: string;
  love: string;
  career: string;
  wellness: string;
  finance: string;
  loveRating: number;   // 1 to 5
  careerRating: number; // 1 to 5
  healthRating: number; // 1 to 5
  financeRating: number;// 1 to 5
  luckyTime: string;
  luckyNumber: number;
  mood: string;
}

// Simple seed-based random generator for daily consistency
const seedRandom = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
};

const summariesPool = [
  "A wave of cosmic alignment brings clarity to your current goals. It is a perfect day to make minor adjustments to your plans and trust your intuition.",
  "The planetary energies are pushing you to speak your truth today. Your communication skills are enhanced, and others will respond positively to your ideas.",
  "Solitary reflection is favored today as the moon highlights your inner thoughts. Taking time to recharge will lead to a breakthrough in a long-standing issue.",
  "An unexpected opportunity may arise today. Keep an open mind and don't hesitate to take action when you feel a positive connection.",
  "Focus on details and organization today. The cosmos are encouraging you to tidy up your physical and mental space to clear path for new energy.",
  "Your creative energy is flowing exceptionally high today. Don't suppress your ideas; share them with the world or channel them into a personal project.",
  "Patience is your strongest asset today. You might feel a rush to get things done, but slowing down will reveal details you would have missed.",
  "Trust the process. Financial or career shifts that seemed daunting are starting to make sense. Rest assured, you are exactly where you need to be."
];

const lovePool = [
  "Venus is casting a warm glow over your relationships. Expect a moment of deep connection, or a heartwarming conversation with someone special.",
  "It is a day of clarity in love. Expressing your boundaries clearly will not push others away; it will invite deeper respect and authenticity.",
  "If single, an interesting encounter might spark through a shared hobby. For couples, a playful energy brings laughter and lighter moods.",
  "Avoid overthinking a partner's words. The cosmos suggest that quiet support and presence speak louder than arguments today.",
  "Re-evaluating what you need in partnerships. Give yourself the love you've been seeking from others first, and watch your dynamics shift."
];

const careerPool = [
  "A professional challenge presents an opportunity to showcase your leadership skills. Trust your expertise and take charge of the project.",
  "Mercury encourages collaboration today. Brainstorming sessions will yield remarkable solutions. Listen closely to alternative opinions.",
  "You are close to achieving a major project milestone. Maintain your focus and avoid side-distractions that could delay your progress.",
  "A perfect day for financial planning. Take a detailed look at your budget; a small adjustment now will lead to significant rewards later.",
  "Your dedication is being noticed by key decision makers. Keep working diligently, and don't shy away from claiming credit for your achievements."
];

const wellnessPool = [
  "Your energy level is high. Use this vitality for physical activity or an outdoor walk. Connect with nature to ground your nervous system.",
  "The planetary alignments suggest focusing on emotional rest. Limit screen time today and engage in a relaxing activity like reading or a bath.",
  "Pay attention to your body's signals today. A healthy meal, proper hydration, and a stretch will work wonders for your physical focus.",
  "Mindfulness is key today. Practicing brief breathing exercises will help dissolve the ambient stress and return you to center.",
  "An excellent day to start a new wellness habit. Small, consistent actions will lay the groundwork for long-term health improvements."
];

const moods = ["Inspired", "Reflective", "Determined", "Radiant", "Calm", "Dynamic", "Intuitive", "Ambitious"];
const times = ["9:30 AM", "11:15 AM", "2:00 PM", "4:45 PM", "6:30 PM", "8:15 PM", "11:00 PM"];

export const generateDailyHoroscope = (signId: string, dateString: string): Horoscope => {
  const seed = signId + dateString;
  const rand = seedRandom(seed);

  const selectRandom = <T>(arr: T[]): T => {
    const idx = Math.floor(rand() * arr.length);
    return arr[idx];
  };

  const loveRating = Math.floor(rand() * 3) + 3;    // 3, 4, or 5
  const careerRating = Math.floor(rand() * 3) + 3;
  const healthRating = Math.floor(rand() * 3) + 3;
  const financeRating = Math.floor(rand() * 3) + 3;

  const luckyNumber = Math.floor(rand() * 9) + 1;

  return {
    signId,
    date: dateString,
    summary: selectRandom(summariesPool),
    love: selectRandom(lovePool),
    career: selectRandom(careerPool),
    wellness: selectRandom(wellnessPool),
    finance: "Your financial outlook is stabilizing. Avoid impulsive purchases and focus on long-term abundance and mindful investments.",
    loveRating,
    careerRating,
    healthRating,
    financeRating,
    luckyTime: selectRandom(times),
    luckyNumber,
    mood: selectRandom(moods),
  };
};
