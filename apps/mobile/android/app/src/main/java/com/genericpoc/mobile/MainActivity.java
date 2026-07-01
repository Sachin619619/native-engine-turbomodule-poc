package com.genericpoc.mobile;

import android.util.Log;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    private static final String TAG = "MainActivity";

    @Override
    protected String getMainComponentName() {
        Log.d(TAG, "React Native asks for the root component name.");
        return "GenericNativeEngineMobile";
    }
}
