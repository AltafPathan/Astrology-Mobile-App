import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { usePremiumModal } from '../components/PremiumModal';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '../hooks/useUser';
import { Colors } from '../constants/Colors';
import { ChevronLeft, Compass, Calendar, Clock, MapPin, User, Sparkles, Star, Award, ShieldCheck } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Line, Polygon, Text as SvgText, Circle, Path } from 'react-native-svg';
import { getSunSign, getMoonSign, getRisingSign, AstrologicalProfile } from '../services/astrology';
import { ZodiacSigns } from '../constants/ZodiacData';

interface PlanetPlacement {
  name: string;
  symbol: string;
  sign: string;
  house: number;
  degree: string;
  signification: string;
}

const PLANETS = [
  { name: 'Ascendant (Lagna)', symbol: 'Asc' },
  { name: 'Sun', symbol: 'Su' },
  { name: 'Moon', symbol: 'Mo' },
  { name: 'Mars', symbol: 'Ma' },
  { name: 'Mercury', symbol: 'Me' },
  { name: 'Jupiter', symbol: 'Ju' },
  { name: 'Venus', symbol: 'Ve' },
  { name: 'Saturn', symbol: 'Sa' },
  { name: 'Rahu', symbol: 'Ra' },
  { name: 'Ketu', symbol: 'Ke' },
];

const LUCKY_COLORS = [
  'Royal Gold',
  'Deep Violet',
  'Mystic Emerald',
  'Saffron Yellow',
  'Navy Blue',
  'Silver White',
  'Crimson Red',
  'Amethyst Purple',
  'Ocean Teal'
];

const getPlanetSignification = (symbol: string, house: number): string => {
  const significations: Record<string, string[]> = {
    Asc: [
      'Core personality, physical disposition, and outer self.',
      'How the world perceives you; primary lifepath focus.',
      'Physical vitality, overall health, and constitutional strengths.',
      'Sense of self-worth and raw life motivation.',
    ],
    Su: [
      'Core identity, leadership potential, and soul purpose.',
      'Family values, speech qualities, and financial stability.',
      'Courage, logical intellect, and communication skills.',
      'Domestic happiness, emotional peace, and mother relationship.',
      'Intellectual curiosity, creative arts, and academic success.',
      'Competitive spirit, detail focus, and problem-solving skills.',
      'Strong public presence, social contracts, and partnerships.',
      'Introspective wisdom, research abilities, and longevity.',
      'Philosophical faith, higher education, and fortune.',
      'Career achievements, social status, and professional authority.',
      'Financial gains, social networks, and goal achievements.',
      'Spiritual liberation, isolation comfort, and deep dreams.',
    ],
    Mo: [
      'Emotional identity, intuitive feelings, and empathy.',
      'Sweet speech style, resource values, and family support.',
      'Short journeys, media communications, and curious mind.',
      'Deep emotional bond with mother and secure home base.',
      'Romantic imagination, creativity, and intellectual expression.',
      'Empathetic healing focus, routines, and wellness.',
      'Seeking emotional connections in marriage and partnerships.',
      'Interest in hidden mysteries, deep changes, and transitions.',
      'Devotional philosophy, spiritual guidance, and wisdom.',
      'Public popularity, status developments, and caring authority.',
      'Caring friendships, goals, and supportive networks.',
      'Subconscious seekings, deep sleep, and meditation.',
    ],
    Ma: [
      'Ambitious drive, competitive energy, and vital courage.',
      'Assertive wealth pursuit, raw speech, and resourcefulness.',
      'High courage, athletic capability, and dynamic motivation.',
      'Domestic protection, home restorations, and land assets.',
      'Passionate intellect, educational drive, and competitive sports.',
      'Victory over setbacks, work discipline, and physical wellness.',
      'Energetic spouse bonds and active business associations.',
      'Investigative focus, sudden assets, and physical recovery.',
      'Defending principles, philosophical adventures, and travels.',
      'Executive authority, professional speed, and leadership success.',
      'Assertive income goals, network leaders, and dreams.',
      'High energy expenditure, foreign projects, and active sleep.',
    ],
    Me: [
      'Intellectual conversation, quick learning, and youthfulness.',
      'Excellent financial intelligence, business speech, and memory.',
      'Writing skills, media analysis, and network communication.',
      'Educational environment at home, book libraries, and mental peace.',
      'High analytical power, strategic logic, and mathematical skills.',
      'Problem-solving service, detail coding, and hygiene focus.',
      'Rational agreements, intellectual spouse, and public relations.',
      'Secret research, financial analysis, and investigative studies.',
      'Higher philosophical studies, teaching, and travel logs.',
      'Business administration, career status, and planning.',
      'Smart financial networks, social group structures, and goals.',
      'Imaginative scriptwriting, dream records, and spiritual analysis.',
    ],
    Ju: [
      'Wisdom, optimism, sound health, and ethical values.',
      'Wealth creation, wise advising speech, and family joy.',
      'Supportive communication, positive media, and strong writing.',
      'Spiritual domestic peace, beautiful home, and mother blessings.',
      'Outstanding wisdom, children blessings, and academic honors.',
      'Healing service, conflict resolution, and daily focus.',
      'Harmonious marriages, fair trade, and respected associations.',
      'Understanding of life mysteries, legacy assets, and wisdom.',
      'Excellent fortune, ethical teachings, and pilgrim travels.',
      'Righteous profession, administrative status, and honors.',
      'Outstanding wealth expansion, key advisors, and goal wins.',
      'Spiritual path, isolation comfort, and subconscious peace.',
    ],
    Ve: [
      'Charming charisma, love for beauty, and pleasant persona.',
      'Luxurious assets, artistic speech, and family values.',
      'Artistic design talents, write-ups, and cultural travels.',
      'Elegant home environments, clean vehicles, and domestic comforts.',
      'Creative arts, romance, and artistic children.',
      'Polite services, daily routines, and aesthetic wellness.',
      'Beautiful and loving spouse, social agreements, and public ease.',
      'Shared resources, support in transitions, and occult interests.',
      'Cultural travels, philosophical art, and good fortune.',
      'Artistic profession, status growth, and public popularity.',
      'Gains through creative sectors, social connections, and dreams.',
      'Comforts in rest, luxurious travels, and meditation visualization.',
    ],
    Sa: [
      'Disciplined habits, patient character, and long-term stamina.',
      'Conservative spending, slow wealth growth, and duty to family.',
      'Determined hard effort, writing structure, and serious talks.',
      'Old-age home comfort, property responsibility, and patience.',
      'Serious academic studies, traditional education, and focus.',
      'Strong protection, systematic work systems, and conflict resolution.',
      'Structured marriages, public duties, and business laws.',
      'Longevity, legacy protection, and deep transformations.',
      'Slow spiritual rise, traditional values, and duty to ancestors.',
      'Solid professional status, career patience, and administrative duties.',
      'Systematic profits, older sibling guidance, and group structures.',
      'Disciplined spiritual paths, isolation comfort, and subconscious control.',
    ],
    Ra: [
      'Unconventional identity, high ambition, and intense focus.',
      'Unorthodox wealth generation and expressive speech.',
      'Dynamic communication, media influence, and bravery.',
      'Desire for land/vehicles and emotional restlessness.',
      'High intellect, modern studies, and dynamic creativity.',
      'Victory in debates, resolving dynamic challenges, and service.',
      'Unconventional relationships and foreign business.',
      'Occult sciences interest and transformative developments.',
      'Foreign travel, unique spiritual views, and high luck.',
      'Modern status pursuit, high career drive, and fame.',
      'Extraordinary wealth gain, large network, and big dreams.',
      'Foreign links, vivid dreams, and high expenditures.',
    ],
    Ke: [
      'Introspective nature, detachment from physical appearance, and inner focus.',
      'Detachment from physical wealth and simple speaking.',
      'Quiet bravery, spiritual writing, and sibling detachments.',
      'Simple home life, seeking spiritual comfort, and inner peace.',
      'Intuitive education, creative detours, and deep intellect.',
      'Spiritual healing, overcoming obstacles silently, and simplicity.',
      'Spiritual relationships, seeking space, and public simple image.',
      'Deep occult interest, sudden transformations, and inner strength.',
      'High spiritual dharma, mystical philosophy, and pilgrim journeys.',
      'Silent professional contribution, search for meaning, and simple status.',
      'Simple gains, selective friendships, and focusing on path.',
      'Spiritual liberation (Moksha) focus, meditation, and quiet isolation.',
    ],
  };

  const list = significations[symbol] || significations['Su'];
  const index = (house - 1) % list.length;
  return list[index];
};

const houseCoordinates: Record<number, { signX: number; signY: number; planetX: number; planetY: number }> = {
  1: { signX: 150, signY: 70, planetX: 150, planetY: 88 }, // Top Center Diamond
  2: { signX: 85, signY: 40, planetX: 85, planetY: 58 },   // Top Left Upper
  3: { signX: 45, signY: 85, planetX: 45, planetY: 103 },  // Left Top Lower
  4: { signX: 80, signY: 140, planetX: 80, planetY: 158 }, // Left Center Diamond
  5: { signX: 45, signY: 200, planetX: 45, planetY: 218 }, // Left Bottom Upper
  6: { signX: 85, signY: 245, planetX: 85, planetY: 263 }, // Bottom Left Lower
  7: { signX: 150, signY: 205, planetX: 150, planetY: 223 }, // Bottom Center Diamond
  8: { signX: 215, signY: 245, planetX: 215, planetY: 263 }, // Bottom Right Lower
  9: { signX: 255, signY: 200, planetX: 255, planetY: 218 }, // Right Bottom Upper
  10: { signX: 220, signY: 140, planetX: 220, planetY: 158 }, // Right Center Diamond
  11: { signX: 255, signY: 85, planetX: 255, planetY: 103 },  // Right Top Lower
  12: { signX: 215, signY: 40, planetX: 215, planetY: 58 },   // Top Right Upper
};

export default function KundliScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const { showError } = usePremiumModal();

  // Form states
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(''); // YYYY-MM-DD
  const [birthTime, setBirthTime] = useState(''); // HH:MM
  const [birthPlace, setBirthPlace] = useState('');

  // Generation status states
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showReport, setShowReport] = useState(false);

  // Generated Report Data
  const [reportData, setReportData] = useState<{
    lagna: string;
    luckyNumber: number;
    luckyColor: string;
    placements: PlanetPlacement[];
    housePlanets: Record<number, string[]>;
  } | null>(null);

  // Auto-fill form from user profile context
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBirthDate(profile.birthDate || '');
      setBirthTime(profile.birthTime || '');
      setBirthPlace(profile.birthPlace || '');
    }
  }, [profile]);

  const validateForm = () => {
    if (!name.trim()) {
      showError('Validation Error', 'Please enter your name.');
      return false;
    }
    // Validate DOB format (YYYY-MM-DD)
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(birthDate)) {
      showError('Validation Error', 'Please enter Date of Birth in YYYY-MM-DD format.');
      return false;
    }
    // Validate DOB values
    const dateParts = birthDate.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      showError('Validation Error', 'Please enter a valid Date of Birth.');
      return false;
    }

    // Validate TOB format (HH:MM)
    const tobRegex = /^\d{2}:\d{2}$/;
    if (!tobRegex.test(birthTime)) {
      showError('Validation Error', 'Please enter Time of Birth in HH:MM (24-hour) format.');
      return false;
    }
    const timeParts = birthTime.split(':');
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      showError('Validation Error', 'Please enter a valid Time of Birth (00:00 to 23:59).');
      return false;
    }

    if (!birthPlace.trim()) {
      showError('Validation Error', 'Please enter your Place of Birth.');
      return false;
    }

    return true;
  };

  const handleGenerate = () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setLoadingText('Casting astrological coordinates...');

    // Cycle through mock loading calculations
    setTimeout(() => {
      setLoadingText('Constructing Vedic Lagna chart...');
    }, 500);

    setTimeout(() => {
      setLoadingText('Mapping planetary placements & degree transits...');
    }, 1000);

    setTimeout(async () => {
      // Perform math for planetary houses
      const lagna = getRisingSign(birthDate, birthTime);
      const sun = getSunSign(birthDate);
      const moon = getMoonSign(birthDate);

      const lagnaIdx = ZodiacSigns.findIndex(s => s.id === lagna.id);
      const sunIdx = ZodiacSigns.findIndex(s => s.id === sun.id);
      const moonIdx = ZodiacSigns.findIndex(s => s.id === moon.id);

      // Reproducible hash from input strings
      const dateHash = birthDate.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const timeHash = birthTime.split(':').reduce((sum, char) => sum + (parseInt(char) || 0), 0);
      const baseHash = dateHash + timeHash;

      const planetOffsets = {
        Ma: 2,
        Me: 4,
        Ju: 7,
        Ve: 5,
        Sa: 9,
        Ra: 1,
      };

      const placements: PlanetPlacement[] = PLANETS.map(p => {
        let signIdx = 0;
        if (p.symbol === 'Asc') signIdx = lagnaIdx;
        else if (p.symbol === 'Su') signIdx = sunIdx;
        else if (p.symbol === 'Mo') signIdx = moonIdx;
        else if (p.symbol === 'Ke') {
          const rahuIdx = (baseHash + planetOffsets['Ra']) % 12;
          signIdx = (rahuIdx + 6) % 12;
        } else {
          const offset = planetOffsets[p.symbol as keyof typeof planetOffsets] || 0;
          signIdx = (baseHash + offset) % 12;
        }

        const sign = ZodiacSigns[signIdx] || ZodiacSigns[0];
        const house = ((signIdx - lagnaIdx + 12) % 12) + 1;

        const degreeVal = (baseHash * (signIdx + 1)) % 30;
        const minuteVal = (baseHash * (signIdx + 3)) % 60;
        const degree = `${degreeVal}° ${minuteVal < 10 ? '0' : ''}${minuteVal}'`;

        return {
          name: p.name,
          symbol: p.symbol,
          sign: sign.name,
          house,
          degree,
          signification: getPlanetSignification(p.symbol, house),
        };
      });

      // Group symbols by house (skip Asc in house list representation)
      const housePlanets: Record<number, string[]> = {};
      placements.forEach(p => {
        if (p.symbol === 'Asc') return;
        if (!housePlanets[p.house]) {
          housePlanets[p.house] = [];
        }
        housePlanets[p.house].push(p.symbol);
      });

      const luckyNumber = (baseHash % 9) + 1;
      const luckyColor = LUCKY_COLORS[baseHash % LUCKY_COLORS.length];

      setReportData({
        lagna: lagna.name,
        luckyNumber,
        luckyColor,
        placements,
        housePlanets,
      });

      setIsGenerating(false);
      setShowReport(true);
    }, 1500);
  };

  const handleReset = () => {
    setShowReport(false);
    setReportData(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgDark }}>
      {/* Background Gradient */}
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
        <Defs>
          <RadialGradient id="bgGrad" cx="50%" cy="10%" rx="80%" ry="80%">
            <Stop offset="0%" stopColor="#251758" stopOpacity="0.4" />
            <Stop offset="50%" stopColor="#120B2C" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0B061D" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGrad)" />
      </Svg>

      {/* Header Bar */}
      <View className="px-6 py-4 flex-row items-center border-b border-white/5 bg-astro-deep/40 justify-between">
        <TouchableOpacity
          onPress={() => (showReport ? handleReset() : router.back())}
          className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
        >
          <ChevronLeft size={20} color={Colors.gold} />
        </TouchableOpacity>
        <Text className="text-white font-extrabold text-sm uppercase tracking-widest">
          {showReport ? 'Kundli Report' : 'Kundli Generator'}
        </Text>
        <View className="w-10 h-10 rounded-full bg-astro-gold/15 items-center justify-center border border-astro-gold/30">
          <Compass size={18} color={Colors.gold} />
        </View>
      </View>

      {/* Loading Overlay */}
      {isGenerating && (
        <View style={styles.loadingContainer} className="bg-astro-bgDark/95">
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text className="text-white font-bold text-base mt-4 text-center px-6">
            {loadingText}
          </Text>
          <Text className="text-white/40 text-xs mt-2 uppercase tracking-widest">
            AstroGuide Engine
          </Text>
        </View>
      )}

      {/* Main Content Area */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 50 }}
      >
        {!showReport ? (
          // Input Form UI
          <View style={{ gap: 20 }}>
            {/* Header info */}
            <View className="items-center py-4">
              <View className="w-16 h-16 rounded-full bg-astro-gold/10 items-center justify-center border border-astro-gold/30 mb-3">
                <Compass size={32} color={Colors.gold} />
              </View>
              <Text className="text-white text-xl font-black text-center tracking-tight">
                Vedic Birth Chart Calculator
              </Text>
              <Text className="text-white/50 text-xs text-center mt-1 px-4">
                Enter your precise birth details to chart your planets, house significations, and cosmic elements.
              </Text>
            </View>

            {/* Input Card Container */}
            <View className="bg-white/5 border border-white/10 rounded-3xl p-6" style={{ gap: 16 }}>
              {/* Name Input */}
              <View style={{ gap: 6 }}>
                <Text className="text-astro-gold text-[10px] uppercase font-black tracking-wider">
                  Full Name
                </Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <User size={16} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 10 }} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    className="flex-1 text-white text-sm"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Date Of Birth */}
              <View style={{ gap: 6 }}>
                <Text className="text-astro-gold text-[10px] uppercase font-black tracking-wider">
                  Date Of Birth (YYYY-MM-DD)
                </Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <Calendar size={16} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 10 }} />
                  <TextInput
                    value={birthDate}
                    onChangeText={setBirthDate}
                    placeholder="e.g. 1998-05-15"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    className="flex-1 text-white text-sm"
                    keyboardType="numeric"
                    maxLength={10}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Time Of Birth */}
              <View style={{ gap: 6 }}>
                <Text className="text-astro-gold text-[10px] uppercase font-black tracking-wider">
                  Time Of Birth (HH:MM - 24hr format)
                </Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <Clock size={16} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 10 }} />
                  <TextInput
                    value={birthTime}
                    onChangeText={setBirthTime}
                    placeholder="e.g. 14:30"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    className="flex-1 text-white text-sm"
                    keyboardType="numeric"
                    maxLength={5}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Place Of Birth */}
              <View style={{ gap: 6 }}>
                <Text className="text-astro-gold text-[10px] uppercase font-black tracking-wider">
                  Place Of Birth (City, Country)
                </Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <MapPin size={16} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 10 }} />
                  <TextInput
                    value={birthPlace}
                    onChangeText={setBirthPlace}
                    placeholder="e.g. New Delhi, India"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    className="flex-1 text-white text-sm"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              onPress={handleGenerate}
              className="bg-astro-gold py-4 rounded-2xl items-center justify-center flex-row"
              style={styles.generateButton}
              activeOpacity={0.9}
            >
              <Sparkles size={16} color={Colors.bg} style={{ marginRight: 8 }} />
              <Text className="text-astro-bg font-extrabold text-sm uppercase tracking-widest">
                Calculate Kundli Chart
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Report Display UI
          reportData && (
            <View style={{ gap: 24 }}>
              {/* Premium Report Welcome Banner */}
              <View className="bg-white/5 border border-white/10 rounded-3xl p-5 items-center">
                <Text className="text-astro-gold text-[10px] font-extrabold uppercase tracking-widest">
                  Vedic Horoscope Matrix
                </Text>
                <Text className="text-white text-2xl font-black tracking-tight mt-1 text-center">
                  {name}'s Natal Chart
                </Text>
                <Text className="text-white/40 text-[9px] text-center mt-1 uppercase tracking-wider">
                  Born: {birthDate} | {birthTime} | {birthPlace}
                </Text>
              </View>

              {/* SVG North Indian Kundli Display */}
              <View className="items-center">
                <Text className="text-astro-gold text-xs font-black uppercase tracking-widest mb-4">
                  North Indian Lagna Kundli (D1)
                </Text>
                <View className="bg-white/5 border border-white/15 rounded-3xl p-5 shadow-lg">
                  <Svg width={280} height={280} viewBox="0 0 300 300">
                    {/* SVG Filters */}
                    <Defs>
                      <RadialGradient id="svgGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor="#251758" stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="#1A103D" stopOpacity="1" />
                      </RadialGradient>
                    </Defs>
                    
                    {/* Inner chart base gradient */}
                    <Rect x={10} y={10} width={280} height={280} rx={16} fill="url(#svgGrad)" stroke={Colors.gold} strokeWidth={2} />
                    
                    {/* North Indian Diamond Lines */}
                    {/* Main Diagonals */}
                    <Line x1={10} y1={10} x2={290} y2={290} stroke={Colors.gold} strokeWidth={1.5} opacity={0.8} />
                    <Line x1={290} y1={10} x2={10} y2={290} stroke={Colors.gold} strokeWidth={1.5} opacity={0.8} />
                    
                    {/* Inner Diamond Points (connect midpoints: (150,10), (10,150), (150,290), (290,150)) */}
                    <Polygon points="150,10 290,150 150,290 10,150" stroke={Colors.gold} strokeWidth={1.5} fill="none" opacity={0.9} />

                    {/* Small center circle for focal energy */}
                    <Circle cx={150} cy={150} r={4} fill={Colors.gold} opacity={0.5} />

                    {/* Render sign numbers & planets coordinates */}
                    {Object.keys(houseCoordinates).map((houseStr) => {
                      const H = parseInt(houseStr, 10);
                      const coords = houseCoordinates[H];
                      
                      // Calculate sign index (1-12) placing Lagna in 1st house
                      const lagnaIdx = ZodiacSigns.findIndex(s => s.id === getRisingSign(birthDate, birthTime).id);
                      const signNum = ((lagnaIdx + H - 1) % 12) + 1;
                      
                      // Get planets inside this house
                      const planets = reportData.housePlanets[H] || [];
                      const planetsStr = planets.join(' ');

                      return (
                        <React.Fragment key={H}>
                          {/* House Sign Number */}
                          <SvgText
                            x={coords.signX}
                            y={coords.signY}
                            fill="#F4C95D"
                            fontSize="11"
                            fontWeight="900"
                            textAnchor="middle"
                          >
                            {signNum}
                          </SvgText>
                          {/* Planets text symbol list */}
                          {planetsStr.length > 0 && (
                            <SvgText
                              x={coords.planetX}
                              y={coords.planetY}
                              fill="#FFFFFF"
                              fontSize="10"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {planetsStr}
                            </SvgText>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </Svg>
                </View>
                <Text className="text-white/40 text-[9px] text-center mt-3 uppercase tracking-wider">
                  Asc = Ascendant | Su = Sun | Mo = Moon | Ma = Mars | Me = Mercury | Ju = Jupiter | Ve = Venus | Sa = Saturn | Ra = Rahu | Ke = Ketu
                </Text>
              </View>

              {/* Overview Details Cards */}
              <View className="flex-row" style={{ gap: 12 }}>
                {/* Ascendant Sign */}
                <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
                  <Compass size={18} color={Colors.gold} />
                  <Text className="text-white/40 text-[8px] uppercase font-bold tracking-wider mt-1">Ascendant</Text>
                  <Text className="text-white font-extrabold text-xs mt-0.5 text-center" numberOfLines={1}>
                    {reportData.lagna}
                  </Text>
                </View>

                {/* Lucky Number */}
                <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
                  <Star size={18} color={Colors.gold} />
                  <Text className="text-white/40 text-[8px] uppercase font-bold tracking-wider mt-1">Lucky No.</Text>
                  <Text className="text-white font-extrabold text-sm mt-0.5">
                    {reportData.luckyNumber}
                  </Text>
                </View>

                {/* Lucky Color */}
                <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
                  <Award size={18} color={Colors.gold} />
                  <Text className="text-white/40 text-[8px] uppercase font-bold tracking-wider mt-1">Lucky Color</Text>
                  <Text className="text-white font-extrabold text-[10px] mt-0.5 text-center" numberOfLines={1}>
                    {reportData.luckyColor}
                  </Text>
                </View>
              </View>

              {/* Planetary Position Details Table */}
              <View className="bg-white/5 border border-white/10 rounded-3xl p-5">
                <Text className="text-white font-black text-sm uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                  Planetary Positions
                </Text>
                
                {/* Header Row */}
                <View className="flex-row py-1 border-b border-white/5 mb-2">
                  <Text className="flex-1 text-astro-gold text-[9px] uppercase font-black tracking-wider">Planet</Text>
                  <Text className="w-20 text-astro-gold text-[9px] uppercase font-black tracking-wider text-center">Sign</Text>
                  <Text className="w-14 text-astro-gold text-[9px] uppercase font-black tracking-wider text-center">House</Text>
                  <Text className="w-16 text-astro-gold text-[9px] uppercase font-black tracking-wider text-right">Degree</Text>
                </View>

                {/* Body Rows */}
                {reportData.placements.map((p, idx) => (
                  <View key={idx} className="flex-row py-2 border-b border-white/5 last:border-b-0 items-center">
                    <View className="flex-1 flex-row items-center">
                      <View className="w-4 h-4 bg-astro-gold/10 border border-astro-gold/25 items-center justify-center rounded mr-2">
                        <Text className="text-[7px] text-astro-gold font-bold">{p.symbol}</Text>
                      </View>
                      <Text className="text-white font-bold text-xs">{p.name}</Text>
                    </View>
                    <Text className="w-20 text-white/70 text-xs text-center">{p.sign}</Text>
                    <Text className="w-14 text-white/90 text-xs font-bold text-center">{p.house}</Text>
                    <Text className="w-16 text-white/50 text-[10px] text-right">{p.degree}</Text>
                  </View>
                ))}
              </View>

              {/* House Interpretations List */}
              <View style={{ gap: 12 }}>
                <Text className="text-white font-black text-sm uppercase tracking-widest pl-1">
                  Planetary Insights
                </Text>
                
                {reportData.placements.map((p, idx) => {
                  if (p.symbol === 'Asc') return null; // Ascendant is handled overall, focus on planetary placements
                  return (
                    <View key={idx} className="bg-white rounded-3xl p-5 border border-white/10 shadow-sm">
                      <View className="flex-row items-center justify-between border-b border-black/5 pb-2 mb-2">
                        <View className="flex-row items-center">
                          <Sparkles size={14} color={Colors.bg} style={{ marginRight: 6 }} />
                          <Text className="text-astro-text font-black text-sm">{p.name} in {p.house}st House</Text>
                        </View>
                        <View className="bg-astro-bg/5 px-2 py-0.5 rounded-md">
                          <Text className="text-astro-text text-[9px] font-extrabold uppercase">{p.sign}</Text>
                        </View>
                      </View>
                      <Text className="text-astro-text/80 text-xs leading-relaxed">
                        {p.signification}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Recalculate CTA */}
              <TouchableOpacity
                onPress={handleReset}
                className="border border-astro-gold/40 py-4 rounded-2xl items-center justify-center"
                activeOpacity={0.8}
              >
                <Text className="text-astro-gold font-extrabold text-sm uppercase tracking-widest">
                  Generate Another Kundli
                </Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  generateButton: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
