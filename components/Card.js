import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function obterPreco(livro) {
    const valor = livro?.preco ?? livro?.price ?? livro?.valor;
    if (valor === undefined || valor === null || valor === "") return null;
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
}

export default function Card({ livro, onPress, favorito, onFavorito, modoEscuro, podeFavoritar = true }) {
    const preco = obterPreco(livro);

    function favoritar(event) {
        event?.stopPropagation?.();
        onFavorito?.(livro);
    }

    return (
        <TouchableOpacity
            style={[styles.card, modoEscuro && styles.cardEscuro]}
            onPress={() => onPress(livro)}
            activeOpacity={0.85}
        >
            <View style={[styles.imagemContainer, modoEscuro && styles.imagemDark]}>
                {livro.imagem || livro.capa ? (
                    <Image source={{ uri: livro.imagem || livro.capa }} style={styles.imagem} resizeMode="contain" />
                ) : (
                    <Ionicons name="book-outline" size={52} color={modoEscuro ? "#888" : "#777"} />
                )}
                {podeFavoritar && (
                    <TouchableOpacity style={styles.favorito} onPress={favoritar} hitSlop={8}>
                        <Ionicons name={favorito ? "heart" : "heart-outline"} size={21} color={favorito ? "#d21f3c" : "#333"} />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={[styles.titulo, modoEscuro && styles.textoEscuro]} numberOfLines={2}>
                {livro.titulo || livro.title || "Sem título"}
            </Text>
            <Text style={[styles.informacao, modoEscuro && styles.informacaoEscura]} numberOfLines={2}>
                {livro.categoria || livro.category || "Sem categoria"} • {livro.autor || livro.author || "Autor não informado"}
            </Text>
            <Text style={[styles.preco, modoEscuro && styles.precoDark]}>
                {preco === null ? "Preço não informado" : `R$ ${preco.toFixed(2).replace(".", ",")}`}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { width: "48%", backgroundColor: "#fff", borderRadius: 14, padding: 8, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 4 },
    cardEscuro: { backgroundColor: "#1e1e1e" },
    imagemContainer: { height: 180, borderRadius: 10, backgroundColor: "#f0f0f0", overflow: "hidden", marginBottom: 8, position: "relative", alignItems: "center", justifyContent: "center" },
    imagemDark: { backgroundColor: "#292929" },
    imagem: { width: "100%", height: "100%" },
    favorito: { position: "absolute", right: 7, top: 7, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.94)", justifyContent: "center", alignItems: "center" },
    titulo: { fontSize: 15, fontWeight: "bold", color: "#222", marginBottom: 5 },
    textoEscuro: { color: "#fff" },
    informacao: { fontSize: 12, color: "#555" },
    informacaoEscura: { color: "#bbb" },
    preco: { fontSize: 13, fontWeight: "bold", color: "#0066B3", marginTop: 7 },
    precoDark: { color: "#63b4ef" },
});
