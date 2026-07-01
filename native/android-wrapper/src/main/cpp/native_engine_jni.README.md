# `native_engine_jni.cpp`

## Why This File Is Needed

JNI is the bridge between Java and C++. This file is the only place where Java-native conversion happens.

## What It Owns

- Receives Java `double[]`.
- Copies it into C++ `std::vector<double>`.
- Calls the portable C++ engine.
- Serializes the C++ result to JSON.
- Returns a Java string.

## Full Flow

```text
EngineWrapper.runAnalysisNative(double[])
  -> JNI function receives jdoubleArray
  -> GetDoubleArrayElements
  -> copy values into std::vector<double>
  -> generic_engine::runEngine({ values })
  -> generic_engine::toJson(result)
  -> NewStringUTF(json)
  -> EngineWrapper receives raw JSON
```

## Why JNI Is Isolated Here

JNI code is easy to make complex. Keeping it in one file makes the architecture easier to explain and reduces risk when the C++ algorithm changes.

## Logs

Search Logcat for:

```text
NativeEngineJNI
```

The logs show the number of values, each copied value, the call to C++ core, and the JSON returned by C++.
