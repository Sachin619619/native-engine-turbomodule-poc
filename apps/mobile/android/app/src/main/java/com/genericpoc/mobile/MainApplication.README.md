# `MainApplication.java`

## Why This File Is Needed

This file configures the React Native host for the Android app. It is where the app registers custom native packages.

## What It Owns

- React Native host setup.
- Developer support flag.
- JavaScript entry module name.
- New Architecture and Hermes flags.
- Native package registration.
- SoLoader initialization for native libraries.

## Full Flow

```text
Android Application starts
  -> onCreate()
  -> SoLoader initializes native library loading
  -> ReactNativeHost is requested
  -> getPackages()
  -> NativeEnginePackage is added
  -> NativeEngineModule becomes available to JavaScript
```

## Why `NativeEnginePackage` Is Added Here

React Native does not automatically know about custom Java modules. Adding `NativeEnginePackage` here exposes the native engine module to JavaScript.

## Logs

Search Logcat for:

```text
MainApplication
```

The logs show startup, package registration, JS entry lookup, architecture flags, and SoLoader initialization.
