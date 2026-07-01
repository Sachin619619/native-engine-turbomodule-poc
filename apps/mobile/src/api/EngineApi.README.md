# `apps/mobile/src/api/EngineApi.ts`

## Why This File Is Needed

This file is the TypeScript API boundary for the React Native app. The UI should call this file, not the native module directly.

## What It Owns

- Request type: `AnalyzeRequest`.
- Response type: `AnalyzeResponse`.
- Input validation.
- The call to the native engine wrapper.
- UI-friendly metadata such as `scenarioName` and `requestedAt`.

## Full Flow

```text
App.tsx
  -> analyzeMetrics(request)
  -> validateRequest(request)
  -> NativeEngine.analyze(values)
  -> receive NativeEngineResult
  -> add scenarioName and requestedAt
  -> return AnalyzeResponse to App.tsx
```

## Why This Layer Helps

If a real backend or different native module is added later, the UI can stay almost unchanged. This file becomes the single place where request/response integration is adapted.

## Logs

This file logs:

- API request received.
- Validation start.
- Validation pass/failure.
- Native module call.
- Native result.
- Final response returned to UI.

Search Logcat for:

```text
[EngineApi.ts]
```
