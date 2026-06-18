import { TarotCard, TarotDeck } from '../constants/TarotData';

export interface TarotReading {
  card: TarotCard;
  isReversed: boolean;
  orientation: 'Upright' | 'Reversed';
}

export interface SpreadReading {
  past: TarotReading;
  present: TarotReading;
  future: TarotReading;
}

export const getSingleCardReading = (): TarotReading => {
  const randomIndex = Math.floor(Math.random() * TarotDeck.length);
  const card = TarotDeck[randomIndex];
  const isReversed = Math.random() > 0.7; // 30% chance of being reversed
  
  return {
    card,
    isReversed,
    orientation: isReversed ? 'Reversed' : 'Upright'
  };
};

export const getThreeCardSpread = (): SpreadReading => {
  // Shuffle cards
  const shuffled = [...TarotDeck].sort(() => Math.random() - 0.5);
  
  const drawCard = (index: number): TarotReading => {
    const card = shuffled[index];
    const isReversed = Math.random() > 0.7;
    return {
      card,
      isReversed,
      orientation: isReversed ? 'Reversed' : 'Upright'
    };
  };

  return {
    past: drawCard(0),
    present: drawCard(1),
    future: drawCard(2)
  };
};
