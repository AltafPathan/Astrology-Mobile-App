import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { TarotCard } from '../../components/TarotCard';
import { getSingleCardReading, getThreeCardSpread, TarotReading, SpreadReading } from '../../services/tarot';
import { RefreshCw, Layout, Layers } from 'lucide-react-native';

export default function TarotScreen() {
  const [spreadType, setSpreadType] = useState<'single' | 'three'>('single');
  const [singleReading, setSingleReading] = useState<TarotReading | null>(null);
  const [threeReading, setThreeReading] = useState<SpreadReading | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const handleDrawSingle = () => {
    const reading = getSingleCardReading();
    setSingleReading(reading);
    setThreeReading(null);
    setFlippedCards({ single: false });
  };

  const handleDrawThree = () => {
    const reading = getThreeCardSpread();
    setThreeReading(reading);
    setSingleReading(null);
    setFlippedCards({ past: false, present: false, future: false });
  };

  const handleFlipCard = (key: string) => {
    setFlippedCards((prev) => ({ ...prev, [key]: true }));
  };

  const handleReset = () => {
    setSingleReading(null);
    setThreeReading(null);
    setFlippedCards({});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgDark }}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-white/5 flex-row justify-between items-center">
        <Text className="text-white text-xl font-bold">Tarot Sanctuary</Text>
        {(singleReading || threeReading) && (
          <TouchableOpacity
            onPress={handleReset}
            className="flex-row items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
          >
            <RefreshCw size={12} color={Colors.gold} style={{ marginRight: 6 }} />
            <Text className="text-astro-gold text-xs font-semibold">Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        {/* If no reading drawn, show selector options */}
        {!singleReading && !threeReading && (
          <View>
            <Text className="text-white/40 text-xs text-center mb-8">
              Choose your spread, focus your mind on a question, and draw your cards.
            </Text>

            {/* Selector Options */}
            <View style={{ gap: 16 }} className="mb-8">
              {/* Single Card Option */}
              <TouchableOpacity
                onPress={() => setSpreadType('single')}
                className={`p-6 rounded-3xl border-2 flex-row justify-between items-center ${
                  spreadType === 'single'
                    ? 'bg-astro-gold/10 border-astro-gold'
                    : 'bg-white/5 border-white/10'
                }`}
                activeOpacity={0.8}
              >
                <View className="flex-1 pr-4">
                  <View className="flex-row items-center mb-1">
                    <Layers size={18} color={Colors.gold} style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-base">Daily Insight</Text>
                  </View>
                  <Text className="text-white/60 text-xs leading-relaxed">
                    Draw a single card representing the key cosmic energy of your day. Excellent for quick advice.
                  </Text>
                </View>
                <Text className="text-2xl">🃏</Text>
              </TouchableOpacity>

              {/* Three Card Option */}
              <TouchableOpacity
                onPress={() => setSpreadType('three')}
                className={`p-6 rounded-3xl border-2 flex-row justify-between items-center ${
                  spreadType === 'three'
                    ? 'bg-astro-gold/10 border-astro-gold'
                    : 'bg-white/5 border-white/10'
                }`}
                activeOpacity={0.8}
              >
                <View className="flex-1 pr-4">
                  <View className="flex-row items-center mb-1">
                    <Layout size={18} color={Colors.gold} style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-base">Three Card Spread</Text>
                  </View>
                  <Text className="text-white/60 text-xs leading-relaxed">
                    Draw three cards representing your Past, Present, and Future. Deep dive into a situation.
                  </Text>
                </View>
                <Text className="text-2xl">🔮</Text>
              </TouchableOpacity>
            </View>

            {/* Draw Button */}
            <TouchableOpacity
              onPress={spreadType === 'single' ? handleDrawSingle : handleDrawThree}
              className="bg-astro-gold rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-astro-bg font-extrabold text-base uppercase tracking-wider">
                Shuffle & Draw Cards
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* If Single Card reading drawn */}
        {singleReading && (
          <View className="items-center py-4">
            <Text className="text-astro-gold text-xs font-bold uppercase tracking-widest mb-4">
              Your Daily Insight Card
            </Text>
            
            <TarotCard
              card={singleReading.card}
              isReversed={singleReading.isReversed}
              isFlipped={!!flippedCards.single}
              onFlip={() => handleFlipCard('single')}
            />

            {!flippedCards.single && (
              <Text className="text-white/40 text-xs text-center mt-6">
                Focus on your query, then tap the card to flip
              </Text>
            )}
          </View>
        )}

        {/* If Three Card spread reading drawn */}
        {threeReading && (
          <View className="items-center">
            {/* We render them vertically for layout accessibility and high details on mobile */}
            <Text className="text-astro-gold text-xs font-bold uppercase tracking-widest mb-6 text-center">
              Past, Present, and Future Spread
            </Text>

            <View style={{ gap: 32 }} className="w-full">
              {/* PAST */}
              <View>
                <Text className="text-white font-semibold text-sm mb-3 text-center uppercase tracking-widest">
                  1. The Past
                </Text>
                <TarotCard
                  card={threeReading.past.card}
                  isReversed={threeReading.past.isReversed}
                  isFlipped={!!flippedCards.past}
                  onFlip={() => handleFlipCard('past')}
                />
              </View>

              {/* PRESENT */}
              <View>
                <Text className="text-white font-semibold text-sm mb-3 text-center uppercase tracking-widest">
                  2. The Present
                </Text>
                <TarotCard
                  card={threeReading.present.card}
                  isReversed={threeReading.present.isReversed}
                  isFlipped={!!flippedCards.present}
                  onFlip={() => handleFlipCard('present')}
                />
              </View>

              {/* FUTURE */}
              <View>
                <Text className="text-white font-semibold text-sm mb-3 text-center uppercase tracking-widest">
                  3. The Future
                </Text>
                <TarotCard
                  card={threeReading.future.card}
                  isReversed={threeReading.future.isReversed}
                  isFlipped={!!flippedCards.future}
                  onFlip={() => handleFlipCard('future')}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
