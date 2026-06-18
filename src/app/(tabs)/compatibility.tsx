import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { usePremiumModal } from '../../components/PremiumModal';
import { Colors } from '../../constants/Colors';
import { ZodiacSigns, ZodiacSign } from '../../constants/ZodiacData';
import { ZodiacEmojis } from '../../components/ZodiacSelector';
import { calculateCompatibility, CompatibilityResult } from '../../services/compatibility';
import { CompatibilityMeter } from '../../components/CompatibilityMeter';
import { Heart, Sparkles, RefreshCw, User, Calendar, Award } from 'lucide-react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

// Custom SVG Circular Progress
function CircularProgress({ targetPercentage }: { targetPercentage: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
    let start = 0;
    const end = targetPercentage;
    if (end === 0) return;
    
    const duration = 1200; // 1.2 seconds
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCurrent(end);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetPercentage]);

  const radius = 54;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (current / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }} className="my-4">
      <Svg width={140} height={140} viewBox="0 0 140 140">
        {/* Background track circle */}
        <Circle
          cx={70}
          cy={70}
          r={radius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress stroke circle */}
        <Circle
          cx={70}
          cy={70}
          r={radius}
          stroke={Colors.gold}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 70 70)"
        />
        {/* Center Percentage Display */}
        <SvgText
          x={70}
          y={72}
          fill="#FFFFFF"
          fontSize="24"
          fontWeight="900"
          textAnchor="middle"
        >
          {`${current}%`}
        </SvgText>
        <SvgText
          x={70}
          y={88}
          fill={Colors.textMuted}
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
          letterSpacing="1.5"
        >
          SYNASTRY
        </SvgText>
      </Svg>
    </View>
  );
}

// Custom Horizontal Progress Bar
function ProgressBar({ score, label, color }: { score: number; label: string; color: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
    let start = 0;
    const end = score;
    const timer = setInterval(() => {
      start += 2;
      if (start >= end) {
        setCurrent(end);
        clearInterval(timer);
      } else {
        setCurrent(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <View style={{ gap: 6 }} className="mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-white/60 text-xs font-semibold">{label}</Text>
        <Text className="text-white font-bold text-xs">{current}%</Text>
      </View>
      <View className="h-2 bg-white/5 border border-white/5 rounded-full overflow-hidden w-full">
        <View
          style={{ width: `${current}%`, backgroundColor: color }}
          className="h-full rounded-full"
        />
      </View>
    </View>
  );
}

interface MilanResult {
  maleName: string;
  femaleName: string;
  gunasMatched: number;
  matchPercentage: number;
  loveScore: number;
  marriageScore: number;
  classification: string;
  color: string;
  loveReading: string;
  marriageReading: string;
}

const getVedicMatchReadings = (gunasMatched: number) => {
  if (gunasMatched >= 28) {
    return {
      classification: 'Excellent (Uttama)',
      color: '#4CAF50',
      loveReading: 'Your emotional and energetic waves align beautifully. Venus is highly favorable, fostering deep mutual admiration, intellectual respect, and pure romantic bliss.',
      marriageReading: 'An outstanding match for lifelong harmony. Your charts display strong Guna synergy, which minimizes future obstacles and paves the way for a prosperous partnership, wealth, and family longevity.',
    };
  } else if (gunasMatched >= 18) {
    return {
      classification: 'Good (Madhyama)',
      color: Colors.gold,
      loveReading: 'A warm and stable connection. You share common life values and emotional grounding, though occasional Mercury transits require conscious communication.',
      marriageReading: 'Highly recommended for marital union. With more than 18 gunas matching, you pass the traditional Vedic compatibility threshold. Minor chart friction can be resolved easily through collaborative understanding.',
    };
  } else {
    return {
      classification: 'Average (Sama)',
      color: '#FF9800',
      loveReading: 'A passionate but intense energetic chemistry. Highly active Mars energies can trigger occasional ego clashes, requiring conscious compromises and mutual emotional space.',
      marriageReading: 'Vedic guidelines advise planetary remedies. Your matching score is below the ideal 18 guna threshold, suggesting temperamental differences. Performing simple acts of charity together will help balance transit charts.',
    };
  }
};

export default function Compatibility() {
  const [activeTab, setActiveTab] = useState<'zodiac' | 'milan'>('zodiac');
  const { showError } = usePremiumModal();

  // Zodiac matcher states
  const [signA, setSignA] = useState<ZodiacSign | null>(null);
  const [signB, setSignB] = useState<ZodiacSign | null>(null);
  const [selectingTarget, setSelectingTarget] = useState<'A' | 'B' | null>(null);
  const [matchResult, setMatchResult] = useState<CompatibilityResult | null>(null);

  // Vedic Milan matcher states
  const [maleName, setMaleName] = useState('');
  const [maleDob, setMaleDob] = useState('');
  const [femaleName, setFemaleName] = useState('');
  const [femaleDob, setFemaleDob] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [milanResult, setMilanResult] = useState<MilanResult | null>(null);

  const handleSelectSign = (sign: ZodiacSign) => {
    if (selectingTarget === 'A') {
      setSignA(sign);
    } else if (selectingTarget === 'B') {
      setSignB(sign);
    }
    setSelectingTarget(null);
    setMatchResult(null);
  };

  const handleCalculateMatch = () => {
    if (signA && signB) {
      const result = calculateCompatibility(signA.id, signB.id);
      setMatchResult(result);
    }
  };

  const validateMilanForm = () => {
    if (!maleName.trim()) {
      showError('Validation Error', "Please enter the Male's Name.");
      return false;
    }
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(maleDob)) {
      showError('Validation Error', "Please enter Male's Date of Birth in YYYY-MM-DD format.");
      return false;
    }
    if (!femaleName.trim()) {
      showError('Validation Error', "Please enter the Female's Name.");
      return false;
    }
    if (!dobRegex.test(femaleDob)) {
      showError('Validation Error', "Please enter Female's Date of Birth in YYYY-MM-DD format.");
      return false;
    }
    return true;
  };

  const handleCalculateMilan = () => {
    if (!validateMilanForm()) return;

    setIsCalculating(true);
    setLoadingText('Aligning birth stars & gunas...');

    setTimeout(() => {
      setLoadingText('Analyzing synastry transits...');
    }, 500);

    setTimeout(() => {
      setLoadingText('Computing Vedic Milan scores...');
    }, 1000);

    setTimeout(() => {
      const mHash = maleName.toLowerCase().split('').reduce((sum, c) => sum + c.charCodeAt(0), 0) + maleDob.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
      const fHash = femaleName.toLowerCase().split('').reduce((sum, c) => sum + c.charCodeAt(0), 0) + femaleDob.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
      const baseHash = mHash + fHash;

      // Gunas: 15 to 35
      const gunasMatched = 15 + (baseHash % 21);
      const matchPercentage = Math.floor((gunasMatched / 36) * 100);

      // Love score: 70 to 98
      const loveScore = 70 + (baseHash % 29);

      // Marriage score: 65 to 96
      const marriageScore = 65 + ((baseHash + 7) % 32);

      const readings = getVedicMatchReadings(gunasMatched);

      setMilanResult({
        maleName: maleName.trim(),
        femaleName: femaleName.trim(),
        gunasMatched,
        matchPercentage,
        loveScore,
        marriageScore,
        classification: readings.classification,
        color: readings.color,
        loveReading: readings.loveReading,
        marriageReading: readings.marriageReading,
      });

      setIsCalculating(false);
    }, 1500);
  };

  const handleResetZodiac = () => {
    setSignA(null);
    setSignB(null);
    setMatchResult(null);
    setSelectingTarget(null);
  };

  const handleResetMilan = () => {
    setMaleName('');
    setMaleDob('');
    setFemaleName('');
    setFemaleDob('');
    setMilanResult(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgDark }}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-white/5 flex-row justify-between items-center bg-astro-deep/40">
        <Text className="text-white text-xl font-bold">Compatibility Sanctuary</Text>
        {(matchResult || milanResult) && (
          <TouchableOpacity
            onPress={matchResult ? handleResetZodiac : handleResetMilan}
            className="flex-row items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
          >
            <RefreshCw size={12} color={Colors.gold} style={{ marginRight: 6 }} />
            <Text className="text-astro-gold text-xs font-semibold">Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading Overlay */}
      {isCalculating && (
        <View style={styles.loadingContainer} className="bg-astro-bgDark/95">
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text className="text-white font-bold text-base mt-4 text-center px-6">
            {loadingText}
          </Text>
          <Text className="text-white/40 text-xs mt-2 uppercase tracking-widest">
            AstroGuide Matcher
          </Text>
        </View>
      )}

      {/* Segment Tab Switcher */}
      {!(matchResult || milanResult) && (
        <View className="px-6 pt-4">
          <View className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex-row">
            <TouchableOpacity
              onPress={() => setActiveTab('zodiac')}
              className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === 'zodiac' ? 'bg-astro-gold' : ''}`}
            >
              <Text className={`text-xs font-bold ${activeTab === 'zodiac' ? 'text-astro-bg' : 'text-white/60'}`}>
                Zodiac Signs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('milan')}
              className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === 'milan' ? 'bg-astro-gold' : ''}`}
            >
              <Text className={`text-xs font-bold ${activeTab === 'milan' ? 'text-astro-bg' : 'text-white/60'}`}>
                Kundli Milan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        {activeTab === 'zodiac' ? (
          // Zodiac Comparison View
          <View>
            {!matchResult && (
              <View>
                <Text className="text-white/40 text-xs text-center mb-6">
                  Compare elements, qualities, and synastry balances between two zodiac signs
                </Text>

                {/* Selection circles */}
                <View style={{ gap: 24 }} className="flex-row items-center justify-center mb-8">
                  {/* Sign A Circle */}
                  <TouchableOpacity
                    onPress={() => setSelectingTarget('A')}
                    className={`w-24 h-24 rounded-full border-2 items-center justify-center ${
                      selectingTarget === 'A'
                        ? 'border-astro-gold bg-astro-gold/15 shadow-md'
                        : signA
                        ? 'border-astro-gold/60 bg-white/5'
                        : 'border-white/15 bg-white/5 border-dashed'
                    }`}
                    style={{
                      shadowColor: Colors.gold,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: selectingTarget === 'A' ? 0.25 : 0,
                      shadowRadius: 6,
                    }}
                  >
                    {signA ? (
                      <View className="items-center">
                        <Text className="text-4xl">{ZodiacEmojis[signA.id]}</Text>
                        <Text className="text-white font-semibold text-xs mt-1">{signA.name}</Text>
                      </View>
                    ) : (
                      <View className="items-center">
                        <Text className="text-white/30 text-2xl">+</Text>
                        <Text className="text-white/40 text-[10px] uppercase font-bold mt-1">Sign One</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <Heart size={24} color={signA && signB ? Colors.gold : 'rgba(255,255,255,0.15)'} fill={signA && signB ? Colors.gold : 'transparent'} />

                  {/* Sign B Circle */}
                  <TouchableOpacity
                    onPress={() => setSelectingTarget('B')}
                    className={`w-24 h-24 rounded-full border-2 items-center justify-center ${
                      selectingTarget === 'B'
                        ? 'border-astro-gold bg-astro-gold/15 shadow-md'
                        : signB
                        ? 'border-astro-gold/60 bg-white/5'
                        : 'border-white/15 bg-white/5 border-dashed'
                    }`}
                    style={{
                      shadowColor: Colors.gold,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: selectingTarget === 'B' ? 0.25 : 0,
                      shadowRadius: 6,
                    }}
                  >
                    {signB ? (
                      <View className="items-center">
                        <Text className="text-4xl">{ZodiacEmojis[signB.id]}</Text>
                        <Text className="text-white font-semibold text-xs mt-1">{signB.name}</Text>
                      </View>
                    ) : (
                      <View className="items-center">
                        <Text className="text-white/30 text-2xl">+</Text>
                        <Text className="text-white/40 text-[10px] uppercase font-bold mt-1">Sign Two</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Selection Grid */}
                {selectingTarget && (
                  <View className="bg-white/5 rounded-3xl p-5 border border-white/10 mb-6">
                    <Text className="text-white text-sm font-semibold text-center mb-4">
                      Select Sign {selectingTarget}
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                      {ZodiacSigns.map((sign) => (
                        <TouchableOpacity
                          key={sign.id}
                          onPress={() => handleSelectSign(sign)}
                          className="w-[22%] items-center mb-4 p-2 bg-white/5 rounded-xl border border-white/10"
                        >
                          <Text className="text-2xl">{ZodiacEmojis[sign.id]}</Text>
                          <Text className="text-white/80 text-[10px] font-medium mt-1">{sign.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Match Button */}
                <TouchableOpacity
                  onPress={handleCalculateMatch}
                  disabled={!signA || !signB}
                  className={`rounded-2xl py-4 items-center mt-4 ${
                    signA && signB ? 'bg-astro-gold' : 'bg-white/10'
                  }`}
                  style={signA && signB ? styles.compareButtonShadow : {}}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`font-extrabold text-base uppercase tracking-wider ${
                      signA && signB ? 'text-astro-bg' : 'text-white/30'
                    }`}
                  >
                    Compare Compatibility
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Results Area */}
            {matchResult && <CompatibilityMeter result={matchResult} />}
          </View>
        ) : (
          // Vedic Kundli Milan View
          <View>
            {!milanResult ? (
              // Form Screen
              <View style={{ gap: 20 }}>
                <Text className="text-white/40 text-xs text-center">
                  Vedic Ashta Kuta compatibility analysis based on names and birth dates
                </Text>

                {/* Male Profile Inputs */}
                <View className="bg-white/5 border border-white/10 rounded-3xl p-5" style={{ gap: 12 }}>
                  <Text className="text-astro-gold text-[10px] uppercase font-black tracking-wider flex-row items-center">
                    Male Profile Details
                  </Text>
                  
                  <View style={{ gap: 6 }}>
                    <Text className="text-white/50 text-[9px] uppercase font-semibold">Name</Text>
                    <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                      <User size={14} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 8 }} />
                      <TextInput
                        value={maleName}
                        onChangeText={setMaleName}
                        placeholder="Male Name"
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        className="flex-1 text-white text-xs"
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  <View style={{ gap: 6 }}>
                    <Text className="text-white/50 text-[9px] uppercase font-semibold">Date Of Birth (YYYY-MM-DD)</Text>
                    <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                      <Calendar size={14} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 8 }} />
                      <TextInput
                        value={maleDob}
                        onChangeText={setMaleDob}
                        placeholder="e.g. 1995-12-04"
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        className="flex-1 text-white text-xs"
                        keyboardType="numeric"
                        maxLength={10}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                </View>

                {/* Female Profile Inputs */}
                <View className="bg-white/5 border border-white/10 rounded-3xl p-5" style={{ gap: 12 }}>
                  <Text className="text-astro-gold text-[10px] uppercase font-black tracking-wider">
                    Female Profile Details
                  </Text>
                  
                  <View style={{ gap: 6 }}>
                    <Text className="text-white/50 text-[9px] uppercase font-semibold">Name</Text>
                    <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                      <User size={14} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 8 }} />
                      <TextInput
                        value={femaleName}
                        onChangeText={setFemaleName}
                        placeholder="Female Name"
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        className="flex-1 text-white text-xs"
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  <View style={{ gap: 6 }}>
                    <Text className="text-white/50 text-[9px] uppercase font-semibold">Date Of Birth (YYYY-MM-DD)</Text>
                    <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                      <Calendar size={14} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 8 }} />
                      <TextInput
                        value={femaleDob}
                        onChangeText={setFemaleDob}
                        placeholder="e.g. 1997-08-20"
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        className="flex-1 text-white text-xs"
                        keyboardType="numeric"
                        maxLength={10}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                </View>

                {/* Calculate Button */}
                <TouchableOpacity
                  onPress={handleCalculateMilan}
                  className="bg-astro-gold py-4 rounded-2xl items-center justify-center flex-row mt-2"
                  style={styles.compareButtonShadow}
                  activeOpacity={0.9}
                >
                  <Sparkles size={16} color={Colors.bg} style={{ marginRight: 8 }} />
                  <Text className="text-astro-bg font-extrabold text-sm uppercase tracking-widest">
                    Compute Vedic Milan
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Results Screen
              <View style={{ gap: 24 }}>
                {/* Header Welcome banner */}
                <View className="bg-white/5 border border-white/10 rounded-3xl p-5 items-center">
                  <Text className="text-astro-gold text-[10px] font-extrabold uppercase tracking-widest">
                    Vedic Synastry Report
                  </Text>
                  <Text className="text-white text-lg font-black mt-1 text-center">
                    {milanResult.maleName} & {milanResult.femaleName}
                  </Text>
                  <View
                    style={{ backgroundColor: `${milanResult.color}15`, borderColor: `${milanResult.color}30` }}
                    className="border px-3 py-1 rounded-full mt-2.5"
                  >
                    <Text style={{ color: milanResult.color }} className="text-[10px] font-bold uppercase tracking-wider">
                      {milanResult.classification}
                    </Text>
                  </View>
                </View>

                {/* Circular Progress Indicator */}
                <View className="items-center">
                  <CircularProgress targetPercentage={milanResult.matchPercentage} />
                </View>

                {/* Guna Matches Badge */}
                <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Award size={18} color={Colors.gold} style={{ marginRight: 10 }} />
                    <View>
                      <Text className="text-white font-extrabold text-xs">Vedic Guna Matching</Text>
                      <Text className="text-white/40 text-[9px] uppercase font-bold tracking-wider mt-0.5">Ashta Kuta Score</Text>
                    </View>
                  </View>
                  <Text className="text-white font-black text-base">
                    {milanResult.gunasMatched} <Text className="text-white/40 text-xs font-normal">/ 36</Text>
                  </Text>
                </View>

                {/* Love & Marriage Progress Bars */}
                <View className="bg-white/5 border border-white/10 rounded-3xl p-5">
                  <ProgressBar
                    score={milanResult.loveScore}
                    label="Love Compatibility"
                    color={Colors.gold}
                  />
                  <ProgressBar
                    score={milanResult.marriageScore}
                    label="Marriage Compatibility"
                    color="#4CAF50"
                  />
                </View>

                {/* Planetary Synastry Readings */}
                <View style={{ gap: 12 }}>
                  <Text className="text-white font-black text-sm uppercase tracking-widest pl-1">
                    Synastry Readings
                  </Text>
                  
                  {/* Love Reading Card */}
                  <View className="bg-white rounded-3xl p-5 shadow border border-black/5">
                    <View className="flex-row items-center border-b border-black/5 pb-2 mb-2">
                      <Heart size={14} color="#FF4081" style={{ marginRight: 6 }} />
                      <Text className="text-astro-text font-black text-xs uppercase tracking-wider">Love Placements</Text>
                    </View>
                    <Text className="text-astro-text/80 text-xs leading-relaxed">
                      {milanResult.loveReading}
                    </Text>
                  </View>

                  {/* Marriage Reading Card */}
                  <View className="bg-white rounded-3xl p-5 shadow border border-black/5">
                    <View className="flex-row items-center border-b border-black/5 pb-2 mb-2">
                      <Sparkles size={14} color="#4CAF50" style={{ marginRight: 6 }} />
                      <Text className="text-astro-text font-black text-xs uppercase tracking-wider">Marriage Lifepath</Text>
                    </View>
                    <Text className="text-astro-text/80 text-xs leading-relaxed">
                      {milanResult.marriageReading}
                    </Text>
                  </View>
                </View>

                {/* Recalculate CTA */}
                <TouchableOpacity
                  onPress={handleResetMilan}
                  className="border border-astro-gold/40 py-4 rounded-2xl items-center justify-center mt-2"
                  activeOpacity={0.8}
                >
                  <Text className="text-astro-gold font-extrabold text-sm uppercase tracking-widest">
                    Compare Another Match
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  compareButtonShadow: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});
