# `score_algorithm.h` and `score_algorithm.cpp`

## Why These Files Are Needed

These files contain the business logic. They decide how raw metric values become health, risk, confidence, anomaly count, final decision, and recommendation.

## What The Header Owns

`score_algorithm.h` declares the calculation functions:

- `calculateAverage`
- `calculateSpread`
- `calculateHealthScore`
- `calculateRiskScore`
- `calculateConfidence`
- `countAnomalies`
- `decideAction`
- `buildRecommendation`

## What The C++ File Owns

`score_algorithm.cpp` implements those functions.

## Full Flow

```text
engine.cpp
  -> calculateHealthScore(values)
       values below 70 get higher weight
  -> calculateSpread(values)
       max minus min
  -> countAnomalies(values)
       values below 70 count as anomalies
  -> calculateRiskScore(healthScore, spread, anomalyCount)
       lower health, larger spread, and more anomalies increase risk
  -> calculateConfidence(values, spread)
       more samples and lower spread increase confidence
  -> decideAction(riskScore, anomalyCount)
       risk and anomalies choose final decision
  -> buildRecommendation(decision, anomalyCount)
       creates the user-facing recommendation
```

## Decision Rules

- High risk or many anomalies -> `Hold for Review`
- Medium risk or at least one anomaly -> `Inspect Before Release`
- Low risk and no anomalies -> `Release Approved`

## Logs

Run:

```bash
npm run test:engine
```

Search output for:

```text
[ScoreAlgorithm]
```

The logs show every major calculation and the final decision branch.
