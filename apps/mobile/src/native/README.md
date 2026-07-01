# Native Adapter

## `NativeEngineModule.ts`

This file is the small TypeScript adapter around the TurboModule spec.

Flow:

```text
TypeScript API
  -> TurboModuleRegistry NativeEngine
  -> Android NativeEngineModule.java
```

Responsibilities:

- Re-export the result shape returned by native code.
- Expose `analyze(values)` from the generated TurboModule contract.
- Fail early if the native Android TurboModule is not linked.

The result includes the native engine decision, health score, risk score, confidence, anomaly count, reading range, and recommendation.
