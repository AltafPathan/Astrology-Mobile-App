import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter, Redirect } from 'expo-router';
import { useUser } from '../hooks/useUser';
import { Colors } from '../constants/Colors';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { session, profile, loading } = useUser();
  const router = useRouter();

  // Screen state
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Reanimated shared values
  const opacity = useSharedValue(0);          // Fade in the screen
  const zodiacRotation = useSharedValue(0);   // Rotate the zodiac wheel
  const moonScale = useSharedValue(0.9);      // Pulsate the moon
  const contentFadeOut = useSharedValue(1);   // Fade out when redirecting

  useEffect(() => {
    // 1. Fade in screen elements on mount
    console.log('SplashScreen Mounted!');
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) });

    return () => {
      console.log('SplashScreen Unmounted!');
    };
  }, []);

  useEffect(() => {  // 2. Start continuous zodiac wheel rotation
    zodiacRotation.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1, // infinite
      false // do not reverse
    );

    // 3. Start gentle moon pulsation
    moonScale.value = withRepeat(
      withTiming(1.06, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true // reverse (yoyo)
    );

    // 4. Set time up flag after 2.5 seconds
    const timer = setTimeout(() => {
      // Trigger fade out
      contentFadeOut.value = withTiming(0, { duration: 500 });
      setIsTimeUp(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Reanimated Styles
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value * contentFadeOut.value,
    };
  });

  const animatedZodiacStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${zodiacRotation.value}deg` }],
    };
  });

  const animatedMoonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: moonScale.value }],
    };
  });

  // Handle navigation redirect safely when loading finishes and splash time is up
  if (!loading && isTimeUp) {
    console.log('SplashScreen Redirecting (Redirect component) - Session:', !!session, 'Profile:', !!profile);
    if (!session) {
      return <Redirect href="/login" />;
    } else if (!profile) {
      return <Redirect href="/signup" />;
    } else {
      return <Redirect href="/(tabs)" />;
    }
  }

  return (
    <View style={styles.container}>
      {/* Background Gradient using Svg */}
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
        <Defs>
          <RadialGradient id="bgGrad" cx="50%" cy="50%" rx="70%" ry="70%">
            <Stop offset="0%" stopColor="#251758" stopOpacity="1" />
            <Stop offset="70%" stopColor="#120B2C" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0B061D" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGrad)" />
      </Svg>

      {/* Decorative stars overlay */}
      <View className="absolute inset-0 items-center justify-center pointer-events-none opacity-20">
        <Text className="absolute text-white text-xs top-1/4 left-1/4">✦</Text>
        <Text className="absolute text-white text-sm top-[15%] right-[20%]">✦</Text>
        <Text className="absolute text-white text-xs bottom-1/3 left-[15%]">✦</Text>
        <Text className="absolute text-white text-sm bottom-[20%] right-1/4">✦</Text>
      </View>

      {/* Main Animated content container */}
      <Animated.View style={[styles.content, animatedContainerStyle]}>
        {/* Animated Moon and Zodiac circles */}
        <View style={styles.animationWrapper}>
          {/* Zodiac rotating wheel (SVG) */}
          <Animated.View style={[styles.zodiacContainer, animatedZodiacStyle]}>
            <Svg width={260} height={260} viewBox="0 0 100 100">
              {/* Concentric rings */}
              <Circle cx="50" cy="50" r="46" stroke={Colors.gold} strokeWidth="0.5" fill="transparent" opacity="0.3" />
              <Circle cx="50" cy="50" r="38" stroke={Colors.gold} strokeWidth="0.5" strokeDasharray="1, 4" fill="transparent" opacity="0.4" />
              <Circle cx="50" cy="50" r="42" stroke={Colors.gold} strokeWidth="0.4" strokeDasharray="4, 2" fill="transparent" opacity="0.25" />

              {/* Glyph division pointers */}
              {Array.from({ length: 12 }).map((_, idx) => {
                const angle = (idx * 30) * (Math.PI / 180);
                const x1 = 50 + 42 * Math.cos(angle);
                const y1 = 50 + 42 * Math.sin(angle);
                const x2 = 50 + 46 * Math.cos(angle);
                const y2 = 50 + 46 * Math.sin(angle);
                return (
                  <Path
                    key={idx}
                    d={`M ${x1} ${y1} L ${x2} ${y2}`}
                    stroke={Colors.gold}
                    strokeWidth="0.4"
                    opacity="0.5"
                  />
                );
              })}
            </Svg>
          </Animated.View>

          {/* Glowing center Logo + Moon (SVG) */}
          <Animated.View style={[styles.moonContainer, animatedMoonStyle]}>
            <Svg width={120} height={120} viewBox="0 0 100 100">
              <Defs>
                <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop offset="0%" stopColor={Colors.gold} stopOpacity="0.4" />
                  <Stop offset="100%" stopColor={Colors.gold} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              
              {/* Outer Glow */}
              <Circle cx="50" cy="50" r="30" fill="url(#glow)" />

              {/* Elegant Crescent Moon */}
              <Path
                d="M50 25 A20 20 0 1 0 75 50 A16 16 0 1 1 50 25 Z"
                fill={Colors.gold}
              />

              {/* Multi-point center star */}
              <Path
                d="M 50 40 L 52 48 L 60 50 L 52 52 L 50 60 L 48 52 L 40 50 L 48 48 Z"
                fill="#FFFFFF"
                opacity="0.95"
              />
            </Svg>
          </Animated.View>
        </View>

        {/* Text Details */}
        <View style={styles.textContainer}>
          <Text style={{ letterSpacing: 8 }} className="text-white text-3xl font-black text-center uppercase">
            AstroGuide
          </Text>
          <Text style={{ letterSpacing: 6 }} className="text-astro-gold text-[10px] font-bold text-center uppercase mt-2 opacity-60">
            Your Cosmic Compass
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B061D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationWrapper: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  zodiacContainer: {
    position: 'absolute',
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
});
