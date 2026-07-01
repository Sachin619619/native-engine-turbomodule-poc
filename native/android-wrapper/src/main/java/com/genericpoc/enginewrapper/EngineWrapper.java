package com.genericpoc.enginewrapper;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

public final class EngineWrapper {
    private static final String TAG = "EngineWrapper";

    static {
        Log.d(TAG, "Loading JNI library generic_engine_jni.");
        System.loadLibrary("generic_engine_jni");
        Log.d(TAG, "JNI library loaded successfully.");
    }

    public EngineResult runAnalysis(double[] values) {
        Log.d(TAG, "runAnalysis called with " + values.length + " values. Calling JNI next.");
        try {
            String rawJson = runAnalysisNative(values);
            Log.d(TAG, "JNI returned raw JSON: " + rawJson);

            JSONObject json = new JSONObject(rawJson);
            EngineResult result = new EngineResult(
                    json.getDouble("healthScore"),
                    json.getDouble("riskScore"),
                    json.getDouble("confidence"),
                    json.getInt("anomalyCount"),
                    json.getDouble("minReading"),
                    json.getDouble("maxReading"),
                    json.getString("decision"),
                    json.getString("recommendation")
            );
            Log.d(TAG, "Parsed JSON into EngineResult: " + result);
            return result;
        } catch (JSONException error) {
            Log.e(TAG, "Failed to parse JSON returned from JNI.", error);
            throw new IllegalStateException("Native engine returned invalid JSON", error);
        }
    }

    private native String runAnalysisNative(double[] values);
}
