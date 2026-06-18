import { getZodiacSignById, ZodiacSign } from '../constants/ZodiacData';

export interface CompatibilityResult {
  signA: ZodiacSign;
  signB: ZodiacSign;
  overallScore: number;
  loveScore: number;
  friendshipScore: number;
  careerScore: number;
  summary: string;
}

export const calculateCompatibility = (idA: string, idB: string): CompatibilityResult | null => {
  const signA = getZodiacSignById(idA);
  const signB = getZodiacSignById(idB);

  if (!signA || !signB) return null;

  // Elemental matching base scores
  const elementScores: Record<string, Record<string, number>> = {
    Fire: { Fire: 92, Earth: 65, Air: 88, Water: 58 },
    Earth: { Fire: 65, Earth: 90, Air: 62, Water: 85 },
    Air: { Fire: 88, Earth: 62, Air: 85, Water: 70 },
    Water: { Fire: 58, Earth: 85, Air: 70, Water: 92 },
  };

  const baseScore = elementScores[signA.element]?.[signB.element] || 75;

  // Adjust for modalities
  let modalityAdjustment = 0;
  if (signA.modality === signB.modality) {
    // Same modality can cause friction (stubbornness, indecision, etc.)
    modalityAdjustment = -5;
  } else {
    modalityAdjustment = 3;
  }

  // Calculate scores
  const overallScore = Math.min(100, Math.max(40, baseScore + modalityAdjustment));
  
  // Custom variations for Love, Friendship, Career
  const loveScore = Math.min(100, Math.max(40, overallScore + (signA.element === signB.element ? 5 : -4) + (Math.sin(overallScore) * 3)));
  const friendshipScore = Math.min(100, Math.max(40, overallScore + (signA.modality !== signB.modality ? 6 : -2)));
  const careerScore = Math.min(100, Math.max(40, overallScore + (signA.element === 'Earth' || signB.element === 'Earth' ? 7 : -3)));

  // Generate detailed summaries
  let summary = '';
  if (overallScore >= 85) {
    summary = `A heavenly alignment! ${signA.name} and ${signB.name} share an incredibly harmonious connection. Driven by their compatible elements (${signA.element} & ${signB.element}), they support each other naturally, creating a strong, resilient bond of trust, understanding, and shared values.`;
  } else if (overallScore >= 70) {
    summary = `A highly supportive pairing. The flow between ${signA.name} and ${signB.name} is stable and comfortable. While they have distinct approaches due to their differing elements, their differences complement rather than conflict, allowing them to balance each other nicely.`;
  } else if (overallScore >= 55) {
    summary = `A connection requiring balance. ${signA.name} and ${signB.name} see the world through very different lenses. This pairing can offer valuable growth, but both must practice patience and appreciate their differences to avoid misunderstandings.`;
  } else {
    summary = `A highly challenging combination. The fiery dynamic of ${signA.name} meets the contrasting flow of ${signB.name}. There is potential for friction, but with conscious effort and respect for their contrasting energies, they can learn deep karmic lessons from one another.`;
  }

  return {
    signA,
    signB,
    overallScore: Math.round(overallScore),
    loveScore: Math.round(loveScore),
    friendshipScore: Math.round(friendshipScore),
    careerScore: Math.round(careerScore),
    summary,
  };
};
