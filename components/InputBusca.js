import React from "react";
import { View, TextInput, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InputBusca({ value, onChangeText }) {
    const dark = useColorScheme() === "dark";
    return (
        <View style={[styles.container, dark && styles.containerDark]}>
            <Ionicons name="search-outline" size={20} color={dark ? "#aaa" : "#777"} />
            <TextInput
                style={[styles.input, dark && styles.inputDark]}
                placeholder="Buscar por título ou autor..."
                placeholderTextColor={dark ? "#888" : "#777"}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: "row", alignItems: "center", width: "100%", height: 50, marginVertical: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 12, paddingHorizontal: 13, backgroundColor: "#fff" },
    containerDark: { backgroundColor: "#202020", borderColor: "#444" },
    input: { flex: 1, marginLeft: 8, fontSize: 16, color: "#222" },
    inputDark: { color: "#fff" },
});
