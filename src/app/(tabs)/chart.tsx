import React from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useUser } from '../../hooks/useUser';
import { Colors } from '../../constants/Colors';
import { ZodiacEmojis } from '../../components/ZodiacSelector';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { ZodiacSigns } from '../../constants/ZodiacData';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width - 48, 300);
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 20;

export default function NatalChart() {
  const { profile } = useUser();

  if (!profile) return null;

  // Find sign indices (0-11)
  const sunIdx = ZodiacSigns.findIndex(s => s.id === profile.sunSign.id);
  const moonIdx = ZodiacSigns.findIndex(s => s.id === profile.moonSign.id);
  const risingIdx = ZodiacSigns.findIndex(s => s.id === profile.risingSign.id);

  // Compute placement coordinates for the SVG wheel
  const getCoordinates = (index: number, r: number) => {
    // 12 signs on wheel. Offset by 90 degrees so 0 index starts at top
    const angle = (index * 30 - 90 + 15) * (Math.PI / 180);
    const x = CENTER + r * Math.cos(angle);
    const y = CENTER + r * Math.sin(angle);
    return { x, y };
  };

  const sunCoords = getCoordinates(sunIdx, RADIUS - 25);
  const moonCoords = getCoordinates(moonIdx, RADIUS - 25);
  const risingCoords = getCoordinates(risingIdx, RADIUS - 25);

  // Elemental calculations
  // Count how many placements fall into Fire, Earth, Air, Water
  const elements = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  elements[profile.sunSign.element]++;
  elements[profile.moonSign.element]++;
  elements[profile.risingSign.element]++;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgDark }}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-white/5">
        <Text className="text-white text-xl font-bold">Your Natal Chart</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        {/* SVG Zodiac Placements Wheel */}
        <View className="items-center mb-8">
          <View
            className="p-4 bg-white/5 rounded-3xl border border-white/10"
            style={{ width: WHEEL_SIZE + 32, height: WHEEL_SIZE + 32, alignItems: 'center', justifyContent: 'center' }}
          >
            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
              <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke={Colors.gold} strokeWidth="1" fill="transparent" opacity="0.3" />
              <Circle cx={CENTER} cy={CENTER} r={RADIUS - 40} stroke={Colors.gold} strokeWidth="1" strokeDasharray="3, 3" fill="transparent" opacity="0.15" />
              <Circle cx={CENTER} cy={CENTER} r={6} fill={Colors.gold} />

              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x1 = CENTER + RADIUS * Math.cos(angle);
                const y1 = CENTER + RADIUS * Math.sin(angle);
                const x2 = CENTER - RADIUS * Math.cos(angle);
                const y2 = CENTER - RADIUS * Math.sin(angle);
                return (
                  <Line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(244, 201, 93, 0.15)"
                    strokeWidth="0.8"
                  />
                );
              })}

              <G>
                <Line x1={CENTER} y1={CENTER} x2={sunCoords.x} y2={sunCoords.y} stroke={Colors.gold} strokeWidth="1" opacity="0.5" />
                <Circle cx={sunCoords.x} cy={sunCoords.y} r={14} fill={Colors.bg} stroke={Colors.gold} strokeWidth="1.5" />
                <SvgText x={sunCoords.x} y={sunCoords.y + 4} fontSize="11" textAnchor="middle" fill={Colors.gold}>☀️</SvgText>
              </G>

              <G>
                <Line x1={CENTER} y1={CENTER} x2={moonCoords.x} y2={moonCoords.y} stroke={Colors.gold} strokeWidth="1" opacity="0.5" />
                <Circle cx={moonCoords.x} cy={moonCoords.y} r={14} fill={Colors.bg} stroke={Colors.gold} strokeWidth="1.5" />
                <SvgText x={moonCoords.x} y={moonCoords.y + 4} fontSize="11" textAnchor="middle" fill={Colors.gold}>🌙</SvgText>
              </G>

              <G>
                <Line x1={CENTER} y1={CENTER} x2={risingCoords.x} y2={risingCoords.y} stroke={Colors.gold} strokeWidth="1" opacity="0.5" />
                <Circle cx={risingCoords.x} cy={risingCoords.y} r={14} fill={Colors.bg} stroke={Colors.gold} strokeWidth="1.5" />
                <SvgText x={risingCoords.x} y={risingCoords.y + 4} fontSize="11" textAnchor="middle" fill={Colors.gold}>↗️</SvgText>
              </G>
            </Svg>
          </View>
          <Text className="text-white/40 text-xs mt-3">Visual map of your core alignments</Text>
        </View>

        {/* placements details lists */}
        <View style={{ gap: 12 }} className="mb-6">
          <Text className="text-white font-bold text-base">Key Placements</Text>
          
          {/* Sun Sign info */}
          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-white/10">
            <View style={{ gap: 12 }} className="flex-row items-center">
              <Text className="text-3xl">{ZodiacEmojis[profile.sunSign.id]}</Text>
              <View>
                <Text className="text-astro-text font-black text-sm">Sun in {profile.sunSign.name}</Text>
                <Text className="text-astro-text/50 text-xs">Core identity, ego, life force</Text>
              </View>
            </View>
            <View className="bg-astro-bg/5 px-3 py-1 rounded-full">
              <Text className="text-astro-text font-bold text-xs">{profile.sunSign.element}</Text>
            </View>
          </View>

          {/* Moon Sign info */}
          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-white/10">
            <View style={{ gap: 12 }} className="flex-row items-center">
              <Text className="text-3xl">{ZodiacEmojis[profile.moonSign.id]}</Text>
              <View>
                <Text className="text-astro-text font-black text-sm">Moon in {profile.moonSign.name}</Text>
                <Text className="text-astro-text/50 text-xs">Emotional landscape, subconscious</Text>
              </View>
            </View>
            <View className="bg-astro-bg/5 px-3 py-1 rounded-full">
              <Text className="text-astro-text font-bold text-xs">{profile.moonSign.element}</Text>
            </View>
          </View>

          {/* Rising Sign info */}
          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-white/10">
            <View style={{ gap: 12 }} className="flex-row items-center">
              <Text className="text-3xl">{ZodiacEmojis[profile.risingSign.id]}</Text>
              <View>
                <Text className="text-astro-text font-black text-sm">Rising in {profile.risingSign.name}</Text>
                <Text className="text-astro-text/50 text-xs">Outer persona, first impression</Text>
              </View>
            </View>
            <View className="bg-astro-bg/5 px-3 py-1 rounded-full">
              <Text className="text-astro-text font-bold text-xs">{profile.risingSign.element}</Text>
            </View>
          </View>
        </View>

        {/* Elemental Balance list */}
        <View className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <Text className="text-white font-bold text-base mb-4">Elemental Balance</Text>
          {Object.entries(elements).map(([element, count]) => {
            const percentage = Math.round((count / 3) * 100);
            return (
              <View key={element} className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-white/80 text-xs font-semibold">{element}</Text>
                  <Text className="text-astro-gold text-xs font-bold">{percentage}%</Text>
                </View>
                <View className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-astro-gold rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
