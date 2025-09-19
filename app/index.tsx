import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const [input, setInput] = useState("");

  const handlePress = (value: string): void => {
    if (value === "C") {
      setInput("");
    } else if (value === "D") {
      setInput(input.slice(0, -1));
    } else if (value === "=") {
      if (!input || input === "0") return;
      try {
        // Replace custom symbols with JS operators
        const expression = input
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/%/g, "/100");

        setInput(eval(expression).toString());
      } catch {
        setInput("Error");
      }
    } else {
      setInput(input + value);
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
      <View style={styles.display}>
        <Text style={styles.displayText}>{input || "0"}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#000" },
  display: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  displayText: { fontSize: 40, color: "#fff" },
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
