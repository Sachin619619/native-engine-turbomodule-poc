#include <cassert>
#include <iostream>

#include "generic_engine/engine.h"

int main() {
  const generic_engine::EngineResult result = generic_engine::runEngine({
      {92.0, 88.0, 84.0, 90.0, 76.0, 63.0, 82.0, 71.0},
  });

  assert(result.healthScore > 76.0 && result.healthScore < 81.0);
  assert(result.riskScore > 30.0);
  assert(result.anomalyCount == 1);
  assert(result.decision == "Inspect Before Release");

  std::cout << generic_engine::toJson(result) << std::endl;
  return 0;
}
