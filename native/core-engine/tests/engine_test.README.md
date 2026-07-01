# `engine_test.cpp`

## Why This File Is Needed

This is a small local smoke test for the C++ engine. It proves the business algorithm works without needing Android, React Native, or an emulator.

## What It Owns

- A fixed sample telemetry array.
- Assertions for expected score range.
- Assertion for anomaly count.
- Assertion for expected decision.
- JSON output for manual inspection.

## Full Flow

```text
npm run test:engine
  -> scripts/test-core-engine.sh
  -> clang++ compiles engine_test.cpp with engine.cpp and score_algorithm.cpp
  -> executable runs
  -> assertions validate expected behavior
  -> JSON result prints
```

## Why It Is Useful

If the app result looks wrong, run this test first. If this passes, the core algorithm is likely fine and the issue is probably in the Android or React Native layers.

## Logs

The test prints `[CoreEngine]` and `[ScoreAlgorithm]` logs because it directly calls the C++ engine.
