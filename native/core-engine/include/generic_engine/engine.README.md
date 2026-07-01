# `engine.h`

## Why This File Is Needed

This is the public C++ API for the portable engine. Both JNI and local tests include this header.

## What It Owns

- `EngineInput`: input values sent into the engine.
- `EngineResult`: output decision and scores.
- `runEngine(...)`: main calculation function.
- `toJson(...)`: serialization function used by JNI.

## Full Flow

```text
native_engine_jni.cpp or engine_test.cpp
  -> include generic_engine/engine.h
  -> call runEngine(input)
  -> receive EngineResult
  -> optionally call toJson(result)
```

## Why This Header Matters

The header is the contract for native callers. If the engine is reused in another platform later, this is the file that caller will depend on.

## Logging

The header itself does not log. Logging happens in `engine.cpp` and `score_algorithm.cpp`.
