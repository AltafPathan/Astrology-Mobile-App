import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { ChevronLeft, Search, Clock, BookOpen } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import blogsData from '../../constants/blogs.json';

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

const CATEGORIES = ["All", "Transits", "Houses", "Moon", "Tarot"];

// Custom Animated Card wrapper
function BlogCard({ article, index, onPress }: { article: BlogArticle; index: number; onPress: () => void }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(index * 100, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-5"
        style={styles.cardContainer}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: article.imageUrl }}
          style={{ width: '100%', height: 160 }}
          className="bg-white/5"
        />
        <View className="p-5" style={{ gap: 8 }}>
          <View className="flex-row justify-between items-center">
            <View className="bg-astro-gold/15 border border-astro-gold/25 px-2.5 py-0.5 rounded-full">
              <Text className="text-astro-gold text-[9px] font-extrabold uppercase tracking-wider">
                {article.category}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={10} color={Colors.textMuted} style={{ marginRight: 4 }} />
              <Text className="text-white/40 text-[10px]">{article.readTime}</Text>
            </View>
          </View>

          <Text className="text-white text-base font-extrabold tracking-tight mt-1 leading-snug">
            {article.title}
          </Text>

          <Text className="text-white/60 text-xs leading-relaxed" numberOfLines={2}>
            {article.shortDescription}
          </Text>

          <View className="flex-row justify-between items-center border-t border-white/5 pt-3 mt-1">
            <Text className="text-white/40 text-[10px] font-bold">By {article.author}</Text>
            <Text className="text-white/30 text-[10px]">{article.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function BlogList() {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter blogs based on search query & category selection
  const filteredBlogs = (blogsData as BlogArticle[]).filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      blog.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
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
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5 bg-astro-deep/40 z-20">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
        >
          <ChevronLeft size={20} color={Colors.gold} />
        </TouchableOpacity>
        <Text className="text-white font-extrabold text-sm uppercase tracking-widest">
          Cosmic Insights
        </Text>
        <View className="w-10 h-10 rounded-full bg-astro-gold/15 items-center justify-center border border-astro-gold/30">
          <BookOpen size={16} color={Colors.gold} />
        </View>
      </View>

      {/* Search Input Bar */}
      <View className="px-6 pt-5 pb-2">
        <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
          <Search size={18} color="rgba(255, 255, 255, 0.3)" style={{ marginRight: 10 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search articles by title or keyword..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            className="flex-1 text-white text-sm"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Horizontal Category Pill Filter Bar */}
      <View className="mt-2 mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl border ${
                  isActive ? 'bg-astro-gold border-astro-gold' : 'bg-white/5 border-white/10'
                }`}
                activeOpacity={0.8}
              >
                <Text className={`text-xs font-bold ${isActive ? 'text-astro-bg' : 'text-white/60'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Blogs List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        {filteredBlogs.map((article, idx) => (
          <BlogCard
            key={article.id}
            article={article}
            index={idx}
            onPress={() => router.push(`/blog/${article.id}`)}
          />
        ))}

        {filteredBlogs.length === 0 && (
          <View className="items-center justify-center py-20">
            <Text className="text-white/40 text-sm text-center">
              No articles found matching your criteria.
            </Text>
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
});
