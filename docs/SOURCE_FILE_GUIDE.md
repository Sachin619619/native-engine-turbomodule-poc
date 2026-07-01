# Source File Guide

This guide explains what each important source file does.

For deeper file-by-file explanations, open `docs/FILE_README_INDEX.md`. The indexed sidecar README files explain why each source file exists, what it owns, the full flow through that file, and which logs to check.

## Root

### `package.json`

Defines convenience scripts for:

- C++ engine test.
- React Native dependency install.
- React Native Android run.
- Android AAR build.
- Android debug APK build.

### `scripts/android-env.sh`

Exports the Java, Android SDK, and Gradle paths used by Android build scripts.

If a different laptop has different install locations, update this file first.

### `scripts/test-core-engine.sh`

Compiles and runs the C++ engine smoke test using `clang++`.

This validates the lowest native layer without Android tooling.

## React Native App

### `apps/mobile/index.js`

Registers the React Native app entry component.

Flow:

```text
React Native runtime
  -> index.js
  -> App
```

Detailed sidecar README: `apps/mobile/index.README.md`.

### `apps/mobile/src/App.tsx`

Main screen.

Responsibilities:

- Displays generic telemetry readings.
- Handles the "Run Native Inspection" button.
- Calls `analyzeMetrics`.
- Displays the native decision, scores, anomaly evidence, and call path.
- Logs the button click, payload, success, failure, and result rendering with `[RN App]`.

Detailed sidecar README: `apps/mobile/src/App.README.md`.

### `apps/mobile/src/api/EngineApi.ts`

TypeScript API layer.

Responsibilities:

- Validates values before native call.
- Calls the native module wrapper.
- Adds frontend metadata like `scenarioName` and `requestedAt`.

This is the API the UI should use.

Logs request validation and native module calls with `[EngineApi.ts]`.

Detailed sidecar README: `apps/mobile/src/api/EngineApi.README.md`.

### `apps/mobile/src/native/NativeEngineModule.ts`

Typed TypeScript adapter around the TurboModule spec.

Responsibilities:

- Re-exports result type.
- Uses the generated native method contract.
- Exposes `NativeEngine.analyze(values)`.

Logs native module linkage with `[NativeEngineModule.ts]`.

Detailed sidecar README: `apps/mobile/src/native/NativeEngineModule.README.md`.

### `apps/mobile/src/components/ResultCard.tsx`

Small reusable UI component for showing result values.

Detailed sidecar README: `apps/mobile/src/components/ResultCard.README.md`.

## React Native Android Host

### `apps/mobile/android/settings.gradle`

Configures Android project modules.

Includes:

- `:app`
- `:android-engine-wrapper`

The wrapper module points to:

```text
native/android-wrapper
```

### `apps/mobile/android/app/build.gradle`

Build configuration for the Android app.

Dependencies:

- React Native Android runtime.
- Hermes runtime.
- Local Android wrapper module.

### `apps/mobile/android/app/src/main/AndroidManifest.xml`

Declares the Android app, activity, and launcher intent.

### `MainActivity.java`

Defines the React Native activity and app component name.

Detailed sidecar README: `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/MainActivity.README.md`.

### `MainApplication.java`

Registers the React Native package that exposes the native engine module.

Detailed sidecar README: `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/MainApplication.README.md`.

### `NativeEnginePackage.java`

Adds `NativeEngineModule` to React Native.

Detailed sidecar README: `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEnginePackage.README.md`.

### `NativeEngineModule.java`

Bridge between JavaScript and Android wrapper AAR.

Flow:

```text
JS NativeEngine.analyze()
  -> NativeEngineModule.analyze()
  -> EngineWrapper.runAnalysis()
```

Detailed sidecar README: `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEngineModule.README.md`.

## Android Wrapper AAR

### `native/android-wrapper/build.gradle`

Builds the Android library/AAR.

Also configures CMake for JNI.

### `native/android-wrapper/src/main/java/.../EngineWrapper.java`

Public Java API for the Android wrapper.

Responsibilities:

- Loads JNI library.
- Calls native method.
- Parses native JSON result.
- Returns `EngineResult`.

Detailed sidecar README: `native/android-wrapper/src/main/java/com/genericpoc/enginewrapper/EngineWrapper.README.md`.

### `native/android-wrapper/src/main/java/.../EngineResult.java`

Plain Java result model.

Fields:

- healthScore
- riskScore
- confidence
- anomalyCount
- minReading
- maxReading
- decision
- recommendation

Detailed sidecar README: `native/android-wrapper/src/main/java/com/genericpoc/enginewrapper/EngineResult.README.md`.

### `native/android-wrapper/src/main/cpp/CMakeLists.txt`

Native build file.

Compiles:

- JNI bridge.
- C++ engine.
- C++ algorithm.

Detailed sidecar README: `native/android-wrapper/src/main/cpp/CMakeLists.README.md`.

### `native/android-wrapper/src/main/cpp/native_engine_jni.cpp`

JNI bridge.

Responsibilities:

- Converts Java `double[]` to C++ `std::vector<double>`.
- Calls `generic_engine::runEngine`.
- Converts result to JSON string.

Detailed sidecar README: `native/android-wrapper/src/main/cpp/native_engine_jni.README.md`.

## Core Native Library

### `native/core-engine/include/generic_engine/engine.h`

Public C++ engine API.

Defines:

- `EngineInput`
- `EngineResult`
- `runEngine`
- `toJson`

Detailed sidecar README: `native/core-engine/include/generic_engine/engine.README.md`.

### `native/core-engine/src/engine.cpp`

Core engine orchestration.

Responsibilities:

- Calls business algorithm functions.
- Builds final `EngineResult`.
- Serializes result to JSON.

Detailed sidecar README: `native/core-engine/src/engine.README.md`.

### `native/core-engine/src/algorithm/score_algorithm.h`

Business algorithm header.

### `native/core-engine/src/algorithm/score_algorithm.cpp`

Business algorithm implementation.

Responsibilities:

- Calculate weighted health.
- Count low-reading anomalies.
- Calculate risk and confidence.
- Decide whether release is approved or inspection is required.

Detailed sidecar README: `native/core-engine/src/algorithm/score_algorithm.README.md`.

### `native/core-engine/tests/engine_test.cpp`

Local C++ smoke test for the core engine.

Detailed sidecar README: `native/core-engine/tests/engine_test.README.md`.
