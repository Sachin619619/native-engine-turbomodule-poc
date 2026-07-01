# API Contract

## TypeScript API

File:

```text
apps/mobile/src/api/EngineApi.ts
```

Request:

```ts
{
  values: number[]; // telemetry readings, each from 0 to 100
}
```

Response:

```ts
{
  healthScore: number;
  riskScore: number;
  confidence: number;
  anomalyCount: number;
  minReading: number;
  maxReading: number;
  decision: string;
  recommendation: string;
  scenarioName: string;
  requestedAt: string;
}
```

## React Native Native Module

Module name:

```text
NativeEngine
```

Method:

```ts
analyze(values: number[]): Promise<NativeEngineResult>
```

## Android Wrapper AAR

Class:

```text
com.genericpoc.enginewrapper.EngineWrapper
```

Method:

```java
EngineResult runAnalysis(double[] values)
```

## JNI

Native method:

```java
private native String runAnalysisNative(double[] values);
```

JNI implementation:

```text
native_engine_jni.cpp
```

## C++ Core Engine

Function:

```cpp
generic_engine::EngineResult runEngine(const EngineInput& input);
```

## Validation Rules

Frontend validates:

- At least one telemetry reading is required.
- Values must be finite numbers.
- Values must be between `0` and `100`.

## Demo Meaning

The current sample is an edge quality inspection decision.

The JavaScript layer validates the payload and sends it to native code. The C++ engine applies the scoring rules and returns the release decision that the mobile UI displays.
