# `EngineResult.java`

## Why This File Is Needed

This file is the Java model returned by the Android wrapper. It gives Java callers a typed result instead of making them handle raw JSON.

## What It Owns

- `healthScore`
- `riskScore`
- `confidence`
- `anomalyCount`
- `minReading`
- `maxReading`
- `decision`
- `recommendation`

## Full Flow

```text
EngineWrapper parses JSONObject
  -> new EngineResult(...)
  -> NativeEngineModule reads getters
  -> WritableMap sent to JavaScript
```

## Why It Is Immutable

All fields are `final`. Once the native engine result is created, later layers can read it but cannot accidentally change it.

## Logs

This file has a `toString()` method so other classes can log the complete result clearly:

```text
EngineResult{healthScore=..., riskScore=..., decision='...'}
```
