#!/usr/bin/env bash

# Shared Android build environment for this POC.
# Keep Android/JDK paths here so Gradle tasks do not depend on a global shell setup.

export JAVA_HOME="${JAVA_HOME_OVERRIDE:-/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home}"
export ANDROID_HOME="${ANDROID_HOME_OVERRIDE:-/opt/homebrew/share/android-commandlinetools}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT_OVERRIDE:-$ANDROID_HOME}"
export GRADLE_BIN="${GRADLE_BIN_OVERRIDE:-/opt/homebrew/opt/gradle@8/bin/gradle}"

export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
