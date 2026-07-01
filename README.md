# Native Engine TurboModule POC

This is a generic sample POC for a React Native New Architecture native-engine stack.

It demonstrates the same business calculation as the legacy native-module sample, but the React Native to Android entry point is a TurboModule.

## Layers

```text
React Native app
  -> TypeScript API
  -> TurboModule typed spec
  -> Android TurboModule implementation
  -> Android wrapper AAR
  -> JNI
  -> C/C++ core engine
  -> Business algorithm
```

## What the POC Does

The React Native screen sends generic device telemetry to the native engine.

The native engine returns:

- release decision
- health score
- risk score
- confidence
- anomaly count
- recommendation

## UI Screenshots

- `screenshots/turbomodule-initial.png`: initial mobile screen with telemetry inputs.
- `screenshots/turbomodule-result.png`: result screen after the native inspection returns from the C++ engine.

## What Makes This The TurboModule Version

- `newArchEnabled=true` in `apps/mobile/android/gradle.properties`.
- `apps/mobile/package.json` has `codegenConfig`.
- `apps/mobile/src/specs/NativeEngine.ts` is the Codegen contract.
- Android `NativeEngineModule.java` extends generated `NativeEngineSpec`.
- Android `NativeEnginePackage.java` extends `TurboReactPackage`.

## Folder Guide

- `apps/mobile`: React Native app, TypeScript API, TurboModule spec, and Android host app.
- `apps/mobile/src/specs`: Codegen contract for the TurboModule.
- `apps/mobile/src/api`: TypeScript API layer used by the UI.
- `apps/mobile/src/native`: small TypeScript adapter around the TurboModule spec.
- `apps/mobile/android`: Android app and TurboModule implementation.
- `native/android-wrapper`: Android library module that builds the AAR and JNI library.
- `native/core-engine`: portable C++ engine and business algorithm.
- `docs`: architecture and flow documentation.
- `scripts`: local helper scripts.

## Install and Build

Install JavaScript dependencies:

```bash
npm run mobile:install
```

Build the reusable Android AAR:

```bash
npm run android:build-aar
```

Build the React Native Android debug APK:

```bash
npm run android:build-app
```

Run on a connected Android emulator/device:

```bash
npm run mobile:android
```

Validate the portable C++ engine layer:

```bash
npm run test:engine
```

## Android Tooling

The Android scripts source `scripts/android-env.sh`.

That file sets:

- `JAVA_HOME`
- `ANDROID_HOME`
- `ANDROID_SDK_ROOT`
- `GRADLE_BIN`

If another laptop has different install paths, update only `scripts/android-env.sh` or pass override variables.

## Main Documentation

- `docs/TURBOMODULE_FLOW.md`: simple explanation of the TurboModule call flow.
- `docs/BRIDGE_COMPARISON.md`: classic native bridge vs TurboModule implementation comparison.
- `docs/ARCHITECTURE.md`: layer explanation.
- `docs/CALL_FLOW.md`: exact runtime call flow.
- `docs/BUILD_AND_RUN.md`: setup and build instructions.
- `docs/API_CONTRACT.md`: input/output contract.
- `docs/LOGGING_GUIDE.md`: how to follow the request through logs.
- `docs/FILE_README_INDEX.md`: source files that have dedicated README notes.

## How To Understand The Code Quickly

1. Read `docs/TURBOMODULE_FLOW.md`.
2. Open `apps/mobile/src/specs/NativeEngine.ts`.
3. Open `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEngineModule.java`.
4. Follow the flow into `native/android-wrapper` and `native/core-engine`.
