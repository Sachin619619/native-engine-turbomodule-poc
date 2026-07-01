package com.genericpoc.mobile;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public final class NativeEnginePackage extends TurboReactPackage {
    private static final String TAG = "NativeEnginePackage";

    @Nullable
    @Override
    public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext reactContext) {
        Log.d(TAG, "TurboReactPackage getModule called for " + name + ".");
        if (NativeEngineModule.NAME.equals(name)) {
            Log.d(TAG, "Creating NativeEngine TurboModule instance.");
            return new NativeEngineModule(reactContext);
        }
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        Log.d(TAG, "Providing TurboModule metadata for NativeEngine.");
        return () -> {
            Map<String, ReactModuleInfo> moduleInfo = new HashMap<>();
            moduleInfo.put(
                    NativeEngineModule.NAME,
                    new ReactModuleInfo(
                            NativeEngineModule.NAME,
                            NativeEngineModule.class.getName(),
                            false,
                            false,
                            false,
                            true));
            return moduleInfo;
        };
    }
}
