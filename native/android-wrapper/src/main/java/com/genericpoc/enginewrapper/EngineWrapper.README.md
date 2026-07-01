# `EngineWrapper.java`

## Why This File Is Needed

This is the public Java API of the Android wrapper AAR. Any Android app can call this wrapper without knowing JNI details.

## What It Owns

- Loading the JNI library.
- Calling the native JNI method.
- Receiving raw JSON from C++.
- Parsing JSON into `EngineResult`.

## Full Flow

```text
NativeEngineModule.java
  -> EngineWrapper.runAnalysis(double[])
  -> runAnalysisNative(double[])
  -> native_engine_jni.cpp
  -> raw JSON string returns
  -> JSONObject parses JSON
  -> EngineResult is returned to Android bridge
```

## Why C++ Returns JSON

JSON keeps the JNI boundary simple. JNI returns one string instead of many primitive fields, and Java converts that string into a typed result model.

## Logs

Search Logcat for:

```text
EngineWrapper
```

The logs show JNI library loading, native call start, raw JSON returned by JNI, parsed result, and JSON parse errors.
