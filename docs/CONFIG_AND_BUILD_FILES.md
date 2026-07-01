# Config And Build File Guide

This guide explains the authored setup files that do not need their own source-level sidecar README.

Generated folders such as `build`, `.gradle`, `.cxx`, `node_modules`, and compiled APK/AAR files are excluded because they are recreated by the tools.

## Root Files

### `package.json`

Defines the top-level commands used from the project root:

- `test:engine`: compiles and runs the C++ smoke test.
- `mobile:install`: installs React Native app dependencies.
- `mobile:start`: starts Metro.
- `mobile:android`: runs the Android app.
- `mobile:typecheck`: checks TypeScript.
- `android:build-aar`: builds the Android wrapper AAR.
- `android:build-app`: builds the Android debug APK.

### `.gitignore`

Keeps generated files, dependencies, and local build output out of source control.

## React Native App Config

### `apps/mobile/package.json`

Defines the React Native app package, dependencies, and app-local scripts.

### `apps/mobile/package-lock.json`

Locks JavaScript dependency versions so another laptop installs the same versions.

### `apps/mobile/babel.config.js`

Configures Babel so React Native JavaScript and TypeScript-compatible syntax can be transformed for the mobile runtime.

### `apps/mobile/metro.config.js`

Configures Metro, the React Native JavaScript bundler.

### `apps/mobile/tsconfig.json`

Configures TypeScript checking for the mobile app.

## Android App Config

### `apps/mobile/android/settings.gradle`

Registers Android modules for the React Native app and the local wrapper library.

### `apps/mobile/android/build.gradle`

Top-level Android build configuration for the mobile app project.

### `apps/mobile/android/gradle.properties`

Stores Android Gradle flags such as architecture and runtime options.

### `apps/mobile/android/app/build.gradle`

Builds the Android app module and connects it to React Native plus the local native wrapper dependency.

### `apps/mobile/android/app/src/main/AndroidManifest.xml`

Declares the Android application, launcher activity, and required Android metadata.

### `apps/mobile/android/app/src/main/res/values/styles.xml`

Defines the native Android style used by the host Activity.

## Android Wrapper Config

### `native/android-wrapper/settings.gradle`

Names the Android wrapper Gradle project.

### `native/android-wrapper/build.gradle`

Builds the wrapper as an Android library/AAR and connects Gradle to CMake for JNI compilation.

### `native/android-wrapper/src/main/AndroidManifest.xml`

Minimal manifest required for the Android library module.

### `native/android-wrapper/src/main/cpp/CMakeLists.txt`

Explained in `native/android-wrapper/src/main/cpp/CMakeLists.README.md`.

## Scripts

### `scripts/android-env.sh`

Explained in `scripts/android-env.README.md`.

### `scripts/test-core-engine.sh`

Explained in `scripts/test-core-engine.README.md`.
