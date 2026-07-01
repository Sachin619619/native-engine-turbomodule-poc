#pragma once

#include <string>
#include <vector>

namespace generic_engine {

struct EngineInput {
  std::vector<double> values;
};

struct EngineResult {
  double healthScore;
  double riskScore;
  double confidence;
  int anomalyCount;
  double minReading;
  double maxReading;
  std::string decision;
  std::string recommendation;
};

EngineResult runEngine(const EngineInput& input);
std::string toJson(const EngineResult& result);

}  // namespace generic_engine
