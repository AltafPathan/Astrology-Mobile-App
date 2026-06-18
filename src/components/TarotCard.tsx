import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { TarotCard as TarotCardType } from '../constants/TarotData';
import { Colors } from '../constants/Colors';
import { Sparkles } from 'lucide-react-native';

interface TarotCardProps {
  card: TarotCardType;
  isReversed: boolean;
  isFlipped: boolean;
  onFlip: () => void;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  card,
  isReversed,
  isFlipped,
  onFlip,
}) => {
  const rotateY = useSharedValue(0);

  React.useEffect(() => {
    rotateY.value = withTiming(isFlipped ? 180 : 0, { duration: 600 });
  }, [isFlipped]);

  const animatedBackStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotateY.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotate}deg` }],
      opacity: rotateY.value > 90 ? 0 : 1,
    };
  });

  const animatedFrontStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotateY.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotate}deg` }],
      opacity: rotateY.value > 90 ? 1 : 0,
    };
  });

  return (
    <Pressable onPress={onFlip} style={styles.cardContainer}>
      {/* CARD BACK SIDE */}
      <Animated.View
        style={[styles.card, styles.cardBack, animatedBackStyle]}
        className="border-2 border-astro-gold rounded-2xl items-center justify-center p-6 bg-astro-deep"
      >
        <View className="w-full h-full border border-astro-gold/30 rounded-xl items-center justify-center bg-white/[0.02] p-4">
          <Sparkles size={40} color={Colors.gold} />
          <Text className="text-astro-gold text-lg font-bold tracking-widest uppercase mt-4">
            Tarot Reading
          </Text>
          <Text className="text-white/40 text-xs text-center mt-2">
            Tap to reveal your path
          </Text>
        </View>
      </Animated.View>

      {/* CARD FRONT SIDE */}
      <Animated.View
        style={[styles.card, styles.cardFront, animatedFrontStyle]}
        className="rounded-2xl p-6 bg-white border-2 border-astro-gold"
      >
        <View className="flex-1 items-center justify-between border border-astro-bg/10 rounded-xl p-4">
          {/* Card Number */}
          <Text className="text-astro-gold font-bold text-sm tracking-widest uppercase">
            Arcanum {card.number}
          </Text>

          {/* Name & Orientation */}
          <View className="items-center my-3">
            <Text className="text-astro-text font-extrabold text-2xl text-center">
              {card.name}
            </Text>
            {isReversed && (
              <View className="bg-red-500/10 px-2 py-0.5 rounded-full mt-1">
                <Text className="text-red-600 font-bold text-xs">REVERSED</Text>
              </View>
            )}
          </View>

          {/* Interpretation Details */}
          <View className="w-full">
            <Text className="text-astro-text/80 text-xs font-semibold uppercase tracking-wider mb-1">
              Meaning:
            </Text>
            <Text className="text-astro-text/90 text-sm font-medium leading-relaxed mb-3">
              {isReversed ? card.reversedMeaning : card.uprightMeaning}
            </Text>
            <Text className="text-astro-text/60 text-xs leading-relaxed">
              {card.description}
            </Text>
          </View>

          {/* Advice footer */}
          <View className="w-full border-t border-black/5 pt-3 mt-3">
            <Text className="text-astro-gold/90 text-xs font-bold uppercase tracking-wider mb-1">
              Guidance:
            </Text>
            <Text className="text-astro-text/80 text-xs leading-relaxed">
              {card.love}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 280,
    height: 420,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cardBack: {
    zIndex: 1,
  },
  cardFront: {
    zIndex: 0,
  },
});
