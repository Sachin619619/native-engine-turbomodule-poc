#pragma once

#include <string>
#include <vector>

namespace generic_engine::algorithm {

double calculateAverage(const std::vector<double>& values);
double calculateSpread(const std::vector<double>& values);
double calculateHealthScore(const std::vector<double>& values);
double calculateRiskScore(double healthScore, double spread, int anomalyCount);
double calculateConfidence(const std::vector<double>& values, double spread);
int countAnomalies(const std::vector<double>& values);
std::string decideAction(double riskScore, int anomalyCount);
std::string buildRecommendation(const std::string& decision, int anomalyCount);

}  // namespace generic_engine::algorithm
