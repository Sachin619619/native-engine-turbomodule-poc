# `android-env.sh`

## Why This File Is Needed

Android build tools can be installed in different locations on different laptops. This script keeps those paths in one place.

## What It Owns

- `JAVA_HOME`
- `ANDROID_HOME`
- `ANDROID_SDK_ROOT`
- `GRADLE_BIN`
- Android tool paths added to `PATH`

## Full Flow

```text
npm run android:build-aar or npm run android:build-app
  -> source scripts/android-env.sh
  -> environment variables are exported
  -> Gradle uses those paths
```

## When To Edit

Edit this file if another laptop has a different JDK, Android SDK, or Gradle location.
