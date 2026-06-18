import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ZodiacSigns, ZodiacSign } from '../constants/ZodiacData';

// Map sign ids to zodiac emojis
export const ZodiacEmojis: Record<string, string> = {
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
  libra: '♎',
  scorpio: '♏',
  sagittarius: '♐',
  capricorn: '♑',
  aquarius: '♒',
  pisces: '♓',
};

interface ZodiacSelectorProps {
  selectedSignId: string;
  onSelectSign: (sign: ZodiacSign) => void;
}

export const ZodiacSelector: React.FC<ZodiacSelectorProps> = ({
  selectedSignId,
  onSelectSign,
}) => {
  return (
    <View className="py-4">
      <Text className="text-white text-base font-semibold px-6 mb-3">
        Explore Other Signs
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {ZodiacSigns.map((sign) => {
          const isSelected = sign.id === selectedSignId;
          return (
            <TouchableOpacity
              key={sign.id}
              onPress={() => onSelectSign(sign)}
              className="mr-4 items-center"
              activeOpacity={0.7}
            >
              <View
                className={`w-16 h-16 rounded-full items-center justify-center border-2 ${
                  isSelected
                    ? 'bg-astro-gold/20 border-astro-gold'
                    : 'bg-white/5 border-white/10'
                }`}
                style={{
                  shadowColor: isSelected ? '#F4C95D' : '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isSelected ? 0.3 : 0,
                  shadowRadius: 6,
                  elevation: isSelected ? 4 : 0,
                }}
              >
                <Text className="text-3xl" style={{ marginTop: -2 }}>
                  {ZodiacEmojis[sign.id]}
                </Text>
              </View>
              <Text
                className={`text-xs mt-2 font-medium ${
                  isSelected ? 'text-astro-gold font-semibold' : 'text-white/60'
                }`}
              >
                {sign.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
