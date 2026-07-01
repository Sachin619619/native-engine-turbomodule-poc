# `apps/mobile/src/native/NativeEngineModule.ts`

## Why This File Is Needed

This file is the small TypeScript adapter around the TurboModule spec. The rest of the app imports from this file instead of importing the generated contract directly.

## What It Owns

- Imports the `NativeEngine` TurboModule from `src/specs/NativeEngine.ts`.
- Re-exports the `NativeEngineResult` type for the API layer.
- Fails early if React Native cannot resolve the TurboModule.

## Full Flow

```text
EngineApi.ts
  -> NativeEngine.analyze(values)
  -> TurboModuleRegistry NativeEngine
  -> Android NativeEngineModule.java
```

## Why The Runtime Check Exists

If Codegen or Android registration is broken, the app fails with a clear message instead of failing later with a confusing undefined method error.

## Logs

Search Metro logs for:

```text
[NativeEngineModule.ts]
[NativeEngine TurboModule Spec]
```
