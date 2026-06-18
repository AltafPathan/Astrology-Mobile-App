import React, { useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePremiumModal } from '../../components/PremiumModal';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import astrologersData from '../../constants/astrologers.json';
import { Colors } from '../../constants/Colors';
import { X, Star, MessageSquare, Briefcase, Award, Languages, DollarSign, Calendar, ChevronLeft } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface Astrologer {
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

interface Review {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  comment: string;
}

// Mock reviews database mapped by astrologer ID
const mockReviews: Record<string, Review[]> = {
  "1": [
    { id: "101", name: "Priya Sharma", initials: "PS", rating: 5, date: "June 15, 2026", comment: "Acharya Shreya is highly recommended! Her prediction about my career shift was spot on and occurred exactly when she forecast." },
    { id: "102", name: "Rahul Verma", initials: "RV", rating: 4, date: "May 28, 2026", comment: "Very calm and reassuring reader. She explained the planetary transit effects clearly and suggested simple daily remedies." }
  ],
  "2": [
    { id: "201", name: "Amit Patel", initials: "AP", rating: 5, date: "June 12, 2026", comment: "Exceptional knowledge in Vastu science! Dr. Aditya suggested minor modifications to our office entrance and we saw results within a month." },
    { id: "202", name: "Sneha Reddy", initials: "SR", rating: 5, date: "June 03, 2026", comment: "Very detailed analysis of my natal chart. Spent time explaining elements and houses. Highly professional." }
  ],
  "3": [
    { id: "301", name: "David Miller", initials: "DM", rating: 5, date: "June 14, 2026", comment: "The tarot reading was so accurate it gave me goosebumps! She tapped into my current relationship state instantly." },
    { id: "302", name: "Maria Gonzalez", initials: "MG", rating: 4, date: "May 20, 2026", comment: "A deeply empathetic and kind soul. Her healing aura makes it very easy to discuss private struggles." }
  ],
  "4": [
    { id: "401", name: "Jignesh Patel", initials: "JP", rating: 5, date: "June 08, 2026", comment: "Perfect timing calculation for my new business launch! Rohan शास्त्री guided us with absolute precision." },
    { id: "402", name: "Anjali Mehta", initials: "AM", rating: 4, date: "May 15, 2026", comment: "Excellent gemstone recommendation. I feel much more grounded and focused since wearing the ruby." }
  ],
  "5": [
    { id: "501", name: "Sophie Dubois", initials: "SD", rating: 5, date: "June 16, 2026", comment: "Elena is a master of dream interpretation. She connected my recurring dreams to my current career transitions perfectly." },
    { id: "502", name: "Marc K.", initials: "MK", rating: 5, date: "June 10, 2026", comment: "A beautiful fusion of Western astrology and Tarot cards. Elena is fast, highly accurate, and incredibly articulate." }
  ]
};

export default function AstrologerDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showConfirm } = usePremiumModal();
  
  const astrologer = (astrologersData as Astrologer[]).find((a) => a.id === id);

  // Animations shared values
  const heroScale = useSharedValue(0.9);
  const heroOpacity = useSharedValue(0);

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);

  const aboutOpacity = useSharedValue(0);
  const aboutTranslateY = useSharedValue(20);

  const reviewsOpacity = useSharedValue(0);
  const reviewsTranslateY = useSharedValue(20);

  const footerOpacity = useSharedValue(0);
  const footerTranslateY = useSharedValue(30);

  useEffect(() => {
    // Sequence the entry transitions for premium feel
    heroScale.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 1, 0.5, 1) });
    heroOpacity.value = withTiming(1, { duration: 600 });

    headerOpacity.value = withDelay(150, withTiming(1, { duration: 600 }));
    headerTranslateY.value = withDelay(150, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));

    aboutOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    aboutTranslateY.value = withDelay(300, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));

    reviewsOpacity.value = withDelay(450, withTiming(1, { duration: 600 }));
    reviewsTranslateY.value = withDelay(450, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));

    footerOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    footerTranslateY.value = withDelay(600, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
  }, []);

  if (!astrologer) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-white text-lg">Astrologer not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-astro-gold px-4 py-2 rounded-xl">
          <Text className="text-astro-bg font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const reviews = mockReviews[astrologer.id] || [];

  const handleStartChat = () => {
    router.push(`/chat/${astrologer.id}`);
  };

  const handleBookAppointment = () => {
    showConfirm(
      'Book Appointment',
      `Schedule a detailed 30-minute private call consultation with ${astrologer.name} for ₹${astrologer.ratePerMinute * 30}?`,
      () => {
        showSuccess(
          'Booking Requested',
          `An appointment request has been sent to ${astrologer.name}. We will notify you once they confirm.`
        );
      },
      undefined,
      'Schedule Call',
      'Cancel'
    );
  };

  // Reanimated animated styles
  const animatedHeroStyle = useAnimatedStyle(() => {
    return {
      opacity: heroOpacity.value,
      transform: [{ scale: heroScale.value }],
    };
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const animatedAboutStyle = useAnimatedStyle(() => {
    return {
      opacity: aboutOpacity.value,
      transform: [{ translateY: aboutTranslateY.value }],
    };
  });

  const animatedReviewsStyle = useAnimatedStyle(() => {
    return {
      opacity: reviewsOpacity.value,
      transform: [{ translateY: reviewsTranslateY.value }],
    };
  });

  const animatedFooterStyle = useAnimatedStyle(() => {
    return {
      opacity: footerOpacity.value,
      transform: [{ translateY: footerTranslateY.value }],
    };
  });

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

      {/* Header Bar */}
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5 z-20">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
        >
          <ChevronLeft size={20} color={Colors.gold} />
        </TouchableOpacity>
        <Text className="text-white font-extrabold text-sm uppercase tracking-widest">
          Consultation Guide
        </Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Layered Hero Banner */}
        <Animated.View style={[styles.heroBannerContainer, animatedHeroStyle]}>
          <Svg width="100%" height={160} viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <RadialGradient id="bannerGrad" cx="50%" cy="50%" rx="60%" ry="60%">
                <Stop offset="0%" stopColor="#3C2A7E" stopOpacity="1" />
                <Stop offset="100%" stopColor="#1A103D" stopOpacity="0.8" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#bannerGrad)" />
            <Circle cx="20" cy="30" r="0.5" fill="#FFFFFF" opacity="0.6" />
            <Circle cx="80" cy="40" r="0.8" fill="#FFFFFF" opacity="0.8" />
            <Circle cx="45" cy="20" r="0.3" fill="#FFFFFF" opacity="0.5" />
            <Circle cx="70" cy="70" r="0.6" fill={Colors.gold} opacity="0.5" />
            
            <Path d="M 20 30 L 30 50 L 45 20" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" fill="none" />
            <Path d="M 80 40 L 70 70 L 90 60" stroke="rgba(244,201,93,0.15)" strokeWidth="0.3" fill="none" />
          </Svg>
        </Animated.View>

        {/* Profile Card Hero Overlap */}
        <Animated.View style={[styles.headerCard, animatedHeaderStyle]} className="bg-white/5 border border-white/10 rounded-3xl mx-6 p-6 mb-6 items-center">
          {/* Circular avatar positioning */}
          <View style={styles.avatarWrapper} className="relative">
            <Image
              source={{ uri: astrologer.photoUrl }}
              style={styles.largeAvatar}
              className="rounded-full bg-white/5 border-2 border-astro-gold"
            />
            <View
              style={[
                styles.largeStatusDot,
                { backgroundColor: astrologer.isOnline ? '#4CAF50' : '#9E9E9E' }
              ]}
            />
          </View>

          <Text className="text-white text-3xl font-black tracking-tight mt-2">
            {astrologer.name}
          </Text>

          {/* Specialization tags */}
          <View className="flex-row flex-wrap justify-center mt-3" style={{ gap: 6 }}>
            {astrologer.expertise.map((exp, idx) => (
              <View
                key={idx}
                className="bg-astro-gold/15 border border-astro-gold/25 px-3 py-1 rounded-full"
              >
                <Text className="text-astro-gold text-[9px] font-extrabold uppercase tracking-wider">
                  {exp}
                </Text>
              </View>
            ))}
          </View>

          {/* Quick Stats Grid */}
          <View style={{ gap: 12 }} className="flex-row mt-6 border-t border-white/5 pt-5 w-full">
            <View className="flex-1 items-center">
              <Briefcase size={16} color={Colors.gold} />
              <Text className="text-white font-extrabold text-xs mt-1.5">{astrologer.experience} Years</Text>
              <Text className="text-white/40 text-[8px] uppercase font-bold tracking-wider mt-0.5">Experience</Text>
            </View>
            <View className="w-[1px] bg-white/10 h-8" />
            <View className="flex-1 items-center">
              <Star size={16} color={Colors.gold} fill={Colors.gold} />
              <Text className="text-white font-extrabold text-xs mt-1.5">{astrologer.rating}</Text>
              <Text className="text-white/40 text-[8px] uppercase font-bold tracking-wider mt-0.5">Rating</Text>
            </View>
            <View className="w-[1px] bg-white/10 h-8" />
            <View className="flex-1 items-center">
              <Languages size={16} color={Colors.gold} />
              <Text className="text-white font-extrabold text-[10px] mt-1.5 text-center" numberOfLines={1} style={{ maxWidth: 70 }}>
                {astrologer.languages[0]}
              </Text>
              <Text className="text-white/40 text-[8px] uppercase font-bold tracking-wider mt-0.5">Language</Text>
            </View>
          </View>
        </Animated.View>

        {/* About Bio Section (Contrast White Card) */}
        <Animated.View style={[animatedAboutStyle]} className="mx-6 mb-6">
          <View className="bg-white rounded-3xl p-6 shadow-md border border-white/10">
            <Text className="text-astro-text font-black text-lg mb-3">About Expert</Text>
            <Text className="text-astro-text/80 text-sm leading-relaxed mb-4">
              {astrologer.bio}
            </Text>

            {/* Specialties and Languages */}
            <View className="border-t border-black/5 pt-4" style={{ gap: 12 }}>
              <View className="flex-row items-center">
                <Languages size={16} color="#1A103D" style={{ marginRight: 12 }} />
                <View className="flex-1">
                  <Text className="text-astro-text font-bold text-xs uppercase tracking-wider">Fluent Languages</Text>
                  <Text className="text-astro-text/60 text-xs mt-0.5">{astrologer.languages.join(', ')}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Customer Reviews Section */}
        <Animated.View style={[animatedReviewsStyle]} className="mx-6">
          <View className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <View className="flex-row justify-between items-center mb-4 border-b border-white/5 pb-3">
              <Text className="text-white font-extrabold text-base uppercase tracking-wider">
                User Reviews ({astrologer.reviewCount})
              </Text>
              <View className="flex-row items-center">
                <Star size={12} color={Colors.gold} fill={Colors.gold} style={{ marginRight: 4 }} />
                <Text className="text-astro-gold font-bold text-xs">{astrologer.rating}</Text>
              </View>
            </View>

            {reviews.map((review) => (
              <View key={review.id} className="mb-4 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    {/* User Initials Circle */}
                    <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center mr-3 border border-white/15">
                      <Text className="text-white font-bold text-xs">{review.initials}</Text>
                    </View>
                    <View>
                      <Text className="text-white font-bold text-xs">{review.name}</Text>
                      <Text className="text-white/40 text-[9px] mt-0.5">{review.date}</Text>
                    </View>
                  </View>
                  
                  {/* Rating stars */}
                  <View className="flex-row" style={{ gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={10}
                        color={idx < review.rating ? Colors.gold : 'rgba(255,255,255,0.1)'}
                        fill={idx < review.rating ? Colors.gold : 'transparent'}
                      />
                    ))}
                  </View>
                </View>
                <Text className="text-white/70 text-xs leading-relaxed pl-11">
                  {review.comment}
                </Text>
              </View>
            ))}

            {reviews.length === 0 && (
              <Text className="text-white/40 text-xs text-center py-6">No reviews have been written for this guide yet.</Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Floating CTA Footer (Dual Buttons Row) */}
      <Animated.View style={[styles.footerContainer, animatedFooterStyle]} className="bg-astro-deep/90 border-t border-white/10 px-6 py-4 flex-row absolute bottom-0 left-0 right-0 z-30">
        {/* Book Consultation Button (Outline) */}
        <TouchableOpacity
          onPress={handleBookAppointment}
          className="flex-1 border border-astro-gold/40 rounded-2xl py-3.5 items-center justify-center flex-row"
        >
          <Calendar size={14} color={Colors.gold} style={{ marginRight: 6 }} />
          <Text className="text-astro-gold font-extrabold text-xs uppercase tracking-widest">
            Book Call
          </Text>
        </TouchableOpacity>

        {/* Chat Now Button (Solid) */}
        <TouchableOpacity
          onPress={handleStartChat}
          className="flex-1 bg-astro-gold rounded-2xl py-3.5 items-center justify-center flex-row ml-3"
          style={styles.chatButton}
        >
          <MessageSquare size={14} color={Colors.bg} style={{ marginRight: 6 }} />
          <Text className="text-astro-bg font-extrabold text-xs uppercase tracking-widest">
            Chat Now
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroBannerContainer: {
    height: 160,
    width: '100%',
    overflow: 'hidden',
  },
  headerCard: {
    marginTop: -50, // Pulls the card up to overlap the banner
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  avatarWrapper: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  largeAvatar: {
    width: 90,
    height: 90,
  },
  largeStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#1C1542', // Matched to glass card interior background tint
  },
  footerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  chatButton: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
