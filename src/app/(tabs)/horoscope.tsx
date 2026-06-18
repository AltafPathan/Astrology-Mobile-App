import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ZodiacSigns, ZodiacSign } from '../../constants/ZodiacData';
import { ZodiacEmojis } from '../../components/ZodiacSelector';
import { Colors } from '../../constants/Colors';
import { Search, Compass, Sparkles } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Colors matching the elements
const elementColors: Record<string, { text: string; bg: string; border: string }> = {
  Fire: { text: '#FFA07A', bg: 'rgba(255, 160, 122, 0.1)', border: 'rgba(255, 160, 122, 0.2)' },
  Earth: { text: '#8FBC8F', bg: 'rgba(143, 188, 143, 0.1)', border: 'rgba(143, 188, 143, 0.2)' },
  Air: { text: '#87CEFA', bg: 'rgba(135, 206, 250, 0.1)', border: 'rgba(135, 206, 250, 0.2)' },
  Water: { text: '#6495ED', bg: 'rgba(100, 149, 237, 0.1)', border: 'rgba(100, 149, 237, 0.2)' },
};

export default function HoroscopeGrid() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter signs based on search query
  const filteredSigns = ZodiacSigns.filter((sign) =>
    sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sign.element.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSign = (signId: string) => {
    router.push(`/horoscope-detail/${signId}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgDark }}>
      {/* Background Gradient using Svg */}
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
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-astro-gold/10 items-center justify-center mr-3 border border-astro-gold/20">
            <Sparkles size={16} color={Colors.gold} />
          </View>
          <Text className="text-white text-2xl font-black uppercase tracking-wider">
            Zodiac Sanctuary
          </Text>
        </View>
        <Text className="text-astro-textMuted text-xs mt-1 pl-11">
          Select your sign to consult the cosmic movements.
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4">
        <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
          <Search size={18} color="rgba(255, 255, 255, 0.3)" style={{ marginRight: 10 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Sign or Element (e.g. Fire)..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            className="flex-1 text-white text-sm"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Grid List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {filteredSigns.map((sign) => {
            const colors = elementColors[sign.element] || { text: '#FFFFFF', bg: 'rgba(255,255,255,0.05)', border: 'transparent' };
            return (
              <TouchableOpacity
                key={sign.id}
                onPress={() => handleSelectSign(sign.id)}
                activeOpacity={0.8}
                style={[styles.gridCard]}
                className="bg-white/5 border border-white/10 rounded-3xl p-4 mb-4 items-center justify-center"
              >
                {/* Emoji Circle Container */}
                <View className="w-16 h-16 rounded-full bg-white/5 border border-white/10 items-center justify-center mb-3">
                  <Text className="text-4xl">{ZodiacEmojis[sign.id]}</Text>
                </View>

                {/* Sign Name */}
                <Text className="text-white font-black text-base tracking-tight">{sign.name}</Text>
                
                {/* Date range */}
                <Text className="text-astro-textMuted text-[10px] font-semibold mt-1">
                  {sign.dateRange}
                </Text>

                {/* Element Badge */}
                <View
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                  className="px-3 py-1 rounded-full border mt-3"
                >
                  <Text style={{ color: colors.text }} className="text-[9px] font-extrabold uppercase tracking-wider">
                    {sign.element}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {filteredSigns.length === 0 && (
          <View className="items-center justify-center py-20">
            <Text className="text-astro-textMuted text-sm text-center">No zodiac signs match your search.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    width: (width - 56) / 2, // Perfect 2-column padding calculations
    aspectRatio: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
