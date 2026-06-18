# Cosmic Astrology - Release & Build Documentation

This document describes how to build, test, and release **Cosmic Astrology** for both Android (APK/AAB) and iOS using Expo EAS Build and local release bundling.

---

## 🛠️ Prerequisites

Before building the production binaries, ensure you have completed the following:

1. **Install EAS CLI**:
   Install the Expo Application Services command-line tool globally:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo Account**:
   Ensure you are logged into your Expo developer account:
   ```bash
   eas login
   ```

3. **Verify Configuration Files**:
   - [app.json](file:///Users/altaf/.gemini/antigravity/scratch/astrology-app/app.json): Contains package names (`com.altafpathan.cosmicastrology`), version control (`1.0.0`), and icons.
   - [eas.json](file:///Users/altaf/.gemini/antigravity/scratch/astrology-app/eas.json): Configures profiles for `development`, `preview` (APK), and `production` (AAB/iOS).

---

## 🤖 Android Build Guide

### 1. Build Android APK (For Client/Device Testing)
The `preview` profile compiles the app in release mode but outputs a standalone **APK** file that can be side-loaded directly onto any Android device.

```bash
eas build --platform android --profile preview
```

### 2. Build Android AAB (For Play Store Submission)
The `production` profile generates an **Android App Bundle (AAB)** file, optimized for distribution via Google Play Console.

```bash
eas build --platform android --profile production
```

---

## 🍎 iOS Build Guide

### 1. Build iOS Standalone Binary
To generate an iOS release build for App Store distribution or TestFlight testing:

```bash
eas build --platform ios --profile production
```

*Note: You must have an active Apple Developer Program membership. EAS will guide you through connecting your credentials and signing the build automatically.*

### 2. Build iOS Simulator Build (For Testing on Mac)
If you want to compile a simulator-ready release build to test locally on a macOS device, add the simulator configuration to `eas.json` under your profile, or build locally.

---

## 💻 Local Production Testing

If you want to run the application locally in release mode without generating full cloud binaries:

### Android Local Build
```bash
npx expo run:android --variant release
```

### iOS Local Build
```bash
npx expo run:ios --configuration Release
```

---

## ⚡ Performance & Optimization Configurations

The app has been optimized for production release through several adjustments:

1. **Console Log Stripping**:
   During production bundling, the `babel-plugin-transform-remove-console` package automatically strips out all `console.log`, `console.warn`, and `console.debug` statements. This improves JavaScript thread performance significantly.
2. **New Architecture Enabled**:
   React Native's new architecture has been set to `true` in `app.json` (`"newArchEnabled": true`) to exploit the benefits of faster component rendering and modern native module interfaces.
3. **Asset Optimization**:
   All image assets under `assets/images` are compressed. Splash screen and adaptive icons are correctly configured with dark backgrounds to prevent white screen flickers on startup.
