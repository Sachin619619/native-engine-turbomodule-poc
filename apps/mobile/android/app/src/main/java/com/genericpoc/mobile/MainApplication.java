package com.genericpoc.mobile;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.soloader.OpenSourceMergedSoMapping;
import com.facebook.soloader.SoLoader;

import java.io.IOException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private static final String TAG = "MainApplication";

    private final ReactNativeHost reactNativeHost = new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            Log.d(TAG, "getUseDeveloperSupport called. DEBUG=" + BuildConfig.DEBUG);
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            Log.d(TAG, "Creating React Native package list.");
            List<ReactPackage> packages = new PackageList(this).getPackages();
            packages.add(new NativeEnginePackage());
            Log.d(TAG, "NativeEnginePackage added. Package count=" + packages.size());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            Log.d(TAG, "JavaScript entry module requested.");
            return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
            Log.d(TAG, "New Architecture enabled so TurboModule codegen can serve NativeEngine.");
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
            Log.d(TAG, "Hermes disabled. App uses the standard JS runtime configured in Gradle.");
            return false;
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        Log.d(TAG, "ReactNativeHost requested by Android runtime.");
        return reactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Application onCreate started. Initializing native library loader.");
        try {
            SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE);
            Log.d(TAG, "SoLoader initialized successfully.");
        } catch (IOException error) {
            Log.e(TAG, "SoLoader initialization failed.", error);
            throw new RuntimeException("Failed to initialize native library loader", error);
        }
    }
}
