# TurboModule Flow

## What This POC Shows

This POC shows how React Native can call Android native code through a TurboModule, then continue into an Android wrapper AAR, JNI, and a C++ engine.

## Simple Flow

```text
React Native screen
  -> TypeScript API
  -> TurboModule spec
  -> Codegen-generated Android spec
  -> Android TurboModule implementation
  -> Android wrapper AAR
  -> JNI
  -> C++ engine
  -> business algorithm
```

## What Happens During Build

1. React Native reads `apps/mobile/package.json`.
2. It finds `codegenConfig`.
3. It scans `apps/mobile/src/specs`.
4. It reads `NativeEngine.ts`.
5. It generates Android native spec code.
6. `NativeEngineModule.java` extends that generated spec.

## What Happens During Runtime

1. User taps `Run Native Inspection`.
2. UI sends an array of metric values to `EngineApi.ts`.
3. `EngineApi.ts` validates the values.
4. `NativeEngine.analyze(values)` calls the TurboModule.
5. Android receives the call in `NativeEngineModule.java`.
6. Android wrapper calls JNI.
7. JNI calls the C++ engine.
8. C++ returns scores and decision.
9. Result travels back to the React Native screen.

## Why This Is Different From The Classic Bridge POC

Classic bridge:

```text
JavaScript -> NativeModules.NativeEngine -> Android module
```

TurboModule:

```text
JavaScript -> typed spec -> Codegen -> TurboModuleRegistry -> Android module
```

The important difference is the typed generated contract between JavaScript and Android.

## How To Prove It In This Repo

- `apps/mobile/src/specs/NativeEngine.ts` uses `TurboModuleRegistry`.
- `apps/mobile/package.json` contains `codegenConfig`.
- `apps/mobile/android/gradle.properties` has `newArchEnabled=true`.
- `NativeEngineModule.java` extends `NativeEngineSpec`.
- `NativeEnginePackage.java` extends `TurboReactPackage`.
