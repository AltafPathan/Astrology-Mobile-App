import React from 'react';
import { Text, View } from 'react-native';
import { CompatibilityResult } from '../services/compatibility';
import { ZodiacEmojis } from './ZodiacSelector';
import { Colors } from '../constants/Colors';

interface CompatibilityMeterProps {
  result: CompatibilityResult;
}

interface ProgressBarProps {
  label: string;
  score: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, score }) => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-white/80 text-sm font-medium">{label}</Text>
        <Text className="text-astro-gold text-sm font-bold">{score}%</Text>
      </View>
      <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <View
          className="h-full bg-astro-gold rounded-full"
          style={{ width: `${score}%` }}
        />
      </View>
    </View>
  );
};

export const CompatibilityMeter: React.FC<CompatibilityMeterProps> = ({ result }) => {
  return (
    <View className="w-full">
      {/* Visual Match Header */}
      <View style={{ gap: 24 }} className="flex-row items-center justify-center py-6">
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-white/5 border border-white/10 items-center justify-center">
            <Text className="text-4xl">{ZodiacEmojis[result.signA.id]}</Text>
          </View>
          <Text className="text-white font-semibold mt-2 text-sm">{result.signA.name}</Text>
          <Text className="text-white/40 text-xs">{result.signA.element}</Text>
        </View>

        <View className="items-center justify-center">
          <View className="bg-astro-gold/15 px-3 py-1.5 rounded-full border border-astro-gold/30">
            <Text className="text-astro-gold font-bold text-lg">{result.overallScore}%</Text>
          </View>
          <Text className="text-astro-gold text-xs font-semibold mt-1">Match</Text>
        </View>

        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-white/5 border border-white/10 items-center justify-center">
            <Text className="text-4xl">{ZodiacEmojis[result.signB.id]}</Text>
          </View>
          <Text className="text-white font-semibold mt-2 text-sm">{result.signB.name}</Text>
          <Text className="text-white/40 text-xs">{result.signB.element}</Text>
        </View>
      </View>

      {/* White Summary Card */}
      <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-white/15">
        <Text className="text-astro-text font-bold text-base mb-2">Cosmic Synergy</Text>
        <Text className="text-astro-text/80 text-sm leading-relaxed">{result.summary}</Text>
      </View>

      {/* Progress Bars for aspects */}
      <View className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <Text className="text-white font-bold text-base mb-4">Detailed Aspects</Text>
        <ProgressBar label="Love & Chemistry" score={result.loveScore} />
        <ProgressBar label="Friendship & Trust" score={result.friendshipScore} />
        <ProgressBar label="Career & Collaboration" score={result.careerScore} />
      </View>
    </View>
  );
};
