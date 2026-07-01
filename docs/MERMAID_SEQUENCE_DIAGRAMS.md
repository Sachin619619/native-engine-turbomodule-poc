# Mermaid Sequence Diagrams

This document explains the exact runtime call sequence in the native engine POC
using Mermaid diagrams. The diagrams include the function names, the layer that
owns each function, and why the call is needed.

## Main Success Flow

This is the primary demo flow after the user taps **Run Native Inspection**.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as App.tsx<br/>React Native UI
    participant Tracker as App.tsx<br/>Runtime tracker
    participant Api as EngineApi.ts<br/>TypeScript API
    participant NativeTs as NativeEngineModule.ts<br/>TurboModule adapter
    participant TurboSpec as NativeEngine.ts<br/>TurboModule spec
    participant AndroidModule as NativeEngineModule.java<br/>Android TurboModule
    participant Aar as EngineWrapper.java<br/>Android wrapper AAR
    participant Jni as native_engine_jni.cpp<br/>JNI bridge
    participant Core as engine.cpp<br/>C++ core engine
    participant Algorithm as score_algorithm.cpp<br/>Business algorithm

    User->>App: Tap Run Native Inspection
    Note over App: runNativeInspection() starts because the UI button is the entry point for the native demo.

    App->>App: setIsLoading(true), clear previous result/error
    Note over App: Keeps the screen state clean before sending a new request.

    App->>Tracker: moveTraceToStep(0)
    Note over Tracker: Shows "React Native UI" as the active layer in the visible tracker.

    App->>App: telemetryReadings.map(reading => reading.value)
    Note over App: Converts UI telemetry rows into the numeric payload expected by lower layers.

    App->>Tracker: moveTraceToStep(1)
    Note over Tracker: Shows that the request is moving to the TypeScript API boundary.

    App->>Api: analyzeMetrics({ values })
    Note over Api: analyzeMetrics() is the JS API facade. UI does not call the native module directly.

    Api->>Api: validateRequest(request)
    Note over Api: Rejects empty input and values outside 0..100 before native code is called.

    Api->>NativeTs: NativeEngine.analyze(request.values)
    Note over NativeTs: Uses the typed NativeEngineResult contract from the TurboModule spec.

    NativeTs->>TurboSpec: TurboModuleRegistry NativeEngine.analyze(values)
    Note over TurboSpec: React Native resolves NativeEngine through the codegen-backed TurboModule registry.

    App->>Tracker: moveTraceToStep(2)
    Note over Tracker: Shows "TurboModule" while the native call is in progress.

    TurboSpec->>AndroidModule: analyze(ReadableArray values, Promise promise)
    Note over AndroidModule: Generated NativeEngineSpec exposes analyze() to JavaScript and receives the JS array.

    AndroidModule->>AndroidModule: Convert ReadableArray to double[]
    Note over AndroidModule: Java wrapper code needs a primitive double[] for the reusable AAR layer.

    App->>Tracker: moveTraceToStep(3)
    Note over Tracker: Shows "AAR Wrapper" before the app-specific bridge enters the reusable library.

    AndroidModule->>Aar: engineWrapper.runAnalysis(nativeValues)
    Note over Aar: runAnalysis() hides JNI details and returns a Java EngineResult object.

    Aar->>Aar: System.loadLibrary("generic_engine_jni")
    Note over Aar: Loads the compiled JNI shared library before native methods are called.

    App->>Tracker: moveTraceToStep(4)
    Note over Tracker: Shows "JNI" because execution is crossing from Java into C++.

    Aar->>Jni: runAnalysisNative(double[] values)
    Note over Jni: Private native method implemented by Java_com_genericpoc_enginewrapper_EngineWrapper_runAnalysisNative().

    Jni->>Jni: GetArrayLength(), GetDoubleArrayElements()
    Note over Jni: Copies Java double[] into a C++ std::vector<double> for the portable engine.

    App->>Tracker: moveTraceToStep(5)
    Note over Tracker: Shows "C++ Engine" while the portable engine calculates the result.

    Jni->>Core: generic_engine::runEngine({ values })
    Note over Core: runEngine() is the platform-neutral entry point for the native engine.

    Core->>Core: std::minmax_element(input.values)
    Note over Core: Captures minReading and maxReading for the result evidence.

    Core->>Algorithm: calculateHealthScore(input.values)
    Note over Algorithm: Produces the weighted health score.
    Algorithm-->>Core: healthScore

    Core->>Algorithm: calculateSpread(input.values)
    Note over Algorithm: Measures the distance between lowest and highest telemetry values.

    Algorithm-->>Core: spread

    Core->>Algorithm: countAnomalies(input.values)
    Note over Algorithm: Counts readings below the native threshold.

    Algorithm-->>Core: anomalyCount

    Core->>Algorithm: calculateRiskScore(healthScore, spread, anomalyCount)
    Note over Algorithm: Combines weak health, spread penalty, and anomaly penalty.

    Algorithm-->>Core: riskScore

    Core->>Algorithm: calculateConfidence(input.values, spread)
    Note over Algorithm: Confidence increases with sample size and stability.

    Algorithm-->>Core: confidence

    Core->>Algorithm: decideAction(riskScore, anomalyCount)
    Note over Algorithm: Converts scores into a demo decision string.

    Algorithm-->>Core: decision

    Core->>Algorithm: buildRecommendation(decision, anomalyCount)
    Note over Algorithm: Builds a human-readable recommendation for the UI.

    Algorithm-->>Core: recommendation

    Core-->>Jni: EngineResult
    Note over Core,Jni: Native result is still a C++ struct at this point.

    Jni->>Core: generic_engine::toJson(result)
    Note over Core: Serializes the C++ result into JSON because Java can parse it easily.

    Core-->>Jni: JSON string

    Jni-->>Aar: env->NewStringUTF(json.c_str())
    Note over Jni,Aar: JNI returns a Java String to EngineWrapper.runAnalysis().

    Aar->>Aar: new JSONObject(rawJson)
    Note over Aar: Parses the native JSON string.

    Aar->>Aar: new EngineResult(...)
    Note over Aar: Converts JSON into a typed immutable Java result object.

    Aar-->>AndroidModule: EngineResult

    AndroidModule->>AndroidModule: new WritableNativeMap()
    Note over AndroidModule: Converts Java getters into a React Native map that JS can receive.

    AndroidModule-->>RnBridge: promise.resolve(map)
    Note over AndroidModule,RnBridge: Resolves the JavaScript Promise returned by NativeEngine.analyze().

    RnBridge-->>NativeTs: Promise<NativeEngineResult>
    NativeTs-->>Api: NativeEngineResult

    Api->>Api: Add scenarioName and requestedAt
    Note over Api: Adds JS-side metadata while keeping native calculation separate.

    Api-->>App: AnalyzeResponse

    App->>App: setResult(response)
    App->>App: setTraceState("success"), setIsLoading(false)
    Note over App: UI renders the decision, result cards, evidence, and completed runtime tracker.
```

## Startup And Native Module Registration

This flow happens before the user taps the button. It explains how
the `NativeEngine` TurboModule becomes available to TypeScript.

```mermaid
sequenceDiagram
    autonumber
    participant Android as Android runtime
    participant MainApplication as MainApplication.java
    participant SoLoader as SoLoader
    participant Host as ReactNativeHost
    participant Package as NativeEnginePackage.java
    participant Module as NativeEngineModule.java
    participant RN as React Native runtime
    participant Codegen as React Native Codegen
    participant NativeTs as NativeEngineModule.ts
    participant TurboSpec as NativeEngine.ts

    Android->>MainApplication: onCreate()
    Note over MainApplication: App process starts and prepares React Native/native loading.

    MainApplication->>SoLoader: SoLoader.init(...)
    Note over SoLoader: Enables native shared-library loading for React Native and the JNI stack.

    Android->>MainApplication: getReactNativeHost()
    MainApplication-->>Android: reactNativeHost

    Host->>Host: getPackages()
    Note over Host: Builds the standard React Native package list.

    Host->>Package: packages.add(new NativeEnginePackage())
    Note over Package: Adds the custom package that exposes the native engine module.

    Codegen->>TurboSpec: Read Spec interface
    Codegen-->>AndroidModule: Generate NativeEngineSpec
    Note over Codegen: Build-time step keeps TypeScript and Android signatures aligned.

    RN->>Package: getModule("NativeEngine", reactContext)
    Package->>Module: new NativeEngineModule(reactContext)
    Note over Module: Constructs the Android TurboModule and stores EngineWrapper.

    RN->>Module: getName()
    Module-->>RN: "NativeEngine"
    Note over RN: The string name is resolved through TurboModuleRegistry.

    NativeTs->>TurboSpec: import NativeEngine
    TurboSpec->>RN: TurboModuleRegistry.getEnforcing("NativeEngine")
    Note over NativeTs: TypeScript checks that the Android TurboModule is linked.

    alt NativeEngine exists
        NativeTs-->>RN: export NativeEngine
        Note over NativeTs: JS code can safely call NativeEngine.analyze(values).
    else NativeEngine missing
        NativeTs-->>RN: throw Error("NativeEngine module is not linked on this platform.")
        Note over NativeTs: Fails early instead of waiting for a confusing runtime call failure.
    end
```

## TypeScript Validation Failure Flow

This shows what happens when the UI sends invalid values. The request stops in
TypeScript and never reaches Android, JNI, or C++.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as App.tsx
    participant Api as EngineApi.ts
    participant NativeTs as NativeEngineModule.ts
    participant AndroidModule as NativeEngineModule.java
    participant Core as C++ engine

    User->>App: Tap Run Native Inspection
    App->>Api: analyzeMetrics({ values })
    Api->>Api: validateRequest(request)

    alt values is empty
        Api-->>App: throw Error("At least one metric value is required.")
    else any value is not finite or outside 0..100
        Api-->>App: throw Error("Metric values must be numbers between 0 and 100.")
    end

    Note over NativeTs,Core: No native call happens. This protects Android/JNI/C++ from invalid input.

    App->>App: catch error
    App->>App: setTraceState("error"), setError(message), setIsLoading(false)
    Note over App: The UI shows a native inspection failure message and stops the tracker.
```

## Native Error Flow

This is the failure path after TypeScript validation passes but a lower layer
throws an exception.

```mermaid
sequenceDiagram
    autonumber
    participant App as App.tsx
    participant Api as EngineApi.ts
    participant NativeTs as NativeEngineModule.ts
    participant AndroidModule as NativeEngineModule.java
    participant Aar as EngineWrapper.java
    participant Jni as native_engine_jni.cpp
    participant Core as engine.cpp

    App->>Api: analyzeMetrics({ values })
    Api->>NativeTs: NativeEngine.analyze(values)
    NativeTs->>AndroidModule: analyze(values, promise)
    AndroidModule->>Aar: engineWrapper.runAnalysis(nativeValues)
    Aar->>Jni: runAnalysisNative(values)
    Jni->>Core: generic_engine::runEngine({ values })

    alt JNI or C++ returns invalid JSON
        Jni-->>Aar: raw JSON string
        Aar->>Aar: new JSONObject(rawJson)
        Aar-->>AndroidModule: throw IllegalStateException("Native engine returned invalid JSON")
    else Android/JNI/C++ throws any other exception
        Aar-->>AndroidModule: throw exception
    end

    AndroidModule-->>NativeTs: promise.reject("NATIVE_ENGINE_ERROR", error)
    NativeTs-->>Api: rejected Promise
    Api-->>App: rejected Promise
    App->>App: catch error and show message

    Note over App: runNativeInspection() sets traceState to error and clears loading in finally.
```

## Function-To-Layer Reference

| Layer | File | Main function or method | Why it exists |
|-------|------|-------------------------|---------------|
| React Native UI | `apps/mobile/src/App.tsx` | `runNativeInspection()` | Starts the demo, prepares telemetry, controls loading/error/result state, and updates the visible tracker. |
| React Native UI | `apps/mobile/src/App.tsx` | `moveTraceToStep(index)` | Makes the runtime path visible one layer at a time during the demo. |
| TypeScript API | `apps/mobile/src/api/EngineApi.ts` | `analyzeMetrics(request)` | Stable API boundary used by UI; validates input and adds JS-side response metadata. |
| TypeScript API | `apps/mobile/src/api/EngineApi.ts` | `validateRequest(request)` | Stops invalid values before Android/JNI/C++ are called. |
| TurboModule spec | `apps/mobile/src/specs/NativeEngine.ts` | `TurboModuleRegistry.getEnforcing("NativeEngine")` | Codegen-backed contract between JavaScript and Android. |
| TypeScript native adapter | `apps/mobile/src/native/NativeEngineModule.ts` | `NativeEngine.analyze(values)` | Stable adapter used by the app API layer. |
| Android bridge registration | `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/MainApplication.java` | `getPackages()` | Registers `NativeEnginePackage` with React Native. |
| Android TurboModule registration | `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEnginePackage.java` | `getModule(...)` | Lazily creates and exposes `NativeEngineModule`. |
| Android native module | `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEngineModule.java` | `getName()` | Registers the JS-visible module name as `NativeEngine`. |
| Android native module | `apps/mobile/android/app/src/main/java/com/genericpoc/mobile/NativeEngineModule.java` | `analyze(ReadableArray, Promise)` | Receives JS calls, converts JS input to Java primitives, calls the AAR, and resolves/rejects the JS Promise. |
| Android wrapper AAR | `native/android-wrapper/src/main/java/com/genericpoc/enginewrapper/EngineWrapper.java` | `runAnalysis(double[])` | Reusable Java facade around JNI; parses JSON into `EngineResult`. |
| Android wrapper AAR | `native/android-wrapper/src/main/java/com/genericpoc/enginewrapper/EngineWrapper.java` | `runAnalysisNative(double[])` | Native method implemented in C++ through JNI. |
| JNI bridge | `native/android-wrapper/src/main/cpp/native_engine_jni.cpp` | `Java_com_genericpoc_enginewrapper_EngineWrapper_runAnalysisNative(...)` | Converts Java arrays to C++ vectors, calls the core engine, and returns a Java string. |
| C++ core engine | `native/core-engine/src/engine.cpp` | `generic_engine::runEngine(input)` | Platform-neutral orchestration for native calculation. |
| C++ core engine | `native/core-engine/src/engine.cpp` | `generic_engine::toJson(result)` | Serializes the C++ result for Java. |
| Business algorithm | `native/core-engine/src/algorithm/score_algorithm.cpp` | `calculateHealthScore(values)` | Computes the weighted health score used by `runEngine()`. |
| Business algorithm | `native/core-engine/src/algorithm/score_algorithm.cpp` | `calculateSpread(values)` | Computes input spread from min/max. |
| Business algorithm | `native/core-engine/src/algorithm/score_algorithm.cpp` | `countAnomalies(values)` | Counts weak readings. |
| Business algorithm | `native/core-engine/src/algorithm/score_algorithm.cpp` | `calculateRiskScore(healthScore, spread, anomalyCount)` | Produces the risk score from health, spread, and anomalies. |
| Business algorithm | `native/core-engine/src/algorithm/score_algorithm.cpp` | `calculateConfidence(values, spread)` | Estimates result confidence. |
| Business algorithm | `native/core-engine/src/algorithm/score_algorithm.cpp` | `decideAction(riskScore, anomalyCount)` | Converts score output into a demo decision. |
| Business algorithm | `native/core-engine/src/algorithm/score_algorithm.cpp` | `buildRecommendation(decision, anomalyCount)` | Builds user-facing recommendation text. |
| Business algorithm utility | `native/core-engine/src/algorithm/score_algorithm.cpp` | `calculateAverage(values)` | Utility function available in the algorithm module; it is not called by the current `runEngine()` path. |

## How To Use This In A Demo

1. Open this file in a Mermaid-compatible viewer.
2. Show the **Startup And Native Module Registration** diagram first to explain
   how the native module becomes callable from JavaScript.
3. Show the **Main Success Flow** diagram while running the app.
4. Filter Logcat with:

```bash
adb logcat | grep -E "RN App|EngineApi|NativeEngineModule|EngineWrapper|NativeEngineJNI|CoreEngine|ScoreAlgorithm"
```

5. Match the log tags to the participants in the diagram.
