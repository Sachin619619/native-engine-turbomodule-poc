import React from "react";
import { StyleSheet, Text, View } from "react-native";

const LOG_TAG = "[ResultCard.tsx]";

interface ResultCardProps {
  title: string;
  value: string;
  tone?: "neutral" | "good" | "warning" | "danger";
}

export function ResultCard({ title, value, tone = "neutral" }: ResultCardProps) {
  console.log(`${LOG_TAG} Rendering card "${title}" with value "${value}" and tone "${tone}".`);

  return (
    <View style={[styles.card, styles[tone]]}>
      <View style={styles.cardTopRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.toneDot, styles[`${tone}Dot`]]} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d7dee8",
    backgroundColor: "#ffffff",
    padding: 16,
    shadowColor: "#24364a",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
  },
  neutral: {
    borderColor: "#d7dee8",
  },
  good: {
    borderColor: "#86efac",
    backgroundColor: "#f0fdf4",
  },
  warning: {
    borderColor: "#fde68a",
    backgroundColor: "#fffbeb",
  },
  danger: {
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
  },
  cardTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  toneDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  neutralDot: {
    backgroundColor: "#94a3b8",
  },
  goodDot: {
    backgroundColor: "#16a34a",
  },
  warningDot: {
    backgroundColor: "#d97706",
  },
  dangerDot: {
    backgroundColor: "#dc2626",
  },
  title: {
    color: "#526071",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  value: {
    color: "#0f172a",
    fontSize: 26,
    fontWeight: "900",
  },
});
