#include <android/log.h>
#include <jni.h>

#include <string>
#include <vector>

#include "generic_engine/engine.h"

namespace {

constexpr const char* kLogTag = "NativeEngineJNI";

void logInfo(const std::string& message) {
  __android_log_print(ANDROID_LOG_INFO, kLogTag, "%s", message.c_str());
}

}  // namespace

extern "C" JNIEXPORT jstring JNICALL
Java_com_genericpoc_enginewrapper_EngineWrapper_runAnalysisNative(
    JNIEnv* env,
    jobject /* instance */,
    jdoubleArray values_array) {
  const jsize length = env->GetArrayLength(values_array);
  logInfo("JNI runAnalysisNative called with " + std::to_string(length) + " values.");

  std::vector<double> values(static_cast<size_t>(length));

  jdouble* raw_values = env->GetDoubleArrayElements(values_array, nullptr);
  for (jsize index = 0; index < length; ++index) {
    values[static_cast<size_t>(index)] = raw_values[index];
    logInfo("JNI copied value[" + std::to_string(index) + "] = " + std::to_string(raw_values[index]));
  }
  env->ReleaseDoubleArrayElements(values_array, raw_values, JNI_ABORT);

  logInfo("Calling portable C++ core engine.");
  const generic_engine::EngineResult result = generic_engine::runEngine({values});
  const std::string json = generic_engine::toJson(result);
  logInfo("C++ core engine returned JSON: " + json);

  return env->NewStringUTF(json.c_str());
}
