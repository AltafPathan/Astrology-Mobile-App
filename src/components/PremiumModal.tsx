import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Check, X, HelpCircle } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

type ModalType = 'success' | 'error' | 'confirm';

interface ModalOptions {
  type: ModalType;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  showSuccess: (title: string, description: string, confirmText?: string, onConfirm?: () => void) => void;
  showError: (title: string, description: string, confirmText?: string, onConfirm?: () => void) => void;
  showConfirm: (title: string, description: string, onConfirm: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string) => void;
  hideModal: () => void;
}

const PremiumModalContext = createContext<ModalContextType | undefined>(undefined);

function PremiumModalContent({ options, onClose }: { options: ModalOptions; onClose: () => void }) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);
  const shakeOffset = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 200 });

    if (options.type === 'error') {
      shakeOffset.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [options, scale, opacity, shakeOffset]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateX: shakeOffset.value }
      ],
    };
  });

  const handleConfirm = () => {
    opacity.value = withTiming(0, { duration: 150 });
    scale.value = withTiming(0.85, { duration: 150 }, () => {
      runOnJS(onClose)();
      if (options.onConfirm) {
        runOnJS(options.onConfirm)();
      }
    });
  };

  const handleCancel = () => {
    opacity.value = withTiming(0, { duration: 150 });
    scale.value = withTiming(0.85, { duration: 150 }, () => {
      runOnJS(onClose)();
      if (options.onCancel) {
        runOnJS(options.onCancel)();
      }
    });
  };

  const renderIcon = () => {
    if (options.type === 'success') {
      return (
        <View className="w-14 h-14 rounded-full bg-green-500/10 items-center justify-center border-2 border-green-500 mb-4 shadow-sm">
          <Check size={28} color="#4CAF50" />
        </View>
      );
    }
    if (options.type === 'error') {
      return (
        <View className="w-14 h-14 rounded-full bg-red-500/10 items-center justify-center border-2 border-red-500 mb-4 shadow-sm">
          <X size={28} color="#FF5A5A" />
        </View>
      );
    }
    return (
      <View className="w-14 h-14 rounded-full bg-astro-gold/10 items-center justify-center border-2 border-astro-gold mb-4 shadow-sm">
        <HelpCircle size={28} color={Colors.gold} />
      </View>
    );
  };

  return (
    <View style={styles.backdrop}>
      <Animated.View
        style={[animatedStyle, styles.card]}
        className="bg-astro-bg border border-white/10 p-6 items-center"
      >
        {renderIcon()}
        
        <Text className="text-white text-base font-black text-center tracking-tight mb-2">
          {options.title}
        </Text>
        
        <Text className="text-white/60 text-xs text-center leading-relaxed mb-6 px-2">
          {options.description}
        </Text>

        {options.type === 'confirm' ? (
          <View className="flex-row w-full animate-fade-in" style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-1 border border-white/20 py-3 rounded-2xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-xs uppercase tracking-wider">
                {options.cancelText || 'Cancel'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              className="flex-1 bg-astro-gold py-3 rounded-2xl items-center"
              style={styles.goldBtnShadow}
              activeOpacity={0.8}
            >
              <Text className="text-astro-bg font-extrabold text-xs uppercase tracking-wider">
                {options.confirmText || 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleConfirm}
            className={`w-full py-3.5 rounded-2xl items-center ${
              options.type === 'error' ? 'bg-red-500' : 'bg-astro-gold'
            }`}
            style={options.type === 'error' ? {} : styles.goldBtnShadow}
            activeOpacity={0.8}
          >
            <Text
              className={`font-extrabold text-xs uppercase tracking-wider ${
                options.type === 'error' ? 'text-white' : 'text-astro-bg'
              }`}
            >
              {options.confirmText || 'OK'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

export const PremiumModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const showSuccess = (title: string, description: string, confirmText?: string, onConfirm?: () => void) => {
    setModalOptions({ type: 'success', title, description, confirmText, onConfirm });
  };

  const showError = (title: string, description: string, confirmText?: string, onConfirm?: () => void) => {
    setModalOptions({ type: 'error', title, description, confirmText, onConfirm });
  };

  const showConfirm = (
    title: string,
    description: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => {
    setModalOptions({ type: 'confirm', title, description, onConfirm, onCancel, confirmText, cancelText });
  };

  const hideModal = () => {
    setModalOptions(null);
  };

  return (
    <PremiumModalContext.Provider value={{ showSuccess, showError, showConfirm, hideModal }}>
      {children}
      <Modal
        transparent
        visible={!!modalOptions}
        animationType="none"
        onRequestClose={hideModal}
      >
        {modalOptions && (
          <PremiumModalContent
            options={modalOptions}
            onClose={hideModal}
          />
        )}
      </Modal>
    </PremiumModalContext.Provider>
  );
};

export const usePremiumModal = () => {
  const context = useContext(PremiumModalContext);
  if (context === undefined) {
    throw new Error('usePremiumModal must be used within a PremiumModalProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 6, 29, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
  },
  goldBtnShadow: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
});
