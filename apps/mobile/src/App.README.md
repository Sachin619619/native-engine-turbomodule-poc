# `apps/mobile/src/App.tsx`

## Why This File Is Needed

This is the main React Native screen. It gives the user a polished dashboard-style demo and starts the native engine call when the user taps the button.

## What It Owns

- The telemetry values shown on screen.
- The dark hero summary at the top of the screen.
- The visual telemetry bars.
- The `Run Native Inspection` button.
- Loading, error, and result state.
- Realtime runtime tracker state.
- The call into `analyzeMetrics`.
- The native decision banner, result cards, and evidence scale.
- The animated runtime call path timeline.

## Full Flow

```text
User taps Run Native Inspection
  -> runNativeInspection()
  -> reset result, error, and tracker state
  -> collect telemetryReadings values
  -> moveTraceToStep(React Native UI)
  -> moveTraceToStep(TypeScript API)
  -> analyzeMetrics({ values })
  -> moveTraceToStep(Android Module)
  -> moveTraceToStep(AAR Wrapper)
  -> moveTraceToStep(JNI)
  -> moveTraceToStep(C++ Engine)
  -> wait for native result
  -> mark tracker success
  -> setResult(response)
  -> InspectionResult renders decision banner, metric cards, evidence, and health bars
```

## Why The Native Call Is Not Directly Here

The UI calls `analyzeMetrics` instead of calling the native module directly. That keeps UI code clean and gives one place for validation and future backend/native integration changes.

## UI Sections

- `hero`: explains the POC and shows high-level input summary.
- `MetricBar`: renders each telemetry value as a readable progress bar.
- `InspectionResult`: renders the native engine decision after the native call returns.
- `SectionHeader`: keeps panel headings consistent.
- `tracePanel`: shows the exact runtime route from React Native to C++.
- `moveTraceToStep`: moves the tracker one layer at a time while the native request is running.
- `getTraceStatusText`: explains whether the tracker is idle, running, successful, or failed.
- `getTraceStepStyle` / `getTraceIndexStyle`: colors active, completed, and failed tracker steps.

## Visual Design Notes

- The UI uses only React Native styles, so no extra UI library is required.
- The dark hero and timeline make the native-stack story obvious during a demo.
- The card, bar, and banner colors make healthy, warning, and risky values easy to scan.
- The tracker uses blue for the active layer, green for completed layers, and red for failure.
- The screen remains a single small POC file while still looking like a real mobile dashboard.

## Logs

This file logs:

- Button press.
- Payload values sent to TypeScript API.
- Successful native response.
- Error message if native call fails.
- Loading state reset.
- Result render.
- Runtime tracker step changes.

Search Logcat for:

```text
[RN App]
```
