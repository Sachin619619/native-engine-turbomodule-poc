package com.genericpoc.enginewrapper;

public final class EngineResult {
    private final double healthScore;
    private final double riskScore;
    private final double confidence;
    private final int anomalyCount;
    private final double minReading;
    private final double maxReading;
    private final String decision;
    private final String recommendation;

    public EngineResult(
            double healthScore,
            double riskScore,
            double confidence,
            int anomalyCount,
            double minReading,
            double maxReading,
            String decision,
            String recommendation
    ) {
        this.healthScore = healthScore;
        this.riskScore = riskScore;
        this.confidence = confidence;
        this.anomalyCount = anomalyCount;
        this.minReading = minReading;
        this.maxReading = maxReading;
        this.decision = decision;
        this.recommendation = recommendation;
    }

    public double getHealthScore() {
        return healthScore;
    }

    public double getRiskScore() {
        return riskScore;
    }

    public double getConfidence() {
        return confidence;
    }

    public int getAnomalyCount() {
        return anomalyCount;
    }

    public double getMinReading() {
        return minReading;
    }

    public double getMaxReading() {
        return maxReading;
    }

    public String getDecision() {
        return decision;
    }

    public String getRecommendation() {
        return recommendation;
    }

    @Override
    public String toString() {
        return "EngineResult{"
                + "healthScore=" + healthScore
                + ", riskScore=" + riskScore
                + ", confidence=" + confidence
                + ", anomalyCount=" + anomalyCount
                + ", minReading=" + minReading
                + ", maxReading=" + maxReading
                + ", decision='" + decision + '\''
                + ", recommendation='" + recommendation + '\''
                + '}';
    }
}
