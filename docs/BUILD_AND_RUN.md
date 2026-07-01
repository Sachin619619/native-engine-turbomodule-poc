# Build and Run

## Core Engine Test

This validates the portable C++ layer.

```bash
npm run test:engine
```

Expected output:

```json
{"healthScore":79.14,"riskScore":39.01,"confidence":88.40,"anomalyCount":1,"minReading":63.00,"maxReading":92.00,"decision":"Inspect Before Release","recommendation":"Run focused checks on the low-scoring sensor channels."}
```

## Android Requirements

Install:

- JDK 17.
- Node.js and npm.
- Android SDK command-line tools or Android Studio.
- Android SDK platform 35.
- Android build tools 35.0.0.
- Android NDK 27.
- CMake.
- Gradle 8.

This POC uses `scripts/android-env.sh` so the build does not depend on a globally configured terminal.

Default local paths in that file:

```bash
JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
GRADLE_BIN=/opt/homebrew/opt/gradle@8/bin/gradle
```

If your laptop uses another location, edit `scripts/android-env.sh`.

## Install Mobile Dependencies

```bash
npm run mobile:install
```

## Build Android AAR

```bash
npm run android:build-aar
```

Expected output:

```text
native/android-wrapper/build/outputs/aar/AndroidEngineWrapper-release.aar
```

## Build Android Debug APK

```bash
npm run android:build-app
```

Expected output:

```text
apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

## Run React Native App

Start Metro:

```bash
npm run mobile:start
```

In another terminal, install and run the app on a connected Android device or emulator:

```bash
npm run mobile:android
```

## Verified Commands

These commands should be used after installing the required tooling:

```bash
npm run test:engine
npm run mobile:typecheck
npm run android:build-aar
npm run android:build-app
```
