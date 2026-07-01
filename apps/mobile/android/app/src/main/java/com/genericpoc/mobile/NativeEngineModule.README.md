# `NativeEngineModule.java`

## Why This File Is Needed

This file is the Android TurboModule implementation. It receives the generated Codegen call from React Native, converts JavaScript input into Java values, calls the Android wrapper AAR, and resolves the JavaScript promise with the native result.

## What It Owns

- TurboModule name: `NativeEngine`.
- Native method implementation: `analyze`.
- JavaScript array to Java `double[]` conversion.
- Call into `EngineWrapper`.
- Java result to React Native `WritableMap` conversion.
- Promise success/error handling.

## Full Flow

```text
TypeScript TurboModule NativeEngine.analyze(values)
  -> generated NativeEngineSpec
  -> NativeEngineModule.analyze(ReadableArray, Promise)
  -> copy values to double[]
  -> engineWrapper.runAnalysis(nativeValues)
  -> receive EngineResult
  -> build WritableMap
  -> promise.resolve(map)
  -> JavaScript receives AnalyzeResponse
```

## Why It Does Not Contain Algorithm Logic

This file is only the native React Native entry point. Keeping algorithm logic out of it lets the Android wrapper and C++ engine remain reusable.

## Logs

Search Logcat for:

```text
NativeEngineModule
```

The logs show module construction, values received from JavaScript, wrapper call, wrapper result, and promise resolution.
