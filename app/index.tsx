import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { height } = Dimensions.get("window");

export default function App() {
  const [input, setInput] = useState("0");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(height)).current;

  const evaluateExpression = (expr: string) => {
    expr = expr.trim();
    expr = expr.replace(/[\+\-\*\/]+$/, "");
    if (!expr) return "0";

    const regex = /^-?\d+(\.\d+)?(\s*[\+\-\*\/]\s*-?\d+(\.\d+)?)*$/;
    if (!regex.test(expr)) return "0";

    try {
      return Function(`"use strict"; return (${expr})`)().toString();
    } catch {
      return "0";
    }
  };

  const handlePress = (value: string): void => {
    if (value === "C") {
      setInput("0");
      setResult("0");
    } else if (value === "D") {
      const newInput = input.length > 1 ? input.slice(0, -1) : "0";
      setInput(newInput);
      setResult(evaluateExpression(formatExpression(newInput)));
    } else if (value === "=") {
      setInput(result);
      setHistory([{ expr: input, res: result }, ...history]);
    } else {
      const newInput = input === "0" ? value : input + value;
      setInput(newInput);
      setResult(evaluateExpression(formatExpression(newInput)));
    }
  };

  const formatExpression = (expr: string) =>
    expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");

  const toggleHistory = () => {
    if (!historyVisible) {
      setHistoryVisible(true);
      Animated.timing(slideAnim, {
        toValue: height * 0.2,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setHistoryVisible(false));
    }
  };

  const buttons = [
    ["D", "C", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["00", "0", ".", "="],
  ];

  const renderButtonContent = (btn: string) => {
    switch (btn) {
      case "D":
        return <Ionicons name="backspace-outline" size={28} color="white" />;
      default:
        return <Text style={styles.buttonText}>{btn}</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Left I Button */}
      <TouchableOpacity style={styles.infoButton} onPress={toggleHistory}>
        <Ionicons name="information-circle-outline" size={32} color="#fff" />
      </TouchableOpacity>

      <View style={styles.display}>
        <Text numberOfLines={1} ellipsizeMode="head" style={styles.inputText}>
          {result}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="head" style={styles.resultText}>
          {input || "0"} 
        </Text>
      </View>

      <View style={styles.buttons}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((btn) => (
              <TouchableOpacity
                key={btn}
                style={[
                  styles.button,
                  btn === "D" ? styles.redButton : null,
                  btn === "C" ? styles.orangeButton : null,
                  btn === "=" ? styles.greenButton : null,
                ]}
                onPress={() => handlePress(btn)}
              >
                {renderButtonContent(btn)}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* History Sliding Panel */}
      {historyVisible && (
        <Animated.View style={[styles.historyPanel, { top: slideAnim }]}>
          <Text style={styles.historyTitle}>History</Text>
          <ScrollView>
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyExpr}>{item.expr}</Text>
                <Text style={styles.historyRes}>{item.res}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  infoButton: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  display: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  resultText: { fontSize: 60, color: "#fff", fontWeight: "700" },
  inputText: { fontSize: 32, color: "#888", marginTop: 5 },

  // History Panel
  historyPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.8,
    backgroundColor: "#111",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  historyTitle: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 10 },
  historyItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  historyExpr: { color: "#ccc", fontSize: 18 },
  historyRes: { color: "#fff", fontSize: 18, fontWeight: "700" },

  buttons: { flex: 2, padding: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  button: {
    flex: 1,
    margin: 6,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    height: 80,
  },
  redButton: { backgroundColor: "#a83232" },
  greenButton: { backgroundColor: "#2e8b57" },
  orangeButton: { backgroundColor: "#FF8B00" },
  buttonText: { fontSize: 24, color: "#fff" },
});
