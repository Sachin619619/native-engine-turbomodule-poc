# `test-core-engine.sh`

## Why This File Is Needed

This script compiles and runs the portable C++ engine test without Android.

## What It Owns

- Build output directory creation.
- `clang++` compile command.
- Include path for `engine.h`.
- Source files needed by the test.
- Running the compiled executable.

## Full Flow

```text
npm run test:engine
  -> bash scripts/test-core-engine.sh
  -> compile C++ test binary
  -> run build/core-engine-test/engine_test
  -> print logs and JSON result
```

## Why It Matters

It gives a fast proof that the lowest native layer works before debugging Android or React Native.
