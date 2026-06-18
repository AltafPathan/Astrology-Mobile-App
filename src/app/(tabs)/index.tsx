import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useUser } from '../../hooks/useUser';
import { useHoroscope } from '../../hooks/useHoroscope';
import { ZodiacSelector, ZodiacEmojis } from '../../components/ZodiacSelector';
import { HoroscopeMetrics } from '../../components/HoroscopeMetric';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { RefreshCw, LogOut, Compass, BookOpen, Heart, Layers, ChevronRight } from 'lucide-react-native';
import { getZodiacSignById } from '../../constants/ZodiacData';
import { Image } from 'expo-image';
import blogsData from '../../constants/blogs.json';

export default function Dashboard() {
  const { profile, clearProfile } = useUser();
  const router = useRouter();

  // Selected sign defaults to user's Sun Sign once loaded
  const [selectedSignId, setSelectedSignId] = useState<string>('');

  useEffect(() => {
    if (profile?.sunSign.id) {
      setSelectedSignId(profile.sunSign.id);
    }
  }, [profile]);

  const { data: horoscope, isLoading, isError, refetch } = useHoroscope(selectedSignId);

  const selectedSign = getZodiacSignById(selectedSignId);

  const handleSignChange = (sign: { id: string }) => {
    setSelectedSignId(sign.id);
  };

  const handleViewDetails = () => {
    if (selectedSignId) {
      router.push(`/details/${selectedSignId}`);
    }
  };

  if (!profile || !selectedSignId) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgDark }}>
      {/* Premium Header */}
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5">
        <View>
          <Text className="text-white/60 text-xs">Welcome back,</Text>
          <Text className="text-white text-xl font-bold">{profile.name}</Text>
        </View>
        
        <View style={{ gap: 12 }} className="flex-row">
          <TouchableOpacity
            onPress={() => refetch()}
            className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
          >
            <RefreshCw size={16} color={Colors.gold} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => clearProfile()}
            className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
          >
            <LogOut size={16} color="#FF5A5A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !!horoscope}
            onRefresh={refetch}
            tintColor={Colors.gold}
          />
        }
      >
        {/* User Sun/Moon/Rising Placements bar */}
        <View className="mx-6 mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Sun</Text>
            <Text className="text-lg my-0.5">{ZodiacEmojis[profile.sunSign.id]}</Text>
            <Text className="text-white font-medium text-xs">{profile.sunSign.name}</Text>
          </View>
          <View className="w-[1px] bg-white/10 h-full" />
          <View className="items-center flex-1">
            <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Moon</Text>
            <Text className="text-lg my-0.5">{ZodiacEmojis[profile.moonSign.id]}</Text>
            <Text className="text-white font-medium text-xs">{profile.moonSign.name}</Text>
          </View>
          <View className="w-[1px] bg-white/10 h-full" />
          <View className="items-center flex-1">
            <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Rising</Text>
            <Text className="text-lg my-0.5">{ZodiacEmojis[profile.risingSign.id]}</Text>
            <Text className="text-white font-medium text-xs">{profile.risingSign.name}</Text>
          </View>
        </View>

        {/* Current Date Display */}
        <View className="px-6 mt-6">
          <Text className="text-astro-gold text-xs font-bold uppercase tracking-widest">
            Today's Forecast
          </Text>
          <Text className="text-white text-2xl font-extrabold mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Forecast Card (WHITE CARD on dark bg) */}
        <View className="mx-6 mt-4">
          {isLoading ? (
            <View className="bg-white rounded-3xl p-8 items-center justify-center border border-white/10" style={{ height: 260 }}>
              <ActivityIndicator size="large" color={Colors.bg} />
              <Text className="text-astro-text/60 text-xs mt-3">Consulting the alignment...</Text>
            </View>
          ) : isError ? (
            <View className="bg-white rounded-3xl p-8 items-center justify-center border border-white/10" style={{ height: 260 }}>
              <Text className="text-red-500 font-bold text-center">Failed to load horoscope.</Text>
              <TouchableOpacity onPress={() => refetch()} className="bg-astro-bg px-4 py-2 rounded-xl mt-4">
                <Text className="text-white font-semibold text-xs">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : horoscope ? (
            <TouchableOpacity
              onPress={handleViewDetails}
              activeOpacity={0.95}
              className="bg-white rounded-3xl p-6 shadow-md border border-white/10"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
              }}
            >
              {/* Card Header */}
              <View className="flex-row justify-between items-center border-b border-black/5 pb-4 mb-4">
                <View style={{ gap: 12 }} className="flex-row items-center">
                  <Text className="text-4xl">{ZodiacEmojis[selectedSignId]}</Text>
                  <View>
                    <Text className="text-astro-text font-black text-xl">{selectedSign?.name}</Text>
                    <Text className="text-astro-text/50 text-xs">{selectedSign?.dateRange}</Text>
                  </View>
                </View>
                <View className="bg-astro-bg/5 px-3 py-1 rounded-full">
                  <Text className="text-astro-text font-bold text-xs">{horoscope.mood}</Text>
                </View>
              </View>

              {/* Card Forecast Body */}
              <Text className="text-astro-text/80 text-sm leading-relaxed mb-4">
                {horoscope.summary}
              </Text>

              {/* Card Metadata Footer */}
              <View className="flex-row justify-between border-t border-black/5 pt-4">
                <View>
                  <Text className="text-astro-text/40 text-[10px] uppercase font-bold tracking-wider">Lucky Time</Text>
                  <Text className="text-astro-text font-bold text-sm mt-0.5">{horoscope.luckyTime}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-astro-text/40 text-[10px] uppercase font-bold tracking-wider">Lucky No.</Text>
                  <Text className="text-astro-text font-bold text-sm mt-0.5">{horoscope.luckyNumber}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-astro-text/40 text-[10px] uppercase font-bold tracking-wider">Tap to View</Text>
                  <View className="flex-row items-center mt-0.5">
                    <Compass size={12} color={Colors.bg} style={{ marginRight: 3 }} />
                    <Text className="text-astro-text font-bold text-xs">Details</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Aspects Ratings */}
        {horoscope && !isLoading && (
          <View className="px-6 mt-2">
            <HoroscopeMetrics
              love={horoscope.loveRating}
              career={horoscope.careerRating}
              health={horoscope.healthRating}
              finance={horoscope.financeRating}
            />
          </View>
        )}

        {/* Services Grid */}
        <View className="px-6 mt-6">
          <Text className="text-astro-gold text-xs font-bold uppercase tracking-widest mb-3">
            Cosmic Services
          </Text>
          <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
            {/* 1. Daily Horoscope */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/horoscope')}
              className="w-1/2 p-1.5"
              activeOpacity={0.8}
            >
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-astro-gold/10 items-center justify-center mr-3 border border-astro-gold/20">
                  <BookOpen size={18} color={Colors.gold} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-xs tracking-tight">Horoscope</Text>
                  <Text className="text-white/40 text-[9px] uppercase font-bold tracking-wider mt-0.5">Daily Forecast</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* 2. Kundli Generator */}
            <TouchableOpacity
              onPress={() => router.push('/kundli')}
              className="w-1/2 p-1.5"
              activeOpacity={0.8}
            >
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-astro-gold/10 items-center justify-center mr-3 border border-astro-gold/20">
                  <Compass size={18} color={Colors.gold} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-xs tracking-tight">Kundli</Text>
                  <Text className="text-white/40 text-[9px] uppercase font-bold tracking-wider mt-0.5">Birth Chart</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* 3. Match Making */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/compatibility')}
              className="w-1/2 p-1.5"
              activeOpacity={0.8}
            >
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-astro-gold/10 items-center justify-center mr-3 border border-astro-gold/20">
                  <Heart size={18} color={Colors.gold} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-xs tracking-tight">Match Making</Text>
                  <Text className="text-white/40 text-[9px] uppercase font-bold tracking-wider mt-0.5">Compatibility</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* 4. Tarot Reading */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/tarot')}
              className="w-1/2 p-1.5"
              activeOpacity={0.8}
            >
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-astro-gold/10 items-center justify-center mr-3 border border-astro-gold/20">
                  <Layers size={18} color={Colors.gold} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-xs tracking-tight">Tarot Reading</Text>
                  <Text className="text-white/40 text-[9px] uppercase font-bold tracking-wider mt-0.5">Card Spread</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scroll Selector */}
        <ZodiacSelector
          selectedSignId={selectedSignId}
          onSelectSign={handleSignChange}
        />

        {/* Trending Blogs Section */}
        <View className="px-6 mt-6 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white font-extrabold text-base uppercase tracking-wider">
              Trending Insights
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/blog')}
              className="flex-row items-center"
            >
              <Text className="text-astro-gold text-xs font-bold mr-1">View All</Text>
              <ChevronRight size={14} color={Colors.gold} />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {blogsData.slice(0, 3).map((blog) => (
              <TouchableOpacity
                key={blog.id}
                onPress={() => router.push(`/blog/${blog.id}`)}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                style={{ width: 200, height: 190 }}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: blog.imageUrl }}
                  style={{ width: '100%', height: 100 }}
                  className="bg-white/5"
                />
                <View className="p-3 justify-between flex-1">
                  <Text className="text-white font-bold text-xs" numberOfLines={2}>
                    {blog.title}
                  </Text>
                  <View className="flex-row justify-between items-center mt-1 border-t border-white/5 pt-1.5">
                    <Text className="text-astro-gold text-[8px] uppercase font-extrabold tracking-wider">
                      {blog.category}
                    </Text>
                    <Text className="text-white/40 text-[9px]">
                      {blog.readTime}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
