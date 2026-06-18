import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { usePremiumModal } from '../../components/PremiumModal';
import { useRouter } from 'expo-router';
import { useUser } from '../../hooks/useUser';
import { Colors } from '../../constants/Colors';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  LogOut,
  Moon,
  Bell,
  Settings,
  Check,
  X,
  Edit2
} from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { ZodiacEmojis } from '../../components/ZodiacSelector';

// Premium Toggle Switch Component
function ToggleSwitch({ value, onValueChange }: { value: boolean; onValueChange: (val: boolean) => void }) {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
      className={`w-11 h-6 rounded-full p-0.5 justify-center ${
        value ? 'bg-astro-gold' : 'bg-white/10'
      }`}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: value ? Colors.bgDark : '#FFFFFF',
          alignSelf: value ? 'flex-end' : 'flex-start',
        }}
      />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, session, saveProfile, clearProfile } = useUser();
  const { showError, showSuccess, showConfirm } = usePremiumModal();

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [gender, setGender] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Settings states
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Populate edit fields from user context on mount/load
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBirthDate(profile.birthDate || '');
      setBirthTime(profile.birthTime || '');
      setBirthPlace(profile.birthPlace || '');
      setGender(profile.gender || 'male');
    }
  }, [profile, isEditing]);

  if (!profile) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text className="text-white/60 text-xs mt-3">Synchronizing profile...</Text>
      </View>
    );
  }

  const validateForm = () => {
    if (!name.trim()) {
      showError('Validation Error', 'Please enter your name.');
      return false;
    }
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(birthDate)) {
      showError('Validation Error', 'Please enter birthdate in YYYY-MM-DD format.');
      return false;
    }
    const tobRegex = /^\d{2}:\d{2}$/;
    if (!tobRegex.test(birthTime)) {
      showError('Validation Error', 'Please enter birth time in HH:MM (24h) format.');
      return false;
    }
    if (!birthPlace.trim()) {
      showError('Validation Error', 'Please enter your birth place.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const success = await saveProfile({
        name: name.trim(),
        gender,
        birthDate,
        birthTime,
        birthPlace: birthPlace.trim(),
      });
      if (success) {
        setIsEditing(false);
        showSuccess('Profile Updated', 'Your birth chart parameters have been successfully recalculated.');
      } else {
        showError('Error', 'Failed to update profile. Please try again.');
      }
    } catch (e) {
      console.error(e);
      showError('Error', 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    showConfirm(
      'Logout',
      'Are you sure you want to log out of AstroGuide?',
      async () => {
        await clearProfile();
        router.replace('/login');
      },
      undefined,
      'Logout',
      'Cancel'
    );
  };

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
      <View className="px-6 py-4 border-b border-white/5 flex-row justify-between items-center bg-astro-deep/40">
        <Text className="text-white text-xl font-bold">Cosmic Profile</Text>
        <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10">
          <Settings size={16} color={Colors.gold} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 50 }}>
        {/* User Info Avatar card */}
        <View className="bg-white/5 border border-white/10 rounded-3xl p-6 items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-astro-gold/10 items-center justify-center border-2 border-astro-gold relative mb-3">
            <User size={36} color={Colors.gold} />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: '#4CAF50',
                borderWidth: 2,
                borderColor: '#1D1343',
              }}
            />
          </View>
          <Text className="text-white text-xl font-black tracking-tight">{profile.name}</Text>
          <Text className="text-white/40 text-xs mt-1">
            Mobile: {session?.mobileNumber || 'Registered'}
          </Text>
        </View>

        {/* Dynamic Zodiac Placements */}
        <View className="mb-6">
          <Text className="text-astro-gold text-[10px] uppercase font-black tracking-wider mb-3 pl-1">
            Your Zodiac Placements
          </Text>
          <View className="flex-row" style={{ gap: 10 }}>
            {/* Sun Sign Card */}
            <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
              <Text className="text-[10px] text-white/40 font-bold uppercase">Sun Sign</Text>
              <Text className="text-3xl my-1.5">{ZodiacEmojis[profile.sunSign.id]}</Text>
              <Text className="text-white font-extrabold text-xs text-center" numberOfLines={1}>
                {profile.sunSign.name}
              </Text>
              <View className="bg-astro-gold/10 px-2 py-0.5 rounded-full mt-1.5 border border-astro-gold/25">
                <Text className="text-astro-gold text-[8px] uppercase font-extrabold tracking-wider">
                  {profile.sunSign.element}
                </Text>
              </View>
            </View>

            {/* Moon Sign Card */}
            <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
              <Text className="text-[10px] text-white/40 font-bold uppercase">Moon Sign</Text>
              <Text className="text-3xl my-1.5">{ZodiacEmojis[profile.moonSign.id]}</Text>
              <Text className="text-white font-extrabold text-xs text-center" numberOfLines={1}>
                {profile.moonSign.name}
              </Text>
              <View className="bg-astro-gold/10 px-2 py-0.5 rounded-full mt-1.5 border border-astro-gold/25">
                <Text className="text-astro-gold text-[8px] uppercase font-extrabold tracking-wider">
                  {profile.moonSign.element}
                </Text>
              </View>
            </View>

            {/* Rising Sign Card */}
            <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
              <Text className="text-[10px] text-white/40 font-bold uppercase">Rising</Text>
              <Text className="text-3xl my-1.5">{ZodiacEmojis[profile.risingSign.id]}</Text>
              <Text className="text-white font-extrabold text-xs text-center" numberOfLines={1}>
                {profile.risingSign.name}
              </Text>
              <View className="bg-astro-gold/10 px-2 py-0.5 rounded-full mt-1.5 border border-astro-gold/25">
                <Text className="text-astro-gold text-[8px] uppercase font-extrabold tracking-wider">
                  {profile.risingSign.element}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Birth Details Card (with editing states) */}
        <View className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6">
          <View className="flex-row justify-between items-center mb-4 border-b border-white/5 pb-2">
            <Text className="text-white font-black text-sm uppercase tracking-wider">
              Birth Parameters
            </Text>
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.gold} />
            ) : !isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="flex-row items-center bg-white/5 px-3 py-1 rounded-full border border-white/10"
              >
                <Edit2 size={12} color={Colors.gold} style={{ marginRight: 6 }} />
                <Text className="text-astro-gold text-[10px] font-bold uppercase tracking-wider">
                  Edit
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row" style={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={handleSave}
                  className="w-7 h-7 rounded-full bg-green-500/10 items-center justify-center border border-green-500/30"
                >
                  <Check size={14} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  className="w-7 h-7 rounded-full bg-red-500/10 items-center justify-center border border-red-500/30"
                >
                  <X size={14} color="#FF5A5A" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Details fields */}
          <View style={{ gap: 14 }}>
            {/* Name edit field (only in edit state) */}
            {isEditing && (
              <View style={{ gap: 4 }}>
                <Text className="text-white/40 text-[9px] uppercase font-bold tracking-wider">Full Name</Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <User size={14} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 8 }} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    className="flex-1 text-white text-xs"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>
            )}

            {/* Date Of Birth */}
            <View style={{ gap: 4 }}>
              <Text className="text-white/40 text-[9px] uppercase font-bold tracking-wider">Date of Birth</Text>
              {isEditing ? (
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <Calendar size={14} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 8 }} />
                  <TextInput
                    value={birthDate}
                    onChangeText={setBirthDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    className="flex-1 text-white text-xs"
                    keyboardType="numeric"
                    maxLength={10}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              ) : (
                <Text className="text-white font-extrabold text-sm pl-1">{profile.birthDate}</Text>
              )}
            </View>

            {/* Time of Birth */}
            <View style={{ gap: 4 }}>
              <Text className="text-white/40 text-[9px] uppercase font-bold tracking-wider">Time of Birth</Text>
              {isEditing ? (
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <Clock size={14} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 8 }} />
                  <TextInput
                    value={birthTime}
                    onChangeText={setBirthTime}
                    placeholder="HH:MM"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    className="flex-1 text-white text-xs"
                    keyboardType="numeric"
                    maxLength={5}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              ) : (
                <Text className="text-white font-extrabold text-sm pl-1">{profile.birthTime}</Text>
              )}
            </View>

            {/* Place of Birth */}
            <View style={{ gap: 4 }}>
              <Text className="text-white/40 text-[9px] uppercase font-bold tracking-wider">Place of Birth</Text>
              {isEditing ? (
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <MapPin size={14} color="rgba(255, 255, 255, 0.4)" style={{ marginRight: 8 }} />
                  <TextInput
                    value={birthPlace}
                    onChangeText={setBirthPlace}
                    placeholder="e.g. London, UK"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    className="flex-1 text-white text-xs"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              ) : (
                <Text className="text-white font-extrabold text-sm pl-1">{profile.birthPlace}</Text>
              )}
            </View>
          </View>
        </View>

        {/* System Settings options */}
        <View className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6" style={{ gap: 16 }}>
          <Text className="text-white font-black text-sm uppercase tracking-wider border-b border-white/5 pb-2">
            System Preferences
          </Text>

          {/* Dark Mode toggle option */}
          <View className="flex-row justify-between items-center py-1">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center border border-white/10 mr-3">
                <Moon size={14} color={Colors.gold} />
              </View>
              <Text className="text-white font-bold text-xs">Dark Theme</Text>
            </View>
            <ToggleSwitch value={darkMode} onValueChange={setDarkMode} />
          </View>

          {/* Notifications toggle option */}
          <View className="flex-row justify-between items-center py-1">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center border border-white/10 mr-3">
                <Bell size={14} color={Colors.gold} />
              </View>
              <Text className="text-white font-bold text-xs">Push Notifications</Text>
            </View>
            <ToggleSwitch value={notifications} onValueChange={setNotifications} />
          </View>
        </View>

        {/* Logout CTA */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl py-4 items-center justify-center flex-row"
          activeOpacity={0.8}
        >
          <LogOut size={16} color="#FF5A5A" style={{ marginRight: 8 }} />
          <Text className="text-[#FF5A5A] font-extrabold text-sm uppercase tracking-widest">
            Log Out Account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
