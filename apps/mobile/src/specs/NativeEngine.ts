import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

const LOG_TAG = "[NativeEngine TurboModule Spec]";

export interface NativeEngineResult {
  healthScore: number;
  riskScore: number;
  confidence: number;
  anomalyCount: number;
  minReading: number;
  maxReading: number;
  decision: string;
  recommendation: string;
}

export interface Spec extends TurboModule {
  analyze(values: Array<number>): Promise<NativeEngineResult>;
}

console.log(`${LOG_TAG} Resolving NativeEngine through TurboModuleRegistry.`);

export default TurboModuleRegistry.getEnforcing<Spec>("NativeEngine");
