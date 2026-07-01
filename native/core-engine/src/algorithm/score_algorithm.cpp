#include "score_algorithm.h"

#include <algorithm>
#include <cmath>
#include <iostream>

namespace generic_engine::algorithm {

double calculateAverage(const std::vector<double>& values) {
  std::clog << "[ScoreAlgorithm] calculateAverage called with " << values.size() << " values." << std::endl;
  if (values.empty()) {
    std::clog << "[ScoreAlgorithm] Empty input. Average=0." << std::endl;
    return 0.0;
  }

  double total = 0.0;
  for (double value : values) {
    total += value;
  }

  const double average = total / static_cast<double>(values.size());
  std::clog << "[ScoreAlgorithm] Average=" << average << "." << std::endl;
  return average;
}

double calculateSpread(const std::vector<double>& values) {
  std::clog << "[ScoreAlgorithm] calculateSpread called." << std::endl;
  if (values.empty()) {
    std::clog << "[ScoreAlgorithm] Empty input. Spread=0." << std::endl;
    return 0.0;
  }

  const auto [minimum, maximum] = std::minmax_element(values.begin(), values.end());
  const double spread = *maximum - *minimum;
  std::clog << "[ScoreAlgorithm] Spread=" << spread << "." << std::endl;
  return spread;
}

double calculateHealthScore(const std::vector<double>& values) {
  std::clog << "[ScoreAlgorithm] calculateHealthScore called." << std::endl;
  if (values.empty()) {
    std::clog << "[ScoreAlgorithm] Empty input. Health score=0." << std::endl;
    return 0.0;
  }

  double weightedTotal = 0.0;
  double weightTotal = 0.0;
  for (double value : values) {
    const double weight = value < 70.0 ? 1.8 : 1.0;
    weightedTotal += value * weight;
    weightTotal += weight;
    std::clog << "[ScoreAlgorithm] Health input value=" << value << ", weight=" << weight << "." << std::endl;
  }

  const double healthScore = std::clamp(weightedTotal / weightTotal, 0.0, 100.0);
  std::clog << "[ScoreAlgorithm] Health score=" << healthScore << "." << std::endl;
  return healthScore;
}

double calculateRiskScore(double healthScore, double spread, int anomalyCount) {
  std::clog << "[ScoreAlgorithm] calculateRiskScore called with healthScore=" << healthScore
            << ", spread=" << spread << ", anomalyCount=" << anomalyCount << "." << std::endl;
  const double spreadPenalty = std::min(spread * 0.35, 18.0);
  const double anomalyPenalty = static_cast<double>(anomalyCount) * 8.0;
  const double riskScore = std::clamp((100.0 - healthScore) + spreadPenalty + anomalyPenalty, 0.0, 100.0);
  std::clog << "[ScoreAlgorithm] spreadPenalty=" << spreadPenalty << ", anomalyPenalty=" << anomalyPenalty
            << ", riskScore=" << riskScore << "." << std::endl;
  return riskScore;
}

double calculateConfidence(const std::vector<double>& values, double spread) {
  std::clog << "[ScoreAlgorithm] calculateConfidence called with spread=" << spread << "." << std::endl;
  const double sampleConfidence = std::min(static_cast<double>(values.size()) * 10.0, 80.0);
  const double stabilityBonus = std::max(20.0 - spread * 0.4, 0.0);
  const double confidence = std::clamp(sampleConfidence + stabilityBonus, 0.0, 99.0);
  std::clog << "[ScoreAlgorithm] sampleConfidence=" << sampleConfidence
            << ", stabilityBonus=" << stabilityBonus << ", confidence=" << confidence << "." << std::endl;
  return confidence;
}

int countAnomalies(const std::vector<double>& values) {
  std::clog << "[ScoreAlgorithm] countAnomalies called." << std::endl;
  int count = 0;
  for (double value : values) {
    if (value < 70.0) {
      count++;
      std::clog << "[ScoreAlgorithm] Anomaly found. Value=" << value << "." << std::endl;
    }
  }
  std::clog << "[ScoreAlgorithm] anomalyCount=" << count << "." << std::endl;
  return count;
}

std::string decideAction(double riskScore, int anomalyCount) {
  std::clog << "[ScoreAlgorithm] decideAction called with riskScore=" << riskScore
            << ", anomalyCount=" << anomalyCount << "." << std::endl;
  if (riskScore >= 45.0 || anomalyCount >= 3) {
    std::clog << "[ScoreAlgorithm] Decision=Hold for Review." << std::endl;
    return "Hold for Review";
  }
  if (riskScore >= 25.0 || anomalyCount > 0) {
    std::clog << "[ScoreAlgorithm] Decision=Inspect Before Release." << std::endl;
    return "Inspect Before Release";
  }
  std::clog << "[ScoreAlgorithm] Decision=Release Approved." << std::endl;
  return "Release Approved";
}

std::string buildRecommendation(const std::string& decision, int anomalyCount) {
  std::clog << "[ScoreAlgorithm] buildRecommendation called for decision=" << decision
            << ", anomalyCount=" << anomalyCount << "." << std::endl;
  if (decision == "Hold for Review") {
    return "Route this batch to specialist validation before customer release.";
  }
  if (decision == "Inspect Before Release") {
    return anomalyCount > 0 ? "Run focused checks on the low-scoring sensor channels."
                            : "Approve after a quick stability spot-check.";
  }
  return "Release can proceed with standard monitoring.";
}

}  // namespace generic_engine::algorithm
