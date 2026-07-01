import React, { useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { analyzeMetrics, type AnalyzeResponse } from "./api/EngineApi";
import { ResultCard } from "./components/ResultCard";

const LOG_TAG = "[RN App]";

const telemetryReadings = [
  { label: "Thermal margin", value: 92 },
  { label: "Vibration stability", value: 88 },
  { label: "Signal quality", value: 84 },
  { label: "Throughput health", value: 90 },
  { label: "Battery health", value: 76 },
  { label: "Error-free rate", value: 63 },
  { label: "Calibration score", value: 82 },
  { label: "Latency score", value: 71 },
];

const callPath = ["React Native UI", "TypeScript API", "TurboModule", "AAR Wrapper", "JNI", "C++ Engine"];

const averageReading = telemetryReadings.reduce((sum, reading) => sum + reading.value, 0) / telemetryReadings.length;
const stepDelayMs = 260;

type TraceState = "idle" | "running" | "success" | "error";

export function App() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTraceIndex, setActiveTraceIndex] = useState(-1);
  const [completedTraceIndex, setCompletedTraceIndex] = useState(-1);
  const [traceState, setTraceState] = useState<TraceState>("idle");

  async function runNativeInspection() {
    console.log(`${LOG_TAG} Run button pressed. Preparing telemetry payload.`);
    setIsLoading(true);
    setError(null);
    setResult(null);
    setActiveTraceIndex(-1);
    setCompletedTraceIndex(-1);
    setTraceState("running");

    try {
      const values = telemetryReadings.map((reading) => reading.value);
      await moveTraceToStep(0);
      console.log(`${LOG_TAG} Sending ${values.length} readings to TypeScript API: ${JSON.stringify(values)}`);
      await moveTraceToStep(1);
      const responsePromise = analyzeMetrics({ values });
      await moveTraceToStep(2);
      await moveTraceToStep(3);
      await moveTraceToStep(4);
      await moveTraceToStep(5);
      const response = await responsePromise;
      console.log(`${LOG_TAG} Native inspection completed: ${JSON.stringify(response)}`);
      setCompletedTraceIndex(callPath.length - 1);
      setActiveTraceIndex(-1);
      setTraceState("success");
      setResult(response);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unknown native engine error";
      console.error(`${LOG_TAG} Native inspection failed: ${message}`);
      setTraceState("error");
      setError(message);
    } finally {
      console.log(`${LOG_TAG} Loading state cleared.`);
      setIsLoading(false);
    }
  }

  async function moveTraceToStep(index: number) {
    console.log(`${LOG_TAG} Runtime tracker active step ${index + 1}: ${callPath[index]}.`);
    setActiveTraceIndex(index);
    setCompletedTraceIndex(index - 1);
    await wait(stepDelayMs);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>NE</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Native stack live</Text>
            </View>
          </View>

          <Text style={styles.eyebrow}>React Native TurboModule to C++ POC</Text>
          <Text style={styles.heading}>Edge Quality Inspection</Text>
          <Text style={styles.body}>
            Telemetry moves from the mobile UI through a typed TurboModule, Android wrapper, JNI, and C++ inspection
            engine. The native layer returns a decision, risk score, confidence, and recommendation.
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Average input</Text>
              <Text style={styles.heroStatValue}>{averageReading.toFixed(1)}%</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Readings</Text>
              <Text style={styles.heroStatValue}>{telemetryReadings.length}</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Native layers</Text>
              <Text style={styles.heroStatValue}>4</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputPanel}>
          <SectionHeader title="Telemetry payload" caption="Values sent to the native engine" />
          <View style={styles.readingGrid}>
            {telemetryReadings.map((reading) => (
              <MetricBar key={reading.label} label={reading.label} value={reading.value} />
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.button, isLoading ? styles.buttonDisabled : null]} onPress={runNativeInspection} disabled={isLoading}>
          <View style={styles.buttonContent}>
            {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.buttonIcon}>RUN</Text>}
            <Text style={styles.buttonText}>{isLoading ? "Running native inspection..." : "Run Native Inspection"}</Text>
          </View>
        </TouchableOpacity>

        {error ? (
          <View style={styles.errorPanel}>
            <Text style={styles.errorTitle}>Native inspection failed</Text>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}

        {result ? <InspectionResult result={result} /> : null}

        <View style={styles.tracePanel}>
          <SectionHeader title="Runtime call path" caption="How the request travels through the POC" dark />
          <Text style={styles.traceStatusText}>{getTraceStatusText(traceState, activeTraceIndex)}</Text>
          <View style={styles.traceTimeline}>
            {callPath.map((step, index) => (
              <View key={step} style={[styles.traceStep, getTraceStepStyle(index, activeTraceIndex, completedTraceIndex, traceState)]}>
                <View style={styles.traceRail}>
                  <Text style={[styles.traceIndex, getTraceIndexStyle(index, activeTraceIndex, completedTraceIndex, traceState)]}>
                    {getTraceIndexText(index, activeTraceIndex, completedTraceIndex, traceState)}
                  </Text>
                  {index < callPath.length - 1 ? <View style={[styles.traceLine, index <= completedTraceIndex ? styles.traceLineDone : null]} /> : null}
                </View>
                <View style={styles.traceContent}>
                  <Text style={styles.traceText}>{step}</Text>
                  <Text style={styles.traceHint}>{getTraceHint(index)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InspectionResult({ result }: { result: AnalyzeResponse }) {
  const riskTone = result.riskScore >= 45 ? "danger" : result.riskScore >= 25 ? "warning" : "good";
  const riskCopy = riskTone === "danger" ? "High attention" : riskTone === "warning" ? "Watch closely" : "Healthy range";
  console.log(`${LOG_TAG} Rendering inspection result with decision "${result.decision}".`);

  return (
    <View style={styles.resultPanel}>
      <View style={[styles.decisionBanner, styles[`${riskTone}Banner`]]}>
        <View>
          <Text style={styles.bannerLabel}>Native decision</Text>
          <Text style={styles.bannerValue}>{result.decision}</Text>
          <Text style={styles.bannerCopy}>{result.recommendation}</Text>
        </View>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeValue}>{result.riskScore.toFixed(0)}%</Text>
          <Text style={styles.bannerBadgeLabel}>Risk</Text>
        </View>
      </View>

      <View style={styles.resultGrid}>
        <ResultCard title="Health score" value={`${result.healthScore.toFixed(1)}%`} tone="good" />
        <ResultCard title="Risk score" value={`${result.riskScore.toFixed(1)}%`} tone={riskTone} />
        <ResultCard title="Confidence" value={`${result.confidence.toFixed(1)}%`} tone="neutral" />
        <ResultCard title="Anomalies" value={String(result.anomalyCount)} tone={result.anomalyCount ? "warning" : "good"} />
      </View>

      <View style={styles.evidencePanel}>
        <SectionHeader title="Native evidence" caption={riskCopy} />
        <Text style={styles.evidenceText}>
          Lowest reading {result.minReading.toFixed(0)}%, highest reading {result.maxReading.toFixed(0)}%. Result generated at{" "}
          {new Date(result.requestedAt).toLocaleTimeString()}.
        </Text>
        <View style={styles.evidenceScale}>
          <MetricBar label="Health score" value={result.healthScore} compact />
          <MetricBar label="Confidence" value={result.confidence} compact />
          <MetricBar label="Risk score" value={result.riskScore} inverted compact />
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ title, caption, dark = false }: { title: string; caption: string; dark?: boolean }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.panelTitle, dark ? styles.panelTitleDark : null]}>{title}</Text>
      <Text style={[styles.panelCaption, dark ? styles.panelCaptionDark : null]}>{caption}</Text>
    </View>
  );
}

function MetricBar({ label, value, inverted = false, compact = false }: { label: string; value: number; inverted?: boolean; compact?: boolean }) {
  const isWeak = inverted ? value > 45 : value < 70;
  const isWatch = inverted ? value > 25 && value <= 45 : value >= 70 && value < 82;
  const fillStyle = isWeak ? styles.barFillDanger : isWatch ? styles.barFillWarning : styles.barFillGood;

  return (
    <View style={[styles.metricBar, compact ? styles.metricBarCompact : null]}>
      <View style={styles.metricBarHeader}>
        <Text style={styles.readingLabel}>{label}</Text>
        <Text style={[styles.readingValue, isWeak ? styles.lowValue : null]}>{value.toFixed(0)}%</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, fillStyle, { width: `${Math.min(Math.max(value, 0), 100)}%` }]} />
      </View>
    </View>
  );
}

function getTraceHint(index: number) {
  switch (index) {
    case 0:
      return "User action and screen state";
    case 1:
      return "Validation and typed contract";
    case 2:
      return "Codegen-backed native entry";
    case 3:
      return "Reusable Android wrapper";
    case 4:
      return "Native boundary call";
    default:
      return "C++ algorithm result";
  }
}

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function getTraceStatusText(traceState: TraceState, activeTraceIndex: number) {
  if (traceState === "success") {
    return "Completed: response returned from the C++ engine to the React Native screen.";
  }

  if (traceState === "error") {
    return "Failed: check Logcat for the layer that raised the error.";
  }

  if (traceState === "running" && activeTraceIndex >= 0) {
    return `Live now: ${callPath[activeTraceIndex]}`;
  }

  return "Tap Run Native Inspection to watch the request move layer by layer.";
}

function getTraceIndexText(index: number, activeTraceIndex: number, completedTraceIndex: number, traceState: TraceState) {
  if (traceState === "error" && index === activeTraceIndex) {
    return "!";
  }

  if (index <= completedTraceIndex) {
    return "✓";
  }

  return String(index + 1);
}

function getTraceStepStyle(index: number, activeTraceIndex: number, completedTraceIndex: number, traceState: TraceState) {
  if (traceState === "error" && index === activeTraceIndex) {
    return styles.traceStepError;
  }

  if (index === activeTraceIndex) {
    return styles.traceStepActive;
  }

  if (index <= completedTraceIndex) {
    return styles.traceStepDone;
  }

  return null;
}

function getTraceIndexStyle(index: number, activeTraceIndex: number, completedTraceIndex: number, traceState: TraceState) {
  if (traceState === "error" && index === activeTraceIndex) {
    return styles.traceIndexError;
  }

  if (index === activeTraceIndex) {
    return styles.traceIndexActive;
  }

  if (index <= completedTraceIndex) {
    return styles.traceIndexDone;
  }

  return null;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef3f8",
  },
  container: {
    padding: 18,
    paddingBottom: 30,
    gap: 16,
  },
  hero: {
    backgroundColor: "#101820",
    borderRadius: 8,
    padding: 20,
    gap: 14,
  },
  heroTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: "#f2c94c",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  brandMarkText: {
    color: "#101820",
    fontSize: 15,
    fontWeight: "900",
  },
  statusPill: {
    alignItems: "center",
    backgroundColor: "#1d2937",
    borderColor: "#334155",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusDot: {
    backgroundColor: "#27c46b",
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  statusText: {
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: "800",
  },
  eyebrow: {
    color: "#8fc5ff",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  heading: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 39,
  },
  body: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 24,
  },
  heroStats: {
    flexDirection: "row",
    gap: 10,
  },
  heroStat: {
    backgroundColor: "#182536",
    borderColor: "#2b3a4c",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  heroStatLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
  },
  heroStatValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 6,
  },
  inputPanel: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderColor: "#d9e1ec",
    borderWidth: 1,
    padding: 16,
    shadowColor: "#203040",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  panelTitle: {
    color: "#122033",
    fontSize: 16,
    fontWeight: "900",
  },
  panelTitleDark: {
    color: "#ffffff",
  },
  panelCaption: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },
  panelCaptionDark: {
    color: "#9fb1c7",
  },
  readingGrid: {
    gap: 12,
  },
  metricBar: {
    backgroundColor: "#f8fafc",
    borderColor: "#e5edf6",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  metricBarCompact: {
    backgroundColor: "#ffffff",
    padding: 10,
  },
  metricBarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  readingLabel: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "800",
  },
  readingValue: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
  },
  lowValue: {
    color: "#c2410c",
  },
  barTrack: {
    backgroundColor: "#e7eef7",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  barFill: {
    borderRadius: 999,
    height: 8,
  },
  barFillGood: {
    backgroundColor: "#129e62",
  },
  barFillWarning: {
    backgroundColor: "#d99a16",
  },
  barFillDanger: {
    backgroundColor: "#d94831",
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#185abc",
    minHeight: 54,
    justifyContent: "center",
    shadowColor: "#185abc",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
  },
  buttonDisabled: {
    opacity: 0.78,
  },
  buttonContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  buttonIcon: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    color: "#185abc",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  errorPanel: {
    backgroundColor: "#fff5f3",
    borderColor: "#ffb4a8",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  errorTitle: {
    color: "#9f2a16",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },
  error: {
    color: "#b42318",
    fontWeight: "700",
  },
  resultGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  resultPanel: {
    gap: 14,
  },
  decisionBanner: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  goodBanner: {
    backgroundColor: "#e8f8ef",
    borderColor: "#6fd39a",
  },
  warningBanner: {
    backgroundColor: "#fff7df",
    borderColor: "#f0c45a",
  },
  dangerBanner: {
    backgroundColor: "#fff0ed",
    borderColor: "#f59b8c",
  },
  bannerLabel: {
    color: "#526071",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  bannerValue: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  bannerCopy: {
    color: "#465568",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 230,
  },
  bannerBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(15,23,42,0.08)",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 76,
    padding: 10,
  },
  bannerBadgeValue: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
  },
  bannerBadgeLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 3,
    textTransform: "uppercase",
  },
  evidencePanel: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderColor: "#d9e1ec",
    borderWidth: 1,
    padding: 14,
  },
  evidenceText: {
    color: "#465568",
    fontSize: 14,
    lineHeight: 20,
  },
  evidenceScale: {
    gap: 10,
    marginTop: 12,
  },
  tracePanel: {
    borderRadius: 8,
    backgroundColor: "#101820",
    padding: 16,
  },
  traceTimeline: {
    gap: 0,
  },
  traceStatusText: {
    backgroundColor: "#182536",
    borderColor: "#334155",
    borderRadius: 8,
    borderWidth: 1,
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  traceStep: {
    alignItems: "flex-start",
    borderColor: "transparent",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  traceStepActive: {
    backgroundColor: "#142846",
    borderColor: "#2f7ee8",
  },
  traceStepDone: {
    backgroundColor: "#112c25",
    borderColor: "#1f8f5b",
  },
  traceStepError: {
    backgroundColor: "#3a1717",
    borderColor: "#dc2626",
  },
  traceRail: {
    alignItems: "center",
  },
  traceIndex: {
    backgroundColor: "#f2c94c",
    borderRadius: 12,
    color: "#101820",
    fontSize: 12,
    fontWeight: "900",
    height: 24,
    overflow: "hidden",
    paddingTop: 3,
    textAlign: "center",
    width: 24,
  },
  traceIndexActive: {
    backgroundColor: "#2f7ee8",
    color: "#ffffff",
  },
  traceIndexDone: {
    backgroundColor: "#27c46b",
    color: "#082014",
  },
  traceIndexError: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
  },
  traceLine: {
    backgroundColor: "#334155",
    flex: 1,
    minHeight: 24,
    width: 2,
  },
  traceLineDone: {
    backgroundColor: "#27c46b",
  },
  traceContent: {
    flex: 1,
    paddingBottom: 14,
  },
  traceText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  traceHint: {
    color: "#93a4b8",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },
});
