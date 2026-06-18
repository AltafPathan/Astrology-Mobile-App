import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateAstrologicalProfile, AstrologicalProfile } from '../services/astrology';

const PROFILE_KEY = '@astro_user_profile';
const SESSION_KEY = '@astro_user_session';

export interface UserProfileData {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export interface UserSession {
  mobileNumber: string;
}

interface UserContextType {
  session: UserSession | null;
  profile: AstrologicalProfile | null;
  loading: boolean;
  login: (mobileNumber: string) => Promise<boolean>;
  saveProfile: (data: UserProfileData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearProfile: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<AstrologicalProfile | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load session
      const sessionVal = await AsyncStorage.getItem(SESSION_KEY);
      const activeSession = sessionVal ? (JSON.parse(sessionVal) as UserSession) : null;
      setSession(activeSession);

      // Load profile if session exists
      if (activeSession) {
        const profileVal = await AsyncStorage.getItem(PROFILE_KEY);
        if (profileVal != null) {
          const data: UserProfileData = JSON.parse(profileVal);
          const derivedProfile = calculateAstrologicalProfile(
            data.name,
            data.gender,
            data.birthDate,
            data.birthTime,
            data.birthPlace
          );
          setProfile(derivedProfile);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.error('Failed to load user auth/profile data', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (mobileNumber: string) => {
    try {
      setLoading(true);
      const newSession: UserSession = { mobileNumber };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      
      // Check if profile exists for this session
      const profileVal = await AsyncStorage.getItem(PROFILE_KEY);
      if (profileVal) {
        const data: UserProfileData = JSON.parse(profileVal);
        const derivedProfile = calculateAstrologicalProfile(
          data.name,
          data.gender,
          data.birthDate,
          data.birthTime,
          data.birthPlace
        );
        setProfile(derivedProfile);
      }
      return true;
    } catch (e) {
      console.error('Failed to login session', e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (data: UserProfileData) => {
    try {
      setLoading(true);
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(PROFILE_KEY, jsonValue);
      
      const derivedProfile = calculateAstrologicalProfile(
        data.name,
        data.gender,
        data.birthDate,
        data.birthTime,
        data.birthPlace
      );
      setProfile(derivedProfile);
      return true;
    } catch (e) {
      console.error('Failed to save profile details', e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem(SESSION_KEY);
      await AsyncStorage.removeItem(PROFILE_KEY);
      setSession(null);
      setProfile(null);
    } catch (e) {
      console.error('Failed to logout session', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        session,
        profile,
        loading,
        login,
        saveProfile,
        logout,
        clearProfile: logout,
        refreshUser: loadUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
