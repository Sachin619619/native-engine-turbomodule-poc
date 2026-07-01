# `engine.cpp`

## Why This File Is Needed

This file orchestrates the C++ engine. It connects raw input values to the business algorithm functions and builds the final result.

## What It Owns

- Minimum and maximum reading calculation.
- Health score call.
- Spread calculation call.
- Anomaly count call.
- Risk score call.
- Confidence call.
- Decision call.
- Recommendation call.
- JSON serialization.

## Full Flow

```text
runEngine(input)
  -> find min and max readings
  -> calculateHealthScore(values)
  -> calculateSpread(values)
  -> countAnomalies(values)
  -> calculateRiskScore(...)
  -> calculateConfidence(...)
  -> decideAction(...)
  -> buildRecommendation(...)
  -> return EngineResult

toJson(result)
  -> convert EngineResult fields into JSON string
  -> return JSON to JNI
```

## Why Algorithm Logic Is In Another File

`engine.cpp` controls the flow. `score_algorithm.cpp` owns the calculation details. This split makes the call flow easy to read and the algorithm easy to test/change.

## Logs

Run:

```bash
npm run test:engine
```

Search output for:

```text
[CoreEngine]
```

The logs show input count, min/max, computed scores, decision, and JSON response.
