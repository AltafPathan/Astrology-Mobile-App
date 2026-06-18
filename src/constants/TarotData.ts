export interface TarotCard {
  id: string;
  name: string;
  number: number;
  uprightMeaning: string;
  reversedMeaning: string;
  description: string;
  love: string;
  career: string;
}

export const TarotDeck: TarotCard[] = [
  {
    id: 'the_fool',
    name: 'The Fool',
    number: 0,
    uprightMeaning: 'New beginnings, freedom, spontaneity, adventure, innocence',
    reversedMeaning: 'Recklessness, risk-taking, consideration, holding back',
    description: 'The Fool represents the start of a journey. It represents unlimited potential, pure optimism, and a willingness to step into the unknown with faith and curiosity.',
    love: 'A fresh start in love. Singles may meet someone spontaneous, while couples can experience a new spark of adventure.',
    career: 'A new job or career direction is calling. Embrace risks but don\'t jump blindly without checking the depth.'
  },
  {
    id: 'the_magician',
    name: 'The Magician',
    number: 1,
    uprightMeaning: 'Manifestation, willpower, desire, creation, skill, resourcefulness',
    reversedMeaning: 'Illusion, manipulation, wasted talent, untapped potential',
    description: 'The Magician is the master of manifestation. Armed with the tools of the elements, they have the power to turn thoughts into physical reality through focused intent and actions.',
    love: 'You have the charm to attract the love you desire. Communication in relationships is highly powerful right now.',
    career: 'Now is the time to execute your ideas. You have all the skills and resources required to achieve your goals.'
  },
  {
    id: 'the_high_priestess',
    name: 'The High Priestess',
    number: 2,
    uprightMeaning: 'Intuition, sacred knowledge, divine feminine, subconscious mind',
    reversedMeaning: 'Secret motives, ignoring intuition, surface-level focus',
    description: 'The High Priestess sits at the boundary of the conscious and subconscious realms. She represents inner wisdom, spiritual secrets, and the need to trust your gut instincts.',
    love: 'Quiet attraction and deep intuitive bonds. Do not rush relationships; let secrets unfold naturally.',
    career: 'Keep your plans close to your chest. Trust your intuition when dealing with colleagues or making decisions.'
  },
  {
    id: 'the_empress',
    name: 'The Empress',
    number: 3,
    uprightMeaning: 'Abundance, creativity, nature, nurturing, fertility',
    reversedMeaning: 'Creative block, dependence, smothering, insecurity',
    description: 'The Empress represents the nurturing mother archetype. She represents abundance, artistic expression, connection with nature, and birth of new ideas.',
    love: 'A nurturing, warm phase. Ideal time for building a family or deepening a supportive romantic connection.',
    career: 'Your creative projects will flourish. Focus on collaboration, growth, and natural development of ideas.'
  },
  {
    id: 'the_emperor',
    name: 'The Emperor',
    number: 4,
    uprightMeaning: 'Authority, structure, control, solid foundation, protection',
    reversedMeaning: 'Tyranny, lack of discipline, powerlessness, rigidity',
    description: 'The Emperor represents structure, order, and stability. He is a paternal figure who establishes rules, boundaries, and logical foundations to ensure peace and success.',
    love: 'A stable and protective partner. A structured relationship with clear roles and strong boundaries.',
    career: 'Take a structured, organized approach to work. Establish authority and organize chaos into efficiency.'
  },
  {
    id: 'the_hierophant',
    name: 'The Hierophant',
    number: 5,
    uprightMeaning: 'Tradition, conformity, spiritual wisdom, institutions, beliefs',
    reversedMeaning: 'Rebellion, unconventionality, new approaches, restriction',
    description: 'The Hierophant represents spiritual structure, tradition, and learning. He suggests adhering to proven structures, seeking guidance from mentors, and respecting custom.',
    love: 'Commitment, traditional marriage, or a relationship that respects traditional values and community values.',
    career: 'Working within established companies or institutions. Seeking professional training or following industry norms.'
  },
  {
    id: 'the_lovers',
    name: 'The Lovers',
    number: 6,
    uprightMeaning: 'Love, harmony, partnerships, alignment of values, choices',
    reversedMeaning: 'Disharmony, misalignment, imbalance, bad choices',
    description: 'The Lovers card represents deep connection, attraction, and crucial choices. It calls for aligning your values with your decisions and seeking harmonious balance in connections.',
    love: 'Deep mutual attraction and romantic compatibility. An important decision is required about a connection.',
    career: 'Beneficial partnerships or contracts. Align your choices at work with your personal ethics.'
  },
  {
    id: 'the_chariot',
    name: 'The Chariot',
    number: 7,
    uprightMeaning: 'Control, willpower, success, action, determination, victory',
    reversedMeaning: 'Lack of control, directionless, aggression, obstacles',
    description: 'The Chariot is a card of momentum and triumph. It represents overcoming obstacles through absolute focus, control of opposing forces, and sheer force of will.',
    love: 'Pursuing romance with confidence and determination. Overcoming challenges together as a couple.',
    career: 'Drive, ambition, and career progression. Keep your focus locked on the target to achieve success.'
  },
  {
    id: 'strength',
    name: 'Strength',
    number: 8,
    uprightMeaning: 'Courage, persuasion, influence, compassion, inner resolve',
    reversedMeaning: 'Self-doubt, weakness, raw emotion, insecurity',
    description: 'Strength represents the power of quiet resilience and compassion. It shows that true power is not force, but rather calm patience, endurance, and quiet confidence.',
    love: 'Patience and gentle persuasion in love. Working through emotional hurdles with love and compassion.',
    career: 'Overcoming workplace conflicts with diplomacy and resilience instead of aggressive confrontation.'
  },
  {
    id: 'the_hermit',
    name: 'The Hermit',
    number: 9,
    uprightMeaning: 'Soul searching, introspection, inner guidance, solitude, reflection',
    reversedMeaning: 'Loneliness, isolation, withdrawal, paranoia',
    description: 'The Hermit retreats into solitude to seek truth and wisdom. He indicates a time for introspection, looking inward for answers, and taking a break from external distractions.',
    love: 'Singles may need a period of self-reflection before dating. Couples should respect each other\'s need for space.',
    career: 'Take a step back to evaluate your professional path. Contemplate your career purpose and goals.'
  },
  {
    id: 'wheel_of_fortune',
    name: 'Wheel of Fortune',
    number: 10,
    uprightMeaning: 'Good luck, karma, life cycles, destiny, turning point',
    reversedMeaning: 'Bad luck, resistance to change, breaking bad cycles',
    description: 'The Wheel of Fortune reminds us that everything passes. Good luck and challenges are parts of the cycle. It indicates sudden changes, destiny, and cosmic turning points.',
    love: 'Sudden, fateful romantic developments. Relationships shifting to a new phase for better or worse.',
    career: 'Expect unexpected changes or opportunities. Prepare to adapt quickly to new financial cycles.'
  },
  {
    id: 'justice',
    name: 'Justice',
    number: 11,
    uprightMeaning: 'Fairness, truth, law, cause and effect, accountability',
    reversedMeaning: 'Dishonesty, unfairness, unaccountability, bias',
    description: 'Justice represents fairness, truth, and cosmic balance. It reminds us that our decisions have consequences, and we must stand accountable for our actions.',
    love: 'Honest and balanced relationships. Clear communications and resolving old grievances fairly.',
    career: 'Legal contracts, business dealings, or evaluations. Ensure ethical practices to guarantee a positive outcome.'
  },
  {
    id: 'the_hanged_man',
    name: 'The Hanged Man',
    number: 12,
    uprightMeaning: 'Pause, surrender, letting go, new perspective, sacrifice',
    reversedMeaning: 'Stalling, needless sacrifice, resistance to change',
    description: 'The Hanged Man hangs upside down by choice. He represents voluntary pause, seeing things from a completely new angle, and surrendering control to let life flow.',
    love: 'A pause in romantic developments. Take time to see the relationship from your partner\'s point of view.',
    career: 'A period of waiting. Avoid forcing decisions; use this delay to plan, re-assess, and prepare.'
  },
  {
    id: 'death',
    name: 'Death',
    number: 13,
    uprightMeaning: 'Ending, transformation, transition, letting go of old patterns',
    reversedMeaning: 'Fear of change, holding onto the past, stagnation',
    description: 'The Death card rarely represents physical death. It signifies the end of a major cycle, clean endings, and the absolute necessity to shed old habits to welcome rebirth.',
    love: 'The end of an unhealthy relationship dynamic, or a transition from old dating patterns to a fresh style.',
    career: 'A major transition at work. Leaving a job, completing a huge project, or changing industry entirely.'
  },
  {
    id: 'temperance',
    name: 'Temperance',
    number: 14,
    uprightMeaning: 'Balance, moderation, patience, harmony, purpose',
    reversedMeaning: 'Imbalance, excess, haste, lack of alignment',
    description: 'Temperance represents alchemy and moderation. It urges finding mid-ground, combining different elements harmoniously, and remaining patient under pressure.',
    love: 'A peaceful, balanced relationship. Finding mutual understanding and avoiding emotional extremes.',
    career: 'Steady progress, balance between work and life, and resolving office disputes with diplomacy.'
  },
  {
    id: 'the_devil',
    name: 'The Devil',
    number: 15,
    uprightMeaning: 'Shadow self, attachment, addiction, restriction, illusion',
    reversedMeaning: 'Release, independence, reclaiming power, breaking chains',
    description: 'The Devil warns of self-imposed limitations, material attachments, and shadow desires. It reminds us that the chains holding us back are often loose enough to slide off if we choose.',
    love: 'Intense passion, but beware of possessiveness, codependency, or unhealthy attachments.',
    career: 'Feeling trapped in a job or bound by materialism. Re-evaluate if your ambition is costing you freedom.'
  },
  {
    id: 'the_tower',
    name: 'The Tower',
    number: 16,
    uprightMeaning: 'Sudden change, upheaval, revelation, breakdown, awakening',
    reversedMeaning: 'Avoiding disaster, delayed disaster, fear of change',
    description: 'The Tower represents sudden, shocking change. Structures built on false foundations crumble instantly, paving the way for raw truth and rebuilds.',
    love: 'Sudden relationship shifts, breakups, or revelations. Truths come to light that alter the relationship status.',
    career: 'Unexpected layoffs, disruption in plans, or company reshuffling. It frees you from stagnant positions.'
  },
  {
    id: 'the_star',
    name: 'The Star',
    number: 17,
    uprightMeaning: 'Hope, faith, renewal, spirituality, serenity, rejuvenation',
    reversedMeaning: 'Despair, lack of faith, discouragement, feeling lost',
    description: 'The Star shines bright after the storm. It represents hope, healing, divine protection, and inner peace. It is a sign that the universe is guiding you towards recovery.',
    love: 'Healing from old heartbreaks. Renewed trust and optimism in your romantic prospects.',
    career: 'Optimism and alignment with your true calling. Creative inspiration and recognition are coming.'
  },
  {
    id: 'the_moon',
    name: 'The Moon',
    number: 18,
    uprightMeaning: 'Illusion, fear, anxiety, subconscious, dreams, mystery',
    reversedMeaning: 'Release of fear, uncovering secrets, clarity',
    description: 'The Moon illuminates the dark path with partial light. It warns of illusions, hidden motives, and subconscious anxieties. Trust your dreams and look past appearances.',
    love: 'Uncertainty or secret emotions. Avoid making rash judgments; wait for clarity and communication.',
    career: 'Lack of clarity regarding projects or career paths. Beware of deceit or hidden clauses in contracts.'
  },
  {
    id: 'the_sun',
    name: 'The Sun',
    number: 19,
    uprightMeaning: 'Success, joy, vitality, celebration, positivity, warmth',
    reversedMeaning: 'Temporary depression, unrealistic optimism, ego blocks',
    description: 'The Sun is the brightest card in the deck. It represents joy, clarity, vitality, success, and absolute happiness. Everything is illuminated in its warm glow.',
    love: 'A radiant, happy, and loving relationship. Celebrations, weddings, or deep joy in partnership.',
    career: 'Great achievements, public recognition, and success in projects. A highly productive phase.'
  },
  {
    id: 'judgement',
    name: 'Judgement',
    number: 20,
    uprightMeaning: 'Reflection, reckoning, awakening, calling, inner voice',
    reversedMeaning: 'Self-doubt, refusal to learn, ignoring calls',
    description: 'Judgement represents an awakening. It is a call to reflect on past decisions, learn from them, and step forward into a higher version of yourself.',
    love: 'A critical turning point. Re-evaluating relationships and making decisions about long-term future.',
    career: 'A calling or major career decision. Trust your judgement when choosing path adjustments.'
  },
  {
    id: 'the_world',
    name: 'The World',
    number: 21,
    uprightMeaning: 'Completion, integration, accomplishment, travel, fulfillment',
    reversedMeaning: 'Incompletion, lack of closure, shortcuts',
    description: 'The World represents completion and achievement. It signifies wrapping up a major cycle successfully, experiencing wholeness, and receiving the rewards of your effort.',
    love: 'Fulfillment, happy milestones, or finding a deep, complete partnership. Long-term goals achieved.',
    career: 'Successful completion of projects, global opportunities, or reaching the pinnacle of your career goals.'
  }
];

export const getRandomTarotCard = (): TarotCard => {
  const index = Math.floor(Math.random() * TarotDeck.length);
  return TarotDeck[index];
};
