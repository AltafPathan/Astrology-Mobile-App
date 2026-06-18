import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useUser } from '../hooks/useUser';
import { Colors } from '../constants/Colors';
import { Sparkles, Calendar, Clock, MapPin, User as UserIcon, HelpCircle } from 'lucide-react-native';
import { usePremiumModal } from '../components/PremiumModal';

export default function Signup() {
  const { saveProfile } = useUser();
  const { showError } = usePremiumModal();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male'); // Default Gender selection
  const [birthDate, setBirthDate] = useState(''); // YYYY-MM-DD
  const [birthTime, setBirthTime] = useState(''); // HH:MM
  const [birthPlace, setBirthPlace] = useState('');

  const handleSignup = async () => {
    if (!name.trim()) {
      showError('Missing Field', 'Please enter your full name');
      return;
    }

    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
      showError('Invalid Date Format', 'Please enter your birth date in YYYY-MM-DD format (e.g., 1995-10-23)');
      return;
    }

    // Validate time format HH:MM
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(birthTime)) {
      showError('Invalid Time Format', 'Please enter your birth time in HH:MM format (24h clock, e.g., 14:30)');
      return;
    }

    if (!birthPlace.trim()) {
      showError('Missing Field', 'Please enter your birth place');
      return;
    }

    // Save profile details. The hook will automatically redirect the user to the home tabs
    const success = await saveProfile({
      name: name.trim(),
      gender,
      birthDate,
      birthTime,
      birthPlace: birthPlace.trim(),
    });

    if (!success) {
      showError('Error', 'Failed to save profile details. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: Colors.bg }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        {/* Star elements */}
        <View className="absolute top-12 left-10 opacity-30">
          <Text className="text-xl">⭐</Text>
        </View>
        <View className="absolute bottom-20 right-16 opacity-30">
          <Text className="text-xl">🌙</Text>
        </View>

        {/* Header Title */}
        <View className="items-center mb-6">
          <View className="w-16 h-16 rounded-full bg-astro-gold/10 items-center justify-center mb-4 border border-astro-gold/20">
            <Sparkles size={32} color={Colors.gold} />
          </View>
          <Text className="text-white text-3xl font-extrabold text-center tracking-tight">
            Create Cosmic Profile
          </Text>
          <Text className="text-astro-textMuted text-sm text-center mt-2 px-4">
            Enter your details below to map your birth alignments and finalize your signup.
          </Text>
        </View>

        {/* Signup Form */}
        <View style={{ gap: 16 }}>
          {/* Full Name */}
          <View>
            <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
              Full Name
            </Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <UserIcon size={18} color={Colors.gold} style={{ marginRight: 12 }} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Altaf"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="flex-1 text-white text-sm"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Gender Segmented Selection */}
          <View>
            <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
              Gender
            </Text>
            <View style={{ gap: 8 }} className="flex-row">
              {['Male', 'Female', 'Non-binary'].map((option) => {
                const isSelected = gender === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setGender(option)}
                    className={`flex-1 py-3 rounded-xl border items-center justify-center ${
                      isSelected
                        ? 'bg-astro-gold border-astro-gold'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-astro-bg' : 'text-white/60'
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Birth Date */}
          <View>
            <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
              Birth Date (YYYY-MM-DD)
            </Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <Calendar size={18} color={Colors.gold} style={{ marginRight: 12 }} />
              <TextInput
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="YYYY-MM-DD (e.g. 1995-10-23)"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="flex-1 text-white text-sm"
                keyboardType="numeric"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Birth Time */}
          <View>
            <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
              Birth Time (HH:MM - 24h format)
            </Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <Clock size={18} color={Colors.gold} style={{ marginRight: 12 }} />
              <TextInput
                value={birthTime}
                onChangeText={setBirthTime}
                placeholder="HH:MM (e.g. 14:30)"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="flex-1 text-white text-sm"
                keyboardType="numeric"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Birth Place */}
          <View>
            <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
              Birth Place (City, Country)
            </Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <MapPin size={18} color={Colors.gold} style={{ marginRight: 12 }} />
              <TextInput
                value={birthPlace}
                onChangeText={setBirthPlace}
                placeholder="e.g. Mumbai, India"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="flex-1 text-white text-sm"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Complete Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            className="bg-astro-gold rounded-xl py-4 items-center mt-6"
            activeOpacity={0.8}
            style={styles.shadowButton}
          >
            <Text className="text-astro-bg font-extrabold text-base uppercase tracking-wider">
              Complete Profile Signup
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  shadowButton: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
