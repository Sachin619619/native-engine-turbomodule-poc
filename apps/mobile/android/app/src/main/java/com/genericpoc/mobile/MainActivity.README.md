# `MainActivity.java`

## Why This File Is Needed

This is the Android Activity that hosts the React Native app. Android launches this Activity first.

## What It Owns

- The root React Native component name.
- The connection between Android launcher and JavaScript UI.

## Full Flow

```text
Android launcher
  -> MainActivity
  -> getMainComponentName()
  -> React Native loads GenericNativeEngineMobile
  -> apps/mobile/index.js registers the same name
```

## Important Rule

The string returned by `getMainComponentName()` must match the string in `AppRegistry.registerComponent(...)`.

## Logs

Search Logcat for:

```text
MainActivity
```

It logs when React Native asks Android for the root component name.
