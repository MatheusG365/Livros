import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Acao({ icon, label, onPress, dark, destaque = false }) {
    return (
        <TouchableOpacity
            style={[styles.botao, dark && styles.botaoDark, destaque && styles.destaque]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Ionicons name={icon} size={18} color="#fff" />
            {label ? <Text style={styles.texto}>{label}</Text> : null}
        </TouchableOpacity>
    );
}

export default function BotoesAcao({ onFavoritos, onAtualizar, onCadastrarLivro, onLogin, onLogout, logado, dark }) {
    return (
        <View style={styles.linha}>
            <Acao icon="heart" label="Favoritos" onPress={onFavoritos} dark={dark} />
            <Acao icon="refresh" label="Atualizar" onPress={onAtualizar} dark={dark} />
            <Acao icon="add-circle" label="Livro" onPress={onCadastrarLivro} dark={dark} />
            {logado ? (
                <Acao icon="log-out-outline" label="Sair" onPress={onLogout} dark={dark} />
            ) : (
                <Acao icon="person-circle-outline" label="Entrar" onPress={onLogin} dark={dark} destaque />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    linha: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
    botao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#0066B3",
        borderRadius: 18,
        paddingVertical: 9,
        paddingHorizontal: 12,
    },
    botaoDark: { backgroundColor: "#2d6f9f" },
    destaque: { backgroundColor: "#174b6d" },
    texto: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
