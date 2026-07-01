# `apps/mobile/index.js`

## Why This File Is Needed

This is the React Native app entry file. Android starts the React Native runtime, and the runtime looks for this entry file to know which component should become the app screen.

## Full Flow

```text
Android Activity starts
  -> React Native runtime loads index.js
  -> index.js imports App from src/App.tsx
  -> AppRegistry registers GenericNativeEngineMobile
  -> Android renders that registered component
```

## Important Code

- `AppRegistry.registerComponent(...)` connects the JavaScript app to Android.
- The registered name must match `MainActivity.getMainComponentName()`.

## Logs

This file logs:

```text
[apps/mobile/index.js] Registering GenericNativeEngineMobile root component.
```

That proves the JavaScript bundle started.
