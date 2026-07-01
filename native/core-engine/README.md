# Core Native Library

This folder contains the portable C++ engine.

The current demo is an edge quality inspection engine. It receives generic telemetry readings and returns a release decision, health score, risk score, confidence, anomaly count, and recommendation.

## Files

- `include/generic_engine/engine.h`: public C++ API exposed to JNI.
- `src/engine.cpp`: converts raw input into an engine result.
- `src/algorithm/score_algorithm.h`: business algorithm function declarations.
- `src/algorithm/score_algorithm.cpp`: business scoring algorithm.
- `tests/engine_test.cpp`: local C++ smoke test.

## Flow

```text
JNI
  -> runEngine(input)
  -> score_algorithm functions
  -> EngineResult
  -> JSON string for Android wrapper
```

## Local Test

From the POC root:

```bash
npm run test:engine
```
