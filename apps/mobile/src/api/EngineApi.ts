import NativeEngine, { type NativeEngineResult } from "../native/NativeEngineModule";

const LOG_TAG = "[EngineApi.ts]";

export interface AnalyzeRequest {
  values: number[];
}

export interface AnalyzeResponse extends NativeEngineResult {
  scenarioName: string;
  requestedAt: string;
}

export async function analyzeMetrics(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  console.log(`${LOG_TAG} analyzeMetrics called with request: ${JSON.stringify(request)}`);
  validateRequest(request);

  console.log(`${LOG_TAG} Request is valid. Calling React Native native module.`);
  const result = await NativeEngine.analyze(request.values);
  console.log(`${LOG_TAG} Native module returned result: ${JSON.stringify(result)}`);

  const response = {
    ...result,
    scenarioName: "Edge quality inspection",
    requestedAt: new Date().toISOString(),
  };
  console.log(`${LOG_TAG} Returning API response to UI: ${JSON.stringify(response)}`);
  return response;
}

function validateRequest(request: AnalyzeRequest) {
  console.log(`${LOG_TAG} Validating ${request.values.length} metric values.`);
  if (!request.values.length) {
    console.error(`${LOG_TAG} Validation failed because no values were provided.`);
    throw new Error("At least one metric value is required.");
  }

  for (const value of request.values) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      console.error(`${LOG_TAG} Validation failed for value: ${value}`);
      throw new Error("Metric values must be numbers between 0 and 100.");
    }
  }
  console.log(`${LOG_TAG} Validation passed.`);
}
