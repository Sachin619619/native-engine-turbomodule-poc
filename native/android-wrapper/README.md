# Android Wrapper AAR

This folder builds the Android library wrapper that packages JNI and the C++ engine into an AAR.

## Files

- `build.gradle`: Android library build configuration.
- `settings.gradle`: standalone Gradle settings for building only this AAR.
- `src/main/java/com/genericpoc/enginewrapper/EngineWrapper.java`: Java wrapper API used by Android/RN code.
- `src/main/java/com/genericpoc/enginewrapper/EngineResult.java`: Java result model.
- `src/main/cpp/native_engine_jni.cpp`: JNI bridge from Java to C++.
- `src/main/cpp/CMakeLists.txt`: CMake build that compiles JNI plus the core C++ engine.

## Flow

```text
React Native Java module
  -> EngineWrapper.runAnalysis(values)
  -> runAnalysisNative(values)
  -> native_engine_jni.cpp
  -> generic_engine::runEngine
  -> EngineResult
  -> JSON
  -> Java EngineResult
```

## Build AAR

Requires Android Studio, JDK, Android SDK, and Gradle.

```bash
npm run android:build-aar
```

Expected output:

```text
native/android-wrapper/build/outputs/aar/AndroidEngineWrapper-release.aar
```
