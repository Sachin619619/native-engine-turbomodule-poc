# JNI Layer

## `CMakeLists.txt`

Compiles the JNI bridge and links the portable C++ core engine into the Android shared library.

## `native_engine_jni.cpp`

JNI bridge between Java and C++.

Flow:

```text
EngineWrapper.runAnalysisNative(double[])
  -> native_engine_jni.cpp
  -> generic_engine::runEngine()
  -> JSON string
```

Responsibilities:

- Convert Java `double[]` into C++ `std::vector<double>`.
- Call the portable engine.
- Convert the engine result into a Java string.
