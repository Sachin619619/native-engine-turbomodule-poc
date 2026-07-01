#include "generic_engine/engine.h"

#include <algorithm>
#include <iomanip>
#include <iostream>
#include <sstream>

#include "algorithm/score_algorithm.h"

namespace generic_engine {

EngineResult runEngine(const EngineInput& input) {
  std::clog << "[CoreEngine] runEngine called with " << input.values.size() << " values." << std::endl;
  double minimum = 0.0;
  double maximum = 0.0;
  if (!input.values.empty()) {
    const auto [minimumIterator, maximumIterator] = std::minmax_element(input.values.begin(), input.values.end());
    minimum = *minimumIterator;
    maximum = *maximumIterator;
  }
  std::clog << "[CoreEngine] Minimum=" << minimum << ", maximum=" << maximum << "." << std::endl;

  const double healthScore = algorithm::calculateHealthScore(input.values);
  const double spread = algorithm::calculateSpread(input.values);
  const int anomalyCount = algorithm::countAnomalies(input.values);
  const double riskScore = algorithm::calculateRiskScore(healthScore, spread, anomalyCount);
  const double confidence = algorithm::calculateConfidence(input.values, spread);
  const std::string decision = algorithm::decideAction(riskScore, anomalyCount);
  const std::string recommendation = algorithm::buildRecommendation(decision, anomalyCount);

  std::clog << "[CoreEngine] Computed healthScore=" << healthScore << ", spread=" << spread
            << ", anomalyCount=" << anomalyCount << ", riskScore=" << riskScore
            << ", confidence=" << confidence << ", decision=" << decision << "." << std::endl;

  return EngineResult{
      healthScore,
      riskScore,
      confidence,
      anomalyCount,
      minimum,
      maximum,
      decision,
      recommendation,
  };
}

std::string toJson(const EngineResult& result) {
  std::clog << "[CoreEngine] Serializing EngineResult to JSON." << std::endl;
  std::ostringstream stream;
  stream << std::fixed << std::setprecision(2);
  stream << "{";
  stream << "\"healthScore\":" << result.healthScore << ",";
  stream << "\"riskScore\":" << result.riskScore << ",";
  stream << "\"confidence\":" << result.confidence << ",";
  stream << "\"anomalyCount\":" << result.anomalyCount << ",";
  stream << "\"minReading\":" << result.minReading << ",";
  stream << "\"maxReading\":" << result.maxReading << ",";
  stream << "\"decision\":\"" << result.decision << "\",";
  stream << "\"recommendation\":\"" << result.recommendation << "\"";
  stream << "}";
  const std::string json = stream.str();
  std::clog << "[CoreEngine] JSON response=" << json << std::endl;
  return json;
}

}  // namespace generic_engine
