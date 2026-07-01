import NativeEngine, { type NativeEngineResult } from "../specs/NativeEngine";

const LOG_TAG = "[NativeEngineModule.ts]";

if (!NativeEngine) {
  console.error(`${LOG_TAG} NativeEngine TurboModule is missing. Check codegen and Android package registration.`);
  throw new Error("NativeEngine module is not linked on this platform.");
}

console.log(`${LOG_TAG} NativeEngine TurboModule linked through TurboModuleRegistry.`);

export type { NativeEngineResult };
export default NativeEngine;
