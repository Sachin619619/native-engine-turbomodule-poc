# Source README Index

This file lists the hand-written files that have dedicated README notes. Generated build files, `node_modules`, Gradle caches, and compiled binaries are intentionally excluded.

Build and configuration files are explained in `docs/CONFIG_AND_BUILD_FILES.md`.

## React Native Layer

- `apps/mobile/index.js` -> `apps/mobile/index.README.md`
- `apps/mobile/src/index.js` -> `apps/mobile/src/index.README.md`
- `apps/mobile/src/App.tsx` -> `apps/mobile/src/App.README.md`
- `apps/mobile/src/api/EngineApi.ts` -> `apps/mobile/src/api/EngineApi.README.md`
- `apps/mobile/src/specs/NativeEngine.ts` -> `apps/mobile/src/specs/NativeEngine.README.md`
- `apps/mobile/src/native/NativeEngineModule.ts` -> `apps/mobile/src/native/NativeEngineModule.README.md`
- `apps/mobile/src/components/ResultCard.tsx` -> `apps/mobile/src/components/ResultCard.README.md`

## Android App TurboModule

- `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/MainActivity.java` -> `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/MainActivity.README.md`
- `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/MainApplication.java` -> `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/MainApplication.README.md`
- `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEnginePackage.java` -> `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEnginePackage.README.md`
- `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEngineModule.java` -> `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEngineModule.README.md`

## Android Wrapper AAR

- `native/android-wrapper/src/main/java/com/genericpoc/enginewrapper/EngineWrapper.java` -> `native/android-wrapper/src/main/java/com/genericpoc/enginewrapper/EngineWrapper.README.md`
- `native/android-wrapper/src/main/java/com/genericpoc/enginewrapper/EngineResult.java` -> `native/android-wrapper/src/main/java/com/genericpoc/enginewrapper/EngineResult.README.md`
- `native/android-wrapper/src/main/cpp/native_engine_jni.cpp` -> `native/android-wrapper/src/main/cpp/native_engine_jni.README.md`
- `native/android-wrapper/src/main/cpp/CMakeLists.txt` -> `native/android-wrapper/src/main/cpp/CMakeLists.README.md`

## C++ Core Engine

- `native/core-engine/include/generic_engine/engine.h` -> `native/core-engine/include/generic_engine/engine.README.md`
- `native/core-engine/src/engine.cpp` -> `native/core-engine/src/engine.README.md`
- `native/core-engine/src/algorithm/score_algorithm.h` and `score_algorithm.cpp` -> `native/core-engine/src/algorithm/score_algorithm.README.md`
- `native/core-engine/tests/engine_test.cpp` -> `native/core-engine/tests/engine_test.README.md`

## Scripts

- `scripts/android-env.sh` -> `scripts/android-env.README.md`
- `scripts/test-core-engine.sh` -> `scripts/test-core-engine.README.md`
