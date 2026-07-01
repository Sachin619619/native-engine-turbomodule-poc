# `NativeEnginePackage.java`

## Why This File Is Needed

React Native needs a package object to discover custom native modules. In this POC the package extends `TurboReactPackage`, so React Native can lazily create the TurboModule by name.

## What It Owns

- Returns `NativeEngineModule` from `getModule`.
- Provides `ReactModuleInfo` metadata.
- Marks `NativeEngine` as a TurboModule.

## Full Flow

```text
MainApplication.getPackages()
  -> new NativeEnginePackage()
  -> React Native asks getModule("NativeEngine")
  -> new NativeEngineModule(reactContext)
  -> TurboModuleRegistry resolves NativeEngine
```

## Logs

Search Logcat for:

```text
NativeEnginePackage
```

The logs confirm when React Native asks for the TurboModule and when the module instance is created.
