# Scripts

## `android-env.sh`

Sets the Android build environment for this POC.

The root npm Android scripts source this file before running Gradle, so Java, Android SDK, and Gradle paths are controlled in one place.

## `test-core-engine.sh`

Compiles the portable C++ engine with `clang++` and runs the smoke test.

Use this when you want to verify the business algorithm without Android or React Native.
