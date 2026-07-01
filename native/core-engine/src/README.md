# Core Engine Source

## `engine.cpp`

Coordinates the native execution.

Flow:

```text
EngineInput
  -> inspection scoring algorithm
  -> EngineResult
  -> JSON
```

The file depends on the algorithm layer but has no Android or React Native dependency.
