package com.genericpoc.mobile;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;
import com.genericpoc.enginewrapper.EngineResult;
import com.genericpoc.enginewrapper.EngineWrapper;

@ReactModule(name = NativeEngineModule.NAME)
public final class NativeEngineModule extends NativeEngineSpec {
    public static final String NAME = "NativeEngine";
    private static final String TAG = "NativeEngineModule";

    private final EngineWrapper engineWrapper = new EngineWrapper();

    public NativeEngineModule(ReactApplicationContext context) {
        super(context);
        Log.d(TAG, "NativeEngineModule constructed and ready for JavaScript calls.");
    }

    @Override
    public String getName() {
        Log.d(TAG, "getName called. Registering module as NativeEngine.");
        return NAME;
    }

    @Override
    public void analyze(ReadableArray values, Promise promise) {
        Log.d(TAG, "TurboModule analyze called from JavaScript with " + values.size() + " values.");
        try {
            double[] nativeValues = new double[values.size()];
            for (int index = 0; index < values.size(); index++) {
                nativeValues[index] = values.getDouble(index);
                Log.d(TAG, "Input value[" + index + "] = " + nativeValues[index]);
            }

            Log.d(TAG, "Calling Android wrapper from TurboModule. Next layer: EngineWrapper.");
            EngineResult result = engineWrapper.runAnalysis(nativeValues);
            Log.d(TAG, "Android wrapper returned: " + result);

            WritableMap map = new WritableNativeMap();
            map.putDouble("healthScore", result.getHealthScore());
            map.putDouble("riskScore", result.getRiskScore());
            map.putDouble("confidence", result.getConfidence());
            map.putInt("anomalyCount", result.getAnomalyCount());
            map.putDouble("minReading", result.getMinReading());
            map.putDouble("maxReading", result.getMaxReading());
            map.putString("decision", result.getDecision());
            map.putString("recommendation", result.getRecommendation());

            Log.d(TAG, "Resolving JavaScript promise with native result map.");
            promise.resolve(map);
        } catch (Exception error) {
            Log.e(TAG, "Native analysis failed.", error);
            promise.reject("NATIVE_ENGINE_ERROR", error);
        }
    }
}
