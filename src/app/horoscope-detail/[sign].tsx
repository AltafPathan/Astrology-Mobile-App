import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getZodiacSignById } from '../../constants/ZodiacData';
import { ZodiacEmojis } from '../../components/ZodiacSelector';
import { useLocalHoroscope } from '../../hooks/useLocalHoroscope';
import { Colors } from '../../constants/Colors';
import { ChevronLeft, Calendar, Heart, Briefcase, Activity, Coins, Star, Compass } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Elements-matching icon tints
const elementTints: Record<string, string> = {
  Fire: '#FFA07A',
  Earth: '#8FBC8F',
  Air: '#87CEFA',
  Water: '#6495ED',
};

export default function HoroscopeDetail() {
  const { sign } = useLocalSearchParams<{ sign: string }>();
  const router = useRouter();
  const zodiacSign = getZodiacSignById(sign || '');
  
  // Selected tab: 'daily' | 'weekly' | 'monthly'
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { data: horoscope, isLoading, isError } = useLocalHoroscope(sign);

  if (!zodiacSign) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-white text-lg">Zodiac Sign not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-astro-gold px-4 py-2 rounded-xl">
          <Text className="text-astro-bg font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tintColor = elementTints[zodiacSign.element] || Colors.gold;

  const renderRatingStars = (rating: number) => {
    return (
      <View className="flex-row" style={{ gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            color={i < rating ? Colors.gold : 'rgba(255,255,255,0.15)'}
            fill={i < rating ? Colors.gold : 'transparent'}
          />
        ))}
      </View>
    );
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

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
        >
          <ChevronLeft size={20} color={Colors.gold} />
        </TouchableOpacity>
        <Text className="text-white font-extrabold text-lg uppercase tracking-wider">
          Sign Forecast
        </Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Sign Header Hero */}
        <View className="items-center mt-6 mb-6">
          <View className="w-20 h-20 rounded-full bg-white/5 border border-white/10 items-center justify-center mb-4">
            <Text className="text-4xl">{ZodiacEmojis[zodiacSign.id]}</Text>
          </View>
          <Text className="text-white text-3xl font-black tracking-tight">{zodiacSign.name}</Text>
          <Text className="text-astro-gold font-bold text-xs mt-1 uppercase tracking-widest">{zodiacSign.dateRange}</Text>
          
          {/* Metadata badges */}
          <View className="flex-row mt-4" style={{ gap: 8 }}>
            <View className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Text style={{ color: tintColor }} className="text-[10px] font-bold uppercase tracking-wider">
                {zodiacSign.element}
              </Text>
            </View>
            <View className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Text className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                {zodiacSign.modality}
              </Text>
            </View>
            <View className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Text className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                Ruler: {zodiacSign.rulingPlanet}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Selection */}
        <View className="mx-6 mb-6 bg-white/5 border border-white/10 p-1 rounded-2xl flex-row">
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl items-center justify-center ${
                  isActive ? 'bg-astro-gold' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isActive ? 'text-astro-bg' : 'text-white/60'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Forecast Content */}
        <View className="mx-6">
          {isLoading ? (
            <View className="bg-white/5 border border-white/10 rounded-3xl p-12 items-center justify-center" style={{ height: 300 }}>
              <ActivityIndicator size="large" color={Colors.gold} />
              <Text className="text-white/60 text-xs mt-4">Aligning with the cosmic cycle...</Text>
            </View>
          ) : isError || !horoscope ? (
            <View className="bg-white/5 border border-white/10 rounded-3xl p-12 items-center justify-center" style={{ height: 300 }}>
              <Text className="text-red-400 font-bold text-center">Failed to load local forecast.</Text>
            </View>
          ) : (
            <View style={{ gap: 20 }}>
              {/* Daily Tab Content */}
              {activeTab === 'daily' && (
                <>
                  {/* Summary Card (Contrast white card) */}
                  <View className="bg-white rounded-3xl p-6 shadow-md border border-white/10">
                    <View className="flex-row justify-between items-center border-b border-black/5 pb-3 mb-4">
                      <Text className="text-astro-text font-black text-lg">Daily Summary</Text>
                      <View className="bg-astro-bg/5 px-3 py-1 rounded-full">
                        <Text className="text-astro-text font-bold text-xs">{horoscope.daily.mood}</Text>
                      </View>
                    </View>
                    <Text className="text-astro-text/80 text-sm leading-relaxed mb-4">
                      {horoscope.daily.summary}
                    </Text>

                    {/* Aspect ratings */}
                    <View className="border-t border-black/5 pt-4" style={{ gap: 12 }}>
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <Heart size={14} color="#1A103D" style={{ marginRight: 8 }} />
                          <Text className="text-astro-text font-semibold text-xs">Love & Harmony</Text>
                        </View>
                        {renderRatingStars(horoscope.daily.loveRating)}
                      </View>
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <Briefcase size={14} color="#1A103D" style={{ marginRight: 8 }} />
                          <Text className="text-astro-text font-semibold text-xs">Career & Drive</Text>
                        </View>
                        {renderRatingStars(horoscope.daily.careerRating)}
                      </View>
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <Activity size={14} color="#1A103D" style={{ marginRight: 8 }} />
                          <Text className="text-astro-text font-semibold text-xs">Health & Vitality</Text>
                        </View>
                        {renderRatingStars(horoscope.daily.healthRating)}
                      </View>
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <Coins size={14} color="#1A103D" style={{ marginRight: 8 }} />
                          <Text className="text-astro-text font-semibold text-xs">Finance & Abundance</Text>
                        </View>
                        {renderRatingStars(horoscope.daily.financeRating)}
                      </View>
                    </View>
                  </View>

                  {/* Lucky Metrics Card */}
                  <View className="bg-white/5 border border-white/10 rounded-3xl p-5 flex-row justify-between">
                    <View>
                      <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Lucky Number</Text>
                      <Text className="text-astro-gold font-extrabold text-2xl mt-1">{horoscope.daily.luckyNumber}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Lucky Time</Text>
                      <Text className="text-white font-extrabold text-lg mt-1">{horoscope.daily.luckyTime}</Text>
                    </View>
                  </View>

                  {/* Dynamic Categories Panels */}
                  <View style={{ gap: 12 }}>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Love & Social</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.daily.love}</Text>
                    </View>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Career & Business</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.daily.career}</Text>
                    </View>
                  </View>
                </>
              )}

              {/* Weekly Tab Content */}
              {activeTab === 'weekly' && (
                <>
                  {/* Date range header */}
                  <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                    <Calendar size={18} color={Colors.gold} style={{ marginRight: 12 }} />
                    <View>
                      <Text className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Weekly Cycle</Text>
                      <Text className="text-white font-bold text-sm mt-0.5">{horoscope.weekly.range}</Text>
                    </View>
                  </View>

                  {/* Summary Card (Contrast white card) */}
                  <View className="bg-white rounded-3xl p-6 shadow-md border border-white/10">
                    <Text className="text-astro-text font-black text-lg border-b border-black/5 pb-3 mb-4">Weekly Outlook</Text>
                    <Text className="text-astro-text/80 text-sm leading-relaxed">
                      {horoscope.weekly.summary}
                    </Text>
                  </View>

                  {/* Category grids */}
                  <View style={{ gap: 12 }}>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Love Forecast</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.weekly.love}</Text>
                    </View>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Career Forecast</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.weekly.career}</Text>
                    </View>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Health & Vitality</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.weekly.health}</Text>
                    </View>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Financial Outlook</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.weekly.finance}</Text>
                    </View>
                  </View>
                </>
              )}

              {/* Monthly Tab Content */}
              {activeTab === 'monthly' && (
                <>
                  {/* Month header */}
                  <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                    <Compass size={18} color={Colors.gold} style={{ marginRight: 12 }} />
                    <View>
                      <Text className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Monthly Alignment</Text>
                      <Text className="text-white font-bold text-sm mt-0.5">{horoscope.monthly.month}</Text>
                    </View>
                  </View>

                  {/* Summary Card (Contrast white card) */}
                  <View className="bg-white rounded-3xl p-6 shadow-md border border-white/10">
                    <Text className="text-astro-text font-black text-lg border-b border-black/5 pb-3 mb-4">Monthly Overview</Text>
                    <Text className="text-astro-text/80 text-sm leading-relaxed">
                      {horoscope.monthly.summary}
                    </Text>
                  </View>

                  {/* Category grids */}
                  <View style={{ gap: 12 }}>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Love Forecast</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.monthly.love}</Text>
                    </View>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Career Forecast</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.monthly.career}</Text>
                    </View>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Health & Vitality</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.monthly.health}</Text>
                    </View>
                    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest mb-1">Financial Outlook</Text>
                      <Text className="text-white/80 text-xs leading-relaxed">{horoscope.monthly.finance}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
