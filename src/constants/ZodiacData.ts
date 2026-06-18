export interface ZodiacSign {
  id: string;
  name: string;
  dateRange: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  rulingPlanet: string;
  symbol: string;
  strengths: string[];
  weaknesses: string[];
  description: string;
  luckyNumber: number;
  luckyColor: string;
  compatibleSigns: string[];
}

export const ZodiacSigns: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    dateRange: 'Mar 21 - Apr 19',
    element: 'Fire',
    modality: 'Cardinal',
    rulingPlanet: 'Mars',
    symbol: 'The Ram',
    strengths: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Optimistic'],
    weaknesses: ['Impatient', 'Moody', 'Short-tempered', 'Impulsive', 'Aggressive'],
    description: 'As the first sign in the zodiac, the presence of Aries always marks the beginning of something energetic and turbulent. They are continuously looking for dynamic speed, competition and active challenges, always being first in everything.',
    luckyNumber: 9,
    luckyColor: 'Red',
    compatibleSigns: ['Leo', 'Sagittarius', 'Libra']
  },
  {
    id: 'taurus',
    name: 'Taurus',
    dateRange: 'Apr 20 - May 20',
    element: 'Earth',
    modality: 'Fixed',
    rulingPlanet: 'Venus',
    symbol: 'The Bull',
    strengths: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Responsible', 'Stable'],
    weaknesses: ['Stubborn', 'Possessive', 'Uncompromising'],
    description: 'Practical and well-grounded, Taurus is the sign that harvests the fruits of labor. They feel the need to always be surrounded by love and beauty, turned to the material world, hedonism, and physical pleasures.',
    luckyNumber: 6,
    luckyColor: 'Green',
    compatibleSigns: ['Virgo', 'Capricorn', 'Scorpio']
  },
  {
    id: 'gemini',
    name: 'Gemini',
    dateRange: 'May 21 - Jun 20',
    element: 'Air',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    symbol: 'The Twins',
    strengths: ['Gentle', 'Affectionate', 'Curious', 'Adaptable', 'Ability to learn quickly'],
    weaknesses: ['Nervous', 'Inconsistent', 'Indecisive'],
    description: 'Expressive and quick-witted, Gemini represents two different personalities in one and you will never be sure which one you will face. They are sociable, communicative and ready for fun, with a tendency to suddenly get serious, restless and inquisitive.',
    luckyNumber: 5,
    luckyColor: 'Yellow',
    compatibleSigns: ['Libra', 'Aquarius', 'Sagittarius']
  },
  {
    id: 'cancer',
    name: 'Cancer',
    dateRange: 'Jun 21 - Jul 22',
    element: 'Water',
    modality: 'Cardinal',
    rulingPlanet: 'Moon',
    symbol: 'The Crab',
    strengths: ['Tenacious', 'Highly imaginative', 'Loyal', 'Emotional', 'Sympathetic', 'Persuasive'],
    weaknesses: ['Moody', 'Pessimistic', 'Suspicious', 'Manipulative', 'Insecure'],
    description: 'Deeply intuitive and sentimental, Cancer can be one of the most challenging zodiac signs to get to know. They are very emotional and sensitive, and care deeply about matters of the family and their home.',
    luckyNumber: 2,
    luckyColor: 'White',
    compatibleSigns: ['Scorpio', 'Pisces', 'Capricorn']
  },
  {
    id: 'leo',
    name: 'Leo',
    dateRange: 'Jul 23 - Aug 22',
    element: 'Fire',
    modality: 'Fixed',
    rulingPlanet: 'Sun',
    symbol: 'The Lion',
    strengths: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful', 'Humorous'],
    weaknesses: ['Arrogant', 'Stubborn', 'Self-centered', 'Lazy', 'Inflexible'],
    description: 'People born under the sign of Leo are natural born leaders. They are dramatic, creative, self-confident, dominant and extremely difficult to resist, able to achieve anything they want to in any area of life they commit to.',
    luckyNumber: 1,
    luckyColor: 'Gold',
    compatibleSigns: ['Aries', 'Sagittarius', 'Aquarius']
  },
  {
    id: 'virgo',
    name: 'Virgo',
    dateRange: 'Aug 23 - Sep 22',
    element: 'Earth',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    symbol: 'The Virgin',
    strengths: ['Loyal', 'Analytical', 'Kind', 'Hardworking', 'Practical'],
    weaknesses: ['Shyness', 'Worry', 'Overly critical of self and others', 'All work and no play'],
    description: 'Virgos are always paying attention to the smallest details and their deep sense of humanity makes them one of the most careful signs of the zodiac. Their methodical approach to life ensures that nothing is left to chance.',
    luckyNumber: 5,
    luckyColor: 'Grey',
    compatibleSigns: ['Taurus', 'Capricorn', 'Pisces']
  },
  {
    id: 'libra',
    name: 'Libra',
    dateRange: 'Sep 23 - Oct 22',
    element: 'Air',
    modality: 'Cardinal',
    rulingPlanet: 'Venus',
    symbol: 'The Scales',
    strengths: ['Cooperative', 'Diplomatic', 'Gracious', 'Fair-minded', 'Social'],
    weaknesses: ['Indecisive', 'Avoids confrontations', 'Will carry a grudge', 'Self-pity'],
    description: 'People born under the sign of Libra are peaceful, fair, and they hate being alone. Partnership is very important for them, as their mirror and someone giving them the ability to be the mirror themselves.',
    luckyNumber: 3,
    luckyColor: 'Pink',
    compatibleSigns: ['Gemini', 'Aquarius', 'Aries']
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    dateRange: 'Oct 23 - Nov 21',
    element: 'Water',
    modality: 'Fixed',
    rulingPlanet: 'Pluto',
    symbol: 'The Scorpion',
    strengths: ['Resourceful', 'Powerful', 'Brave', 'Passionate', 'A true friend'],
    weaknesses: ['Distrusting', 'Jealous', 'Secretive', 'Violent'],
    description: 'Scorpio-born are passionate and assertive people. They are determined and decisive, and will research until they find out the truth. Scorpio is a great leader, always aware of the situation and also features prominently in resourcefulness.',
    luckyNumber: 4,
    luckyColor: 'Rust',
    compatibleSigns: ['Cancer', 'Pisces', 'Taurus']
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    dateRange: 'Nov 22 - Dec 21',
    element: 'Fire',
    modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    symbol: 'The Archer',
    strengths: ['Generous', 'Idealistic', 'Great sense of humor'],
    weaknesses: ['Promises more than can deliver', 'Very impatient', 'Will say anything no matter how undiplomatic'],
    description: 'Curious and energetic, Sagittarius is one of the biggest travelers among all zodiac signs. Their open mind and philosophical view motivates them to wander around the world in search of the meaning of life.',
    luckyNumber: 7,
    luckyColor: 'Blue',
    compatibleSigns: ['Aries', 'Leo', 'Gemini']
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    dateRange: 'Dec 22 - Jan 19',
    element: 'Earth',
    modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    symbol: 'The Goat',
    strengths: ['Responsible', 'Disciplined', 'Self-control', 'Good managers'],
    weaknesses: ['Know-it-all', 'Unforgiving', 'Condescending', 'Expecting the worst'],
    description: 'Capricorn is a sign that represents time and responsibility, and its representatives are traditional and often very serious by nature. These individuals possess an inner state of independence that enables significant progress both in their personal and professional lives.',
    luckyNumber: 8,
    luckyColor: 'Brown',
    compatibleSigns: ['Taurus', 'Virgo', 'Cancer']
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    dateRange: 'Jan 20 - Feb 18',
    element: 'Air',
    modality: 'Fixed',
    rulingPlanet: 'Uranus',
    symbol: 'The Water Bearer',
    strengths: ['Progressive', 'Original', 'Independent', 'Humanitarian'],
    weaknesses: ['Runs from emotional expression', 'Temperamental', 'Uncompromising', 'Aloof'],
    description: 'Aquarius-born are shy and quiet, but on the other hand they can be eccentric and energetic. However, in both cases, they are deep thinkers and highly intellectual people who love helping others.',
    luckyNumber: 4,
    luckyColor: 'Silver',
    compatibleSigns: ['Gemini', 'Libra', 'Leo']
  },
  {
    id: 'pisces',
    name: 'Pisces',
    dateRange: 'Feb 19 - Mar 20',
    element: 'Water',
    modality: 'Mutable',
    rulingPlanet: 'Neptune',
    symbol: 'The Fish',
    strengths: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise', 'Musical'],
    weaknesses: ['Fearful', 'Overly trusting', 'Sad', 'Desire to escape reality', 'Can be a victim or a martyr'],
    description: 'Pisces are very friendly, so they often find themselves in a company of very different people. Pisces are selfless, they are always willing to help others, without hoping to get anything back.',
    luckyNumber: 3,
    luckyColor: 'Mauve',
    compatibleSigns: ['Cancer', 'Scorpio', 'Virgo']
  }
];

export const getZodiacSignById = (id: string): ZodiacSign | undefined => {
  return ZodiacSigns.find(sign => sign.id === id.toLowerCase());
};
