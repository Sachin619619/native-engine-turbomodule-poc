# Android Host App

This folder contains the Android part of the React Native app.

## Main Files

- `settings.gradle`: includes the app and local Android wrapper module.
- `app/build.gradle`: Android app build configuration.
- `MainApplication.java`: registers the React Native native module package.
- `NativeEnginePackage.java`: exposes native modules to React Native.
- `NativeEngineModule.java`: calls the Android wrapper AAR.

## Flow

```text
React Native JS
  -> NativeEngineModule.java
  -> EngineWrapper from AAR
```

