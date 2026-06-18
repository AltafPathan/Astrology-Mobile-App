import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getZodiacSignById } from '../../constants/ZodiacData';
import { ZodiacEmojis } from '../../components/ZodiacSelector';
import { Colors } from '../../constants/Colors';
import { X, Shield, Compass, Heart, Activity, Coins } from 'lucide-react-native';

export default function SignDetails() {
  const { sign } = useLocalSearchParams<{ sign: string }>();
  const router = useRouter();
  const zodiacSign = getZodiacSignById(sign || '');

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      {/* Header Close button */}
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5">
        <Text className="text-white font-bold text-lg">Zodiac Profile</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
        >
          <X size={20} color={Colors.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        {/* Sign Icon & Name */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-white/5 border-2 border-astro-gold items-center justify-center mb-4">
            <Text className="text-5xl">{ZodiacEmojis[zodiacSign.id]}</Text>
          </View>
          <Text className="text-white text-3xl font-extrabold">{zodiacSign.name}</Text>
          <Text className="text-astro-gold font-semibold text-sm mt-1">{zodiacSign.dateRange}</Text>
        </View>

        {/* Technical Placement Cards (Element, Modality, Ruler) */}
        <View style={{ gap: 12 }} className="flex-row mb-6">
          <View className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl items-center">
            <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Element</Text>
            <Text className="text-white font-bold text-sm mt-1">{zodiacSign.element}</Text>
          </View>
          <View className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl items-center">
            <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Modality</Text>
            <Text className="text-white font-bold text-sm mt-1">{zodiacSign.modality}</Text>
          </View>
          <View className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl items-center">
            <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Ruler</Text>
            <Text className="text-white font-bold text-sm mt-1">{zodiacSign.rulingPlanet}</Text>
          </View>
        </View>

        {/* About Sign Description (WHITE CARD) */}
        <View className="bg-white rounded-3xl p-6 mb-6">
          <Text className="text-astro-text font-black text-lg mb-3">About the Sign</Text>
          <Text className="text-astro-text/80 text-sm leading-relaxed mb-4">
            {zodiacSign.description}
          </Text>

          {/* Strengths & Weaknesses */}
          <View style={{ gap: 12 }} className="flex-row border-t border-black/5 pt-4">
            <View className="flex-1">
              <Text className="text-green-700 font-bold text-xs uppercase tracking-wider mb-2">Strengths</Text>
              {zodiacSign.strengths.map((str, idx) => (
                <Text key={idx} className="text-astro-text/80 text-xs mb-1">• {str}</Text>
              ))}
            </View>
            <View className="flex-1">
              <Text className="text-red-700 font-bold text-xs uppercase tracking-wider mb-2">Weaknesses</Text>
              {zodiacSign.weaknesses.map((weak, idx) => (
                <Text key={idx} className="text-astro-text/80 text-xs mb-1">• {weak}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Lucky Placements card */}
        <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <Text className="text-white font-bold text-base mb-3">Lucky Aspects</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-white/40 text-xs">Lucky Number</Text>
              <Text className="text-astro-gold font-bold text-lg mt-0.5">{zodiacSign.luckyNumber}</Text>
            </View>
            <View>
              <Text className="text-white/40 text-xs">Lucky Color</Text>
              <Text className="text-astro-gold font-bold text-lg mt-0.5">{zodiacSign.luckyColor}</Text>
            </View>
            <View className="items-end">
              <Text className="text-white/40 text-xs">Harmonious signs</Text>
              <Text className="text-white font-bold text-sm mt-1">{zodiacSign.compatibleSigns.join(', ')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
