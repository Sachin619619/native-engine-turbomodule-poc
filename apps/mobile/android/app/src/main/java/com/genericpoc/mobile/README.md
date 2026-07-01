# React Native Android Bridge

## `MainActivity.java`

Starts the React Native app and returns the registered component name.

## `MainApplication.java`

Creates the React Native host and registers `NativeEnginePackage`.

## `NativeEnginePackage.java`

Adds `NativeEngineModule` to the list of native modules available to JavaScript.

## `NativeEngineModule.java`

Receives `NativeEngine.analyze(values)` from JavaScript, converts values into `double[]`, calls the Android wrapper, and resolves the Promise with a React Native map.

Flow:

```text
JavaScript Promise call
  -> NativeEngineModule.java
  -> EngineWrapper.runAnalysis()
```
