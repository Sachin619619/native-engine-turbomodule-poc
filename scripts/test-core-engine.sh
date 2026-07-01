#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/build/core-engine-test"

mkdir -p "$BUILD_DIR"

clang++ \
  -std=c++17 \
  -I"$ROOT_DIR/native/core-engine/include" \
  -I"$ROOT_DIR/native/core-engine/src/algorithm" \
  "$ROOT_DIR/native/core-engine/tests/engine_test.cpp" \
  "$ROOT_DIR/native/core-engine/src/engine.cpp" \
  "$ROOT_DIR/native/core-engine/src/algorithm/score_algorithm.cpp" \
  -o "$BUILD_DIR/engine_test"

"$BUILD_DIR/engine_test"

