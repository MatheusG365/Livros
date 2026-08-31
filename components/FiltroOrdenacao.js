import React from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FiltroOrdenacao({ ordenacao, setOrdenacao, modoEscuro }) {
    const opcoes = [
        ["nenhuma", "Normal", "list"],
        ["az", "A-Z", "text"]
    ];

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
            {opcoes.map(([valor, titulo, icon]) => (
                <TouchableOpacity
                    key={valor}
                    onPress={() => setOrdenacao(valor)}
                    style={[
                        styles.botao,
                        modoEscuro && styles.botaoEscuro,
                        ordenacao === valor && styles.selecionado,
                    ]}
                >
                    <Ionicons
                        name={icon}
                        size={15}
                        color={ordenacao === valor ? "#fff" : modoEscuro ? "#ddd" : "#333"}
                    />
                    <Text style={[
                        styles.texto,
                        modoEscuro && styles.textoEscuro,
                        ordenacao === valor && styles.textoSelecionado,
                    ]}>{titulo}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { marginBottom: 8 },
    botao: {
        flexDirection: "row", alignItems: "center", gap: 5,
        borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff",
        borderRadius: 16, paddingVertical: 7, paddingHorizontal: 12, marginRight: 7,
    },
    botaoEscuro: { backgroundColor: "#222", borderColor: "#444" },
    selecionado: { backgroundColor: "#0066B3", borderColor: "#0066B3" },
    texto: { color: "#333", fontSize: 12, fontWeight: "600" },
    textoEscuro: { color: "#eee" },
    textoSelecionado: { color: "#fff" },
});
