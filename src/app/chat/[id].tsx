import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Send, Phone, Video, MoreVertical, Sparkles } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import astrologersData from '../../constants/astrologers.json';
import { Colors } from '../../constants/Colors';

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

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'astrologer';
  timestamp: string;
}

// Bouncing Dot for Typing Indicator
function TypingDot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        true
      )
    );
  }, [delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: Colors.textMuted,
          marginHorizontal: 1.5,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const astrologer = (astrologersData as Astrologer[]).find((a) => a.id === id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  // Storage key
  const storageKey = `@astro_chat_${id}`;

  // Load chat history from AsyncStorage
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          setMessages(JSON.parse(stored));
        } else if (astrologer) {
          // Pre-populate with a friendly greeting from this astrologer
          const defaultGreeting: Message = {
            id: 'welcome',
            text: `Namaste 🙏 I am ${astrologer.name}. Welcome to your private cosmic reading channel. How may I assist you today? Please share your question or birth details.`,
            sender: 'astrologer',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages([defaultGreeting]);
          await AsyncStorage.setItem(storageKey, JSON.stringify([defaultGreeting]));
        }
      } catch (e) {
        console.error('Failed to load chat history', e);
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();
  }, [id, astrologer, storageKey]);

  // Context-aware auto responses
  const getAstrologerResponse = (userMsg: string) => {
    const query = userMsg.toLowerCase();
    if (
      query.includes('love') ||
      query.includes('marriage') ||
      query.includes('relationship') ||
      query.includes('partner') ||
      query.includes('dating') ||
      query.includes('wife') ||
      query.includes('husband')
    ) {
      return "The stars show a strong Venus influence in your chart right now. Relationships can be harmonious, but communication requires patience. Let me review your compatibility transit details.";
    }
    if (
      query.includes('job') ||
      query.includes('career') ||
      query.includes('work') ||
      query.includes('business') ||
      query.includes('promotion') ||
      query.includes('employment')
    ) {
      return "Saturn is currently in a crucial house of your natal chart, suggesting a period of intense focus leading to long-term rewards. Keep your dedication high, an opportunity is arriving soon.";
    }
    if (
      query.includes('money') ||
      query.includes('wealth') ||
      query.includes('finance') ||
      query.includes('investment') ||
      query.includes('rich')
    ) {
      return "Jupiter's aspect on your 2nd house of wealth is highly favorable, but Mercury retrogrades warning against hasty signatures. Let me review your current dasha period.";
    }
    if (
      query.includes('health') ||
      query.includes('stress') ||
      query.includes('energy') ||
      query.includes('sleep') ||
      query.includes('sick')
    ) {
      return "Your Sun energy seems slightly affected by recent Mars movements. Focus on grounding yourself, staying hydrated, and meditating. Avoid stressful confrontations.";
    }
    if (
      query.includes('chart') ||
      query.includes('birth') ||
      query.includes('kundli') ||
      query.includes('dob') ||
      query.includes('pob')
    ) {
      return "Thank you for sharing these details. I am casting your birth chart now to map the houses. Please give me a brief moment to analyze the planetary placements.";
    }
    return "I am tuning into your cosmic energies. The alignment of your planetary transits suggests a transitional phase. Tell me, is there a specific area of your life you'd like me to look into?";
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const newMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    
    // Auto-scroll instantly
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    } catch (e) {
      console.error('Failed to save message', e);
    }

    // Trigger typing state & response
    setIsTyping(true);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);

    // Wait 1.8 seconds, then respond
    setTimeout(async () => {
      const responseText = getAstrologerResponse(userText);
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'astrologer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, replyMsg];
      setMessages(finalMessages);
      setIsTyping(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(finalMessages));
      } catch (e) {
        console.error('Failed to save reply', e);
      }
    }, 1800);
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgDark }} edges={['top']}>
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

      {/* Keyboard Avoiding Container */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header Bar */}
        <View className="px-4 py-3 flex-row items-center border-b border-white/5 bg-astro-deep/40 justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10 mr-2"
            >
              <ChevronLeft size={20} color={Colors.gold} />
            </TouchableOpacity>

            {/* Avatar & Info */}
            <View className="relative">
              <Image
                source={{ uri: astrologer.photoUrl }}
                style={{ width: 42, height: 42 }}
                className="rounded-full bg-white/5 border border-white/10"
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: -1,
                  right: -1,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: astrologer.isOnline ? '#4CAF50' : '#9E9E9E',
                  borderWidth: 1.5,
                  borderColor: Colors.bgDark,
                }}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-white font-extrabold text-sm tracking-tight" numberOfLines={1}>
                {astrologer.name}
              </Text>
              <View className="flex-row items-center mt-0.5">
                {isTyping ? (
                  <View className="flex-row items-center">
                    <Text className="text-astro-gold text-[10px] font-bold tracking-wider">
                      Typing
                    </Text>
                    <View className="flex-row items-center ml-1">
                      <TypingDot delay={0} />
                      <TypingDot delay={150} />
                      <TypingDot delay={300} />
                    </View>
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 2.5,
                        backgroundColor: astrologer.isOnline ? '#4CAF50' : '#9E9E9E',
                        marginRight: 4,
                      }}
                    />
                    <Text className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                      {astrologer.isOnline ? 'Online' : 'Offline'}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Action icons */}
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-white/5 items-center justify-center border border-white/10">
              <Phone size={14} color={Colors.gold} />
            </TouchableOpacity>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-white/5 items-center justify-center border border-white/10">
              <Video size={14} color={Colors.gold} />
            </TouchableOpacity>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-white/5 items-center justify-center border border-white/10">
              <MoreVertical size={14} color={Colors.gold} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages List */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.gold} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, gap: 16 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => {
              const isUser = item.sender === 'user';
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    width: '100%',
                  }}
                >
                  {!isUser && (
                    <Image
                      source={{ uri: astrologer.photoUrl }}
                      style={{ width: 28, height: 28, marginRight: 8, marginTop: 4 }}
                      className="rounded-full bg-white/5 border border-white/10"
                    />
                  )}
                  <View
                    style={[
                      isUser ? styles.userBubble : styles.astrologerBubble,
                      { maxWidth: '78%' },
                    ]}
                  >
                    <Text
                      style={[
                        isUser ? styles.userText : styles.astrologerText,
                        { fontSize: 13, lineHeight: 18 },
                      ]}
                    >
                      {item.text}
                    </Text>
                    <Text
                      style={[
                        isUser ? styles.userTime : styles.astrologerTime,
                        { alignSelf: 'flex-end', marginTop: 4 },
                      ]}
                    >
                      {item.timestamp}
                    </Text>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={
              isTyping ? (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%', marginTop: 8 }}>
                  <Image
                    source={{ uri: astrologer.photoUrl }}
                    style={{ width: 28, height: 28, marginRight: 8, marginTop: 4 }}
                    className="rounded-full bg-white/5 border border-white/10"
                  />
                  <View style={[styles.astrologerBubble, { maxWidth: '78%', paddingVertical: 12, paddingHorizontal: 16 }]}>
                    <View className="flex-row items-center justify-center" style={{ height: 18, width: 30 }}>
                      <TypingDot delay={0} />
                      <TypingDot delay={150} />
                      <TypingDot delay={300} />
                    </View>
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Input Bar */}
        <View
          style={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + 12 : 16 }}
          className="px-4 pt-2 bg-astro-deep/30 border-t border-white/5"
        >
          <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about love, career, finances..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              className="flex-1 text-white text-sm"
              multiline
              style={{ paddingVertical: 0, maxHeight: 80 }}
            />
            {inputText.trim().length > 0 && (
              <TouchableOpacity
                onPress={handleSend}
                style={styles.sendBtn}
                className="bg-astro-gold w-8 h-8 rounded-full items-center justify-center ml-2"
              >
                <Send size={12} color={Colors.bg} style={{ marginLeft: 1 }} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userBubble: {
    backgroundColor: Colors.gold,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  userText: {
    color: Colors.textDark,
    fontWeight: '500',
  },
  userTime: {
    fontSize: 9,
    color: '#6E5215',
    fontWeight: '600',
  },
  astrologerBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  astrologerText: {
    color: Colors.textLight,
    fontWeight: '400',
  },
  astrologerTime: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  sendBtn: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
