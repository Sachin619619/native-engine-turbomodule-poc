# Logging Guide

This POC has logs at every important boundary so you can prove how one button tap travels through the full stack.

## Main Runtime Log Flow

When the user taps `Run Native Inspection`, follow these tags in order:

```text
[RN App]
[EngineApi.ts]
[NativeEngineModule.ts]
NativeEngineModule
EngineWrapper
NativeEngineJNI
[CoreEngine]
[ScoreAlgorithm]
```

## What Each Tag Means

| Tag | Layer | What it proves |
| --- | --- | --- |
| `[RN App]` | React Native UI | User pressed the button, UI prepared telemetry, UI received the result. |
| `[EngineApi.ts]` | TypeScript API | Request validation happened before native code was called. |
| `[NativeEngineModule.ts]` | TypeScript native wrapper | The Android native module is linked into React Native. |
| `NativeEngineModule` | Android app bridge | JavaScript crossed into Android Java code. |
| `EngineWrapper` | Android wrapper AAR | The reusable Android wrapper loaded JNI and parsed the native JSON. |
| `NativeEngineJNI` | JNI | Java `double[]` was converted to C++ values and C++ was called. |
| `[CoreEngine]` | C++ orchestration | The portable engine calculated and serialized the final result. |
| `[ScoreAlgorithm]` | Business algorithm | The score, risk, confidence, anomaly, decision, and recommendation logic ran. |

## Android Logcat Command

Run the app on an emulator/device, tap the button, then run:

```bash
adb logcat -d | grep -E "RN App|EngineApi|NativeEngineModule|EngineWrapper|NativeEngineJNI|CoreEngine|ScoreAlgorithm"
```

For continuous logs:

```bash
adb logcat | grep -E "RN App|EngineApi|NativeEngineModule|EngineWrapper|NativeEngineJNI|CoreEngine|ScoreAlgorithm"
```

## Local C++ Test Logs

The portable engine can be tested without Android:

```bash
npm run test:engine
```

That test prints `[CoreEngine]` and `[ScoreAlgorithm]` logs. This is useful when you want to explain only the C++ algorithm without running the mobile app.

## Expected Story in Logs

1. UI logs that the button was pressed.
2. TypeScript API logs validation.
3. TypeScript native wrapper confirms the native module exists.
4. Android bridge logs each value it received.
5. Android wrapper logs the JNI library and raw JSON.
6. JNI logs each copied value and the JSON returned from C++.
7. C++ logs the calculations.
8. UI logs the final result render.
