# Runtime Call Flow

## Button Click Flow

```text
User taps "Run Native Inspection"
  -> apps/mobile/src/App.tsx logs [RN App]
  -> analyzeMetrics()
  -> apps/mobile/src/api/EngineApi.ts logs [EngineApi.ts]
  -> NativeEngine.analyze()
  -> apps/mobile/src/specs/NativeEngine.ts logs [NativeEngine TurboModule Spec]
  -> TurboModuleRegistry resolves NativeEngine
  -> generated Android NativeEngineSpec
  -> NativeEngineModule.analyze()
  -> apps/mobile/android/.../NativeEngineModule.java logs NativeEngineModule
  -> EngineWrapper.runAnalysis()
  -> native/android-wrapper/.../EngineWrapper.java logs EngineWrapper
  -> runAnalysisNative()
  -> native/android-wrapper/src/main/cpp/native_engine_jni.cpp logs NativeEngineJNI
  -> generic_engine::runEngine()
  -> native/core-engine/src/engine.cpp logs [CoreEngine]
  -> score_algorithm.cpp logs [ScoreAlgorithm]
  -> result travels back to React Native UI
```

## Data Direction

Input:

```text
number[] from React Native
  -> TurboModule ReadableArray
  -> Java double[]
  -> C++ std::vector<double>
```

Output:

```text
C++ EngineResult with decision, scores, anomalies, and recommendation
  -> JSON string from JNI
  -> Java EngineResult
  -> React Native WritableMap
  -> TypeScript AnalyzeResponse
  -> UI cards
```

## Why the Layers Are Separate

- UI can change without touching C++.
- The TurboModule spec gives a typed JavaScript-to-native contract.
- AAR can be reused outside React Native.
- JNI is isolated to one file.
- Core engine can be tested without Android.
- Business algorithm is portable and independently readable.

## How To Prove The Flow

On Android:

```bash
adb logcat | grep -E "RN App|EngineApi|NativeEngine|EngineWrapper|NativeEngineJNI|CoreEngine|ScoreAlgorithm"
```

For the portable C++ layer only:

```bash
npm run test:engine
```
