import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { usePremiumModal } from '../components/PremiumModal';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useUser } from '../hooks/useUser';
import { Colors } from '../constants/Colors';
import { Phone, ShieldAlert, Sparkles, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Login() {
  const { login, profile } = useUser();
  const router = useRouter();
  const { showError, showSuccess } = usePremiumModal();

  // Screen states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(59);

  // Transition animation shared value
  const slideAnim = useSharedValue(0); // 0 = Phone Input, 1 = OTP Input

  // Input refs for OTP auto-focus
  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Countdown timer for OTP resend
  useEffect(() => {
    console.log('Login Screen Mounted!');
  }, []);

  useEffect(() => {
    let timer: any;
    if (isOtpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);

  // Handle phone validation & OTP request
  const handleContinue = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobileNumber)) {
      showError('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    // Simulate OTP sending
    setIsOtpSent(true);
    setCountdown(59);
    
    // Slide transition to OTP view (0 to 1)
    slideAnim.value = withTiming(1, {
      duration: 500,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });

    // Auto-focus first OTP input after slide
    setTimeout(() => {
      otpRefs[0].current?.focus();
    }, 600);
  };

  // Back button from OTP to Phone view
  const handleBackToPhone = () => {
    slideAnim.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
    setIsOtpSent(false);
  };

  // OTP text input management
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // If text entered, auto-focus next input
    if (text && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // If backspace pressed on empty input, focus previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Verify OTP & login session
  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      showError('Verification Error', 'Please enter the complete 6-digit verification code');
      return;
    }

    // Call user login
    const success = await login(mobileNumber);
    if (success) {
      // Root _layout handles routing based on profile presence:
      // If profile exists -> redirects to (tabs)
      // Else -> redirects to signup form
    } else {
      showError('Login Failed', 'Authentication failed. Please try again.');
    }
  };

  const handleResendOtp = () => {
    setCountdown(59);
    setOtp(['', '', '', '', '', '']);
    otpRefs[0].current?.focus();
    showSuccess('OTP Sent', 'A mock 6-digit OTP code has been resent to your number');
  };

  // Animated Styles
  const animatedPhoneStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -slideAnim.value * width }],
      opacity: 1 - slideAnim.value,
    };
  });

  const animatedOtpStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: (1 - slideAnim.value) * width }],
      opacity: slideAnim.value,
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: Colors.bg }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        {/* Star elements */}
        <View className="absolute top-12 left-10 opacity-30">
          <Text className="text-xl">⭐</Text>
        </View>
        <View className="absolute top-24 right-12 opacity-25">
          <Text className="text-2xl">✨</Text>
        </View>

        {/* Global Header */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-full bg-astro-gold/10 items-center justify-center mb-4 border border-astro-gold/20">
            <Sparkles size={32} color={Colors.gold} />
          </View>
          <Text className="text-white text-3xl font-extrabold tracking-tight">
            AstroGuide
          </Text>
          <Text className="text-astro-textMuted text-sm text-center mt-2 px-6">
            Connecting your destiny to the stars. Log in to access your dashboard.
          </Text>
        </View>

        {/* SLIDING SCREENS CONTAINER */}
        <View className="flex-row w-full overflow-hidden" style={{ height: 360 }}>
          
          {/* SCREEN 1: PHONE INPUT */}
          <Animated.View style={[styles.slideCard, animatedPhoneStyle]} className="px-6 justify-center">
            <View style={{ gap: 16 }}>
              <View>
                <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  Mobile Number
                </Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <Text className="text-white font-bold text-sm mr-2">+91</Text>
                  <View className="w-[1px] bg-white/20 h-5 mr-3" />
                  <Phone size={18} color={Colors.gold} style={{ marginRight: 8 }} />
                  <TextInput
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    className="flex-1 text-white text-sm"
                    keyboardType="phone-pad"
                    maxLength={10}
                    autoFocus={true}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleContinue}
                className="bg-astro-gold rounded-xl py-4 items-center mt-4"
                activeOpacity={0.8}
                style={styles.shadowButton}
              >
                <Text className="text-astro-bg font-extrabold text-base uppercase tracking-wider">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* SCREEN 2: OTP INPUT */}
          <Animated.View style={[styles.slideCard, animatedOtpStyle]} className="px-6 justify-center">
            {/* Back button */}
            <TouchableOpacity
              onPress={handleBackToPhone}
              className="flex-row items-center mb-6 self-start"
            >
              <ChevronLeft size={16} color={Colors.gold} />
              <Text className="text-astro-gold text-xs font-semibold ml-1">Change Number</Text>
            </TouchableOpacity>

            <View style={{ gap: 16 }}>
              <View>
                <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  Enter 6-Digit OTP
                </Text>
                <Text className="text-astro-textMuted text-xs mb-4">
                  Sent to +91 {mobileNumber}
                </Text>

                {/* 6-box OTP entry */}
                <View className="flex-row justify-between mb-4">
                  {otp.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={otpRefs[idx]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, idx)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      keyboardType="number-pad"
                      maxLength={1}
                      className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl font-bold"
                      style={{
                        borderColor: digit ? Colors.gold : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* Resend Timer */}
              <View className="items-center mb-2">
                {countdown > 0 ? (
                  <Text className="text-white/40 text-xs">
                    Resend code in <Text className="text-astro-gold font-semibold">{countdown}s</Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOtp}>
                    <Text className="text-astro-gold font-semibold text-xs underline">
                      Resend Verification Code
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={handleVerify}
                className="bg-astro-gold rounded-xl py-4 items-center"
                activeOpacity={0.8}
                style={styles.shadowButton}
              >
                <Text className="text-astro-bg font-extrabold text-base uppercase tracking-wider">
                  Verify Code
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  slideCard: {
    width: width,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  shadowButton: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
