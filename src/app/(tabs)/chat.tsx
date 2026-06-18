import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import astrologersData from '../../constants/astrologers.json';
import { Colors } from '../../constants/Colors';
import { Search, Star, MessageSquare, ShieldAlert, Sparkles, Filter } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

export interface Astrologer {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  experience: number;
  languages: string[];
  expertise: string[];
  ratePerMinute: number;
  photoUrl: string;
  isOnline: boolean;
  bio: string;
}

const expertiseCategories = ["All", "Vedic", "Tarot", "Numerology", "Palmistry", "Vastu"];
const experienceFilters = ["All", "5+ Years", "10+ Years"];

export default function AstrologerListing() {
  const router = useRouter();
  const astrologers = astrologersData as Astrologer[];

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');

  // Intersect filters
  const filteredAstrologers = astrologers.filter((astrologer) => {
    // 1. Search Query
    const matchesSearch =
      astrologer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      astrologer.languages.some(lang => lang.toLowerCase().includes(searchQuery.toLowerCase())) ||
      astrologer.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Expertise
    const matchesExpertise =
      selectedExpertise === 'All' ||
      astrologer.expertise.some(exp => exp.toLowerCase() === selectedExpertise.toLowerCase());

    // 3. Experience
    let matchesExperience = true;
    if (selectedExperience === '5+ Years') {
      matchesExperience = astrologer.experience >= 5;
    } else if (selectedExperience === '10+ Years') {
      matchesExperience = astrologer.experience >= 10;
    }

    return matchesSearch && matchesExpertise && matchesExperience;
  });

  const handleStartChat = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const handleViewProfile = (id: string) => {
    router.push(`/astrologer/${id}`);
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
            <MessageSquare size={16} color={Colors.gold} />
          </View>
          <Text className="text-white text-2xl font-black uppercase tracking-wider">
            Cosmic Guides
          </Text>
        </View>
        <Text className="text-astro-textMuted text-xs mt-1 pl-11">
          Chat with certified astrologers and tarot experts.
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
          <Search size={18} color="rgba(255, 255, 255, 0.3)" style={{ marginRight: 10 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, language, or expertise..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            className="flex-1 text-white text-sm"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Horizontal Category Filters */}
      <View className="mt-2 mb-1">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
        >
          {expertiseCategories.map((category) => {
            const isActive = selectedExpertise === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedExpertise(category)}
                className={`px-4 py-2 rounded-xl border ${
                  isActive
                    ? 'bg-astro-gold border-astro-gold'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isActive ? 'text-astro-bg' : 'text-white/60'
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Horizontal Experience Filters */}
      <View className="mb-4 mt-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8, alignItems: 'center' }}
        >
          <Filter size={12} color={Colors.gold} style={{ marginRight: 4 }} />
          <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider mr-2">Experience:</Text>
          {experienceFilters.map((filter) => {
            const isActive = selectedExperience === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedExperience(filter)}
                className={`px-3 py-1.5 rounded-lg border ${
                  isActive
                    ? 'bg-astro-gold/25 border-astro-gold/40'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    isActive ? 'text-astro-gold' : 'text-white/50'
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Astrologers List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      >
        {filteredAstrologers.map((astrologer) => (
          <View
            key={astrologer.id}
            style={styles.cardContainer}
            className="bg-white/5 border border-white/10 rounded-3xl p-4 mb-4"
          >
            {/* Card Info Details */}
            <View className="flex-row items-start mb-4">
              {/* Profile Image with Online status */}
              <View className="relative">
                <Image
                  source={{ uri: astrologer.photoUrl }}
                  style={styles.avatar}
                  className="rounded-full bg-white/5 border border-white/10"
                />
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: astrologer.isOnline ? '#4CAF50' : '#9E9E9E' }
                  ]}
                />
              </View>

              {/* Text Info */}
              <View className="flex-1 ml-4" style={{ gap: 4 }}>
                <View className="flex-row justify-between items-center">
                  <Text className="text-white font-extrabold text-base tracking-tight">
                    {astrologer.name}
                  </Text>
                  {/* Rating row */}
                  <View className="flex-row items-center bg-astro-gold/10 px-2 py-0.5 rounded-md border border-astro-gold/25">
                    <Star size={10} color={Colors.gold} fill={Colors.gold} style={{ marginRight: 3 }} />
                    <Text className="text-astro-gold font-bold text-[10px]">{astrologer.rating}</Text>
                  </View>
                </View>

                <Text className="text-astro-gold text-xs font-semibold">
                  {astrologer.experience} Years Experience
                </Text>

                <Text className="text-white/60 text-[11px] leading-relaxed">
                  Languages: {astrologer.languages.join(', ')}
                </Text>

                {/* Specialties tags row */}
                <View className="flex-row flex-wrap mt-1" style={{ gap: 6 }}>
                  {astrologer.expertise.map((exp, idx) => (
                    <View
                      key={idx}
                      className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                    >
                      <Text className="text-white/60 text-[9px] font-bold uppercase tracking-wider">
                        {exp}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Bottom Actions Row */}
            <View className="flex-row border-t border-white/5 pt-3" style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={() => handleViewProfile(astrologer.id)}
                className="flex-1 border border-astro-gold/30 rounded-xl py-2.5 items-center"
              >
                <Text className="text-astro-gold font-bold text-xs uppercase tracking-widest">
                  View Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleStartChat(astrologer.id)}
                className="flex-1 bg-astro-gold rounded-xl py-2.5 items-center flex-row justify-center"
                style={styles.chatButtonShadow}
              >
                <MessageSquare size={12} color={Colors.bg} style={{ marginRight: 6 }} />
                <Text className="text-astro-bg font-extrabold text-xs uppercase tracking-widest">
                  Start Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredAstrologers.length === 0 && (
          <View className="items-center justify-center py-20">
            <Text className="text-astro-textMuted text-sm text-center">No certified astrologers found matching the criteria.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  avatar: {
    width: 64,
    height: 64,
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#120B2C', // Deep midnight background match
  },
  chatButtonShadow: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
