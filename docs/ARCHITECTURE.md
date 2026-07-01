# Architecture

## Layered Structure

```text
1. React Native UI
2. TypeScript API
3. TurboModule typed spec
4. Android TurboModule implementation
5. Android wrapper AAR
6. JNI bridge
7. C/C++ core engine
8. Business algorithm
```

## 1. React Native UI

Location: `apps/mobile/src/App.tsx`

Responsibility:

- Shows the screen.
- Handles button click.
- Displays the runtime call tracker.
- Calls the TypeScript API.
- Displays the native result.

## 2. TypeScript API

Location: `apps/mobile/src/api/EngineApi.ts`

Responsibility:

- Validates frontend input.
- Calls the typed native adapter.
- Returns a UI-friendly response.

## 3. TurboModule Typed Spec

Location: `apps/mobile/src/specs/NativeEngine.ts`

Responsibility:

- Defines the JavaScript contract for Codegen.
- Resolves `NativeEngine` through `TurboModuleRegistry`.
- Produces the generated Android base class during build.

## 4. Android TurboModule Implementation

Location: `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEngineModule.java`

Responsibility:

- Extends generated `NativeEngineSpec`.
- Receives calls from JavaScript through the TurboModule path.
- Converts React Native arrays into Java arrays.
- Calls the Android wrapper AAR.
- Converts native results back into a React Native map.

## 5. Android Wrapper AAR

Location: `native/android-wrapper`

Responsibility:

- Packages Java wrapper code and JNI library.
- Exposes `EngineWrapper.runAnalysis`.
- Can be reused by Android apps outside React Native.

## 6. JNI

Location: `native/android-wrapper/src/main/cpp/native_engine_jni.cpp`

Responsibility:

- Receives Java calls.
- Converts Java arrays to C++ vectors.
- Calls the C++ engine.
- Converts C++ result to JSON string.

## 7. C/C++ Core Engine

Location: `native/core-engine`

Responsibility:

- Owns portable native business execution.
- Has no Android or React Native dependency.

## 8. Business Algorithm

Location: `native/core-engine/src/algorithm/score_algorithm.cpp`

Responsibility:

- Calculates weighted health.
- Counts low-reading anomalies.
- Calculates risk and confidence.
- Returns a release or inspection decision.
