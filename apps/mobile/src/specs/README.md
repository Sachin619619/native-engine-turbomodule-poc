# `src/specs`

This folder contains the JavaScript contract that React Native Codegen reads.

`NativeEngine.ts` declares the `NativeEngine` TurboModule shape. During the Android build, React Native Codegen converts this TypeScript contract into the generated Java base class `NativeEngineSpec`. The Android module extends that generated class, so JavaScript and Android stay aligned.
