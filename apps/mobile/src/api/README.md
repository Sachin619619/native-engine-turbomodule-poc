# API Layer

## `EngineApi.ts`

This is the UI-facing TypeScript API.

Flow:

```text
App.tsx
  -> analyzeMetrics()
  -> NativeEngine.analyze()
```

Responsibilities:

- Validate input before native execution.
- Hide the React Native native-module details from the UI.
- Add frontend metadata such as `scenarioName` and `requestedAt`.

When a real backend or remote configuration is added later, this is the first frontend layer to update.

Current demo:

- Receives generic telemetry readings from `App.tsx`.
- Ensures each reading is between `0` and `100`.
- Calls the native engine for the actual inspection decision.
