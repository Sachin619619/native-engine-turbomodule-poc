# Android Wrapper Java API

## `EngineWrapper.java`

Public Java entrypoint for the Android wrapper AAR.

Responsibilities:

- Load the JNI library with `System.loadLibrary`.
- Call the private native method.
- Parse the JSON returned from C++.
- Return an `EngineResult`.

## `EngineResult.java`

Simple immutable Java result model.

Fields:

- `healthScore`
- `riskScore`
- `confidence`
- `anomalyCount`
- `minReading`
- `maxReading`
- `decision`
- `recommendation`
