import React from 'react';
import { Text, View } from 'react-native';
import { Star, Heart, Briefcase, Activity, Coins } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

interface MetricRowProps {
  label: string;
  rating: number;
  type: 'love' | 'career' | 'health' | 'finance';
}

const getIcon = (type: string, color: string, size: number) => {
  switch (type) {
    case 'love':
      return <Heart size={size} color={color} fill={color} />;
    case 'career':
      return <Briefcase size={size} color={color} fill={color} />;
    case 'health':
      return <Activity size={size} color={color} />;
    case 'finance':
      return <Coins size={size} color={color} fill={color} />;
    default:
      return <Star size={size} color={color} fill={color} />;
  }
};

const MetricRow: React.FC<MetricRowProps> = ({ label, rating, type }) => {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-black/5">
      <View style={{ gap: 12 }} className="flex-row items-center">
        {/* Lucide Icon with styling */}
        <View className="w-8 h-8 rounded-full bg-astro-bg/5 items-center justify-center">
          {getIcon(type, '#1A103D', 16)}
        </View>
        <Text className="text-astro-text font-medium text-sm">{label}</Text>
      </View>
      <View style={{ gap: 4 }} className="flex-row">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            color={i < rating ? Colors.goldDark : '#E2E0EC'}
            fill={i < rating ? Colors.goldDark : 'transparent'}
          />
        ))}
      </View>
    </View>
  );
};

interface HoroscopeMetricsProps {
  love: number;
  career: number;
  health: number;
  finance: number;
}

export const HoroscopeMetrics: React.FC<HoroscopeMetricsProps> = ({
  love,
  career,
  health,
  finance,
}) => {
  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm border border-white/10 mt-4">
      <Text className="text-astro-text font-bold text-base mb-2">Daily Aspects</Text>
      <MetricRow label="Love & Relationships" rating={love} type="love" />
      <MetricRow label="Career & Ambition" rating={career} type="career" />
      <MetricRow label="Health & Energy" rating={health} type="health" />
      <MetricRow label="Finance & Prosperity" rating={finance} type="finance" />
    </View>
  );
};
