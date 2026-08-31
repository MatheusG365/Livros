import React from "react";
import { Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

export default function CategoriaBotao({ categoria, selecionada, onPress }) {
    const dark = useColorScheme() === "dark";
    return (
        <TouchableOpacity
            style={[styles.botao, dark && styles.botaoDark, selecionada && styles.botaoSelecionado]}
            onPress={() => onPress(categoria)}
            activeOpacity={0.8}
        >
            <Text style={[styles.texto, dark && styles.textoDark, selecionada && styles.textoSelecionado]}>{categoria}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    botao: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 16, marginRight: 8 },
    botaoDark: { backgroundColor: "#202020", borderColor: "#444" },
    botaoSelecionado: { backgroundColor: "#0066B3", borderColor: "#0066B3" },
    texto: { fontSize: 13, fontWeight: "500", color: "#333" },
    textoDark: { color: "#ddd" },
    textoSelecionado: { color: "#fff", fontWeight: "bold" },
});
