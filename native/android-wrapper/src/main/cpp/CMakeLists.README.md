# `CMakeLists.txt`

## Why This File Is Needed

This file tells Android Gradle how to build the native C++ shared library used by JNI.

## What It Owns

- Native target name: `generic_engine_jni`.
- JNI source file.
- Core engine source files.
- Include paths.
- Android log library linking.

## Full Flow

```text
Gradle externalNativeBuild
  -> CMakeLists.txt
  -> compile native_engine_jni.cpp
  -> compile engine.cpp
  -> compile score_algorithm.cpp
  -> link libgeneric_engine_jni.so
  -> Android app loads .so at runtime
```

## Why Core Engine Files Are Compiled Here

The Android `.so` must contain both the JNI bridge and the portable C++ engine. That lets the Java wrapper call a single native library.
