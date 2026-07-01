# `NativeEngine.ts`

This is the TurboModule contract.

Flow:

1. The app imports this file from the TypeScript API layer.
2. `TurboModuleRegistry.getEnforcing("NativeEngine")` asks React Native for the native module.
3. React Native Codegen uses the `Spec` interface to generate `NativeEngineSpec` for Android.
4. `NativeEngineModule.java` extends that generated class and implements `analyze`.

Why this file is needed:

- It is the typed boundary between React Native JavaScript and Android.
- It removes the loose `NativeModules.NativeEngine` lookup used by older native-module examples.
- It lets the Android build fail early if the TypeScript contract and native implementation drift.
