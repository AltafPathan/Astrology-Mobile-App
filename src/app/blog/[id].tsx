import React, { useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { ChevronLeft, Clock, User, Calendar, BookOpen } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Circle } from 'react-native-svg';
import blogsData from '../../constants/blogs.json';

const { width } = Dimensions.get('window');

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  imageUrl: string;
  readTime: string;
  author: string;
  date: string;
  content: string[];
}

export default function BlogDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const article = (blogsData as BlogArticle[]).find((b) => b.id === id);

  // Animations shared values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const metaOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 600 });
    titleTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) });
    metaOpacity.value = withDelay(150, withTiming(1, { duration: 600 }));
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    contentTranslateY.value = withDelay(300, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));
  }, [titleOpacity, titleTranslateY, metaOpacity, contentOpacity, contentTranslateY]);

  if (!article) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-white text-lg">Article not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-astro-gold px-4 py-2 rounded-xl">
          <Text className="text-astro-bg font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Animated styles
  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ translateY: titleTranslateY.value }],
    };
  });

  const animatedMetaStyle = useAnimatedStyle(() => {
    return {
      opacity: metaOpacity.value,
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgDark }} edges={['bottom']}>
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

      {/* Floating Header Back Button & Action Icons */}
      <View style={styles.floatingHeader} className="px-6 py-4 flex-row justify-between items-center z-30">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-astro-bgDark/80 items-center justify-center border border-white/10"
        >
          <ChevronLeft size={20} color={Colors.gold} />
        </TouchableOpacity>
        <View className="w-10 h-10 rounded-full bg-astro-bgDark/80 items-center justify-center border border-white/10">
          <BookOpen size={16} color={Colors.gold} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Cover Hero Image */}
        <View className="relative w-full" style={{ height: 260 }}>
          <Image
            source={{ uri: article.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            className="bg-white/5"
          />
          {/* Subtle bottom fade */}
          <View style={styles.imageFade} />
        </View>

        {/* Title Container Section */}
        <Animated.View style={[animatedTitleStyle]} className="px-6 mt-6">
          <View className="flex-row items-center mb-2">
            <View className="bg-astro-gold/15 border border-astro-gold/25 px-2.5 py-0.5 rounded-full">
              <Text className="text-astro-gold text-[9px] font-extrabold uppercase tracking-wider">
                {article.category}
              </Text>
            </View>
            <View className="flex-row items-center ml-4">
              <Clock size={10} color={Colors.textMuted} style={{ marginRight: 4 }} />
              <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">{article.readTime}</Text>
            </View>
          </View>
          
          <Text className="text-white text-2xl font-black leading-tight mt-1 tracking-tight">
            {article.title}
          </Text>
        </Animated.View>

        {/* Author / Date Meta Details */}
        <Animated.View style={[animatedMetaStyle]} className="px-6 mt-4">
          <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl p-4">
            <View className="w-9 h-9 rounded-full bg-astro-gold/10 items-center justify-center mr-3 border border-astro-gold/20">
              <User size={16} color={Colors.gold} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-extrabold text-xs">Written by {article.author}</Text>
              <Text className="text-white/40 text-[10px] mt-0.5">Published on {article.date}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Article Body Content */}
        <Animated.View style={[animatedContentStyle]} className="px-6 mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-md border border-white/10" style={{ gap: 16 }}>
            {article.content.map((paragraph, idx) => (
              <Text key={idx} className="text-astro-text/80 text-sm leading-relaxed">
                {paragraph}
              </Text>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 12,
    left: 0,
    right: 0,
  },
  imageFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: 'transparent',
    opacity: 0.9,
  },
});
