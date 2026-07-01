# React Native App

This folder contains the mobile UI, TypeScript API layer, TurboModule spec, and Android host app.

## Main Files

- `src/App.tsx`: screen, button click, and visual runtime tracker.
- `src/api/EngineApi.ts`: TypeScript API used by the UI.
- `src/specs/NativeEngine.ts`: TurboModule Codegen contract.
- `src/native/NativeEngineModule.ts`: small adapter around the TurboModule spec.
- `src/components/ResultCard.tsx`: small result display component.
- `android`: Android host app and Java TurboModule implementation.

## Flow

```text
App.tsx
  -> EngineApi.ts
  -> src/specs/NativeEngine.ts
  -> Android NativeEngineModule.java
```

## Why `src/specs` Exists

React Native Codegen reads `src/specs/NativeEngine.ts` during Android build and generates the Java base class used by the Android module. This keeps JavaScript and Android method signatures aligned.
