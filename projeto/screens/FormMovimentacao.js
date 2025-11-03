import React from "react";
import { View, Text } from "react-native";

export default function FormMovimentacao() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0e1a2b",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 20 }}>
        Registrar Movimentação
      </Text>
    </View>
  );
}
