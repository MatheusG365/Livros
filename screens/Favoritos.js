import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import { useApp } from "../context/AppContext";

export default function Favoritos({ navigation }) {
    const { favoritos, alternarFavorito, logado } = useApp();
    const dark = useColorScheme() === "dark";

    if (!logado) {
        return (
            <View style={[styles.vazioTela, dark && styles.containerDark]}>
                <Ionicons name="lock-closed-outline" size={54} color="#0066B3" />
                <Text style={[styles.tituloVazio, dark && styles.textoDark]}>Favoritos protegidos</Text>
                <Text style={[styles.texto, dark && styles.textoDark]}>Faça login para acessar sua lista de livros favoritos.</Text>
                <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.botaoTexto}>Entrar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, dark && styles.containerDark]} contentContainerStyle={styles.conteudo}>
            {favoritos.length === 0 ? (
                <View style={styles.vazio}>
                    <Ionicons name="heart-outline" size={70} color="#0066B3" />
                    <Text style={[styles.texto, dark && styles.textoDark]}>Você ainda não possui favoritos.</Text>
                </View>
            ) : (
                <View style={styles.lista}>
                    {favoritos.map((livro) => (
                        <Card
                            key={livro.id}
                            livro={livro}
                            onPress={(item) => navigation.navigate("DetalhesLivro", { livro: item })}
                            favorito
                            onFavorito={alternarFavorito}
                            modoEscuro={dark}
                        />
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    containerDark: { backgroundColor: "#121212" },
    conteudo: { padding: 15, flexGrow: 1 },
    lista: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    vazio: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 100 },
    vazioTela: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30, backgroundColor: "#f5f5f5" },
    tituloVazio: { fontSize: 22, fontWeight: "800", marginTop: 14, marginBottom: 8, color: "#222" },
    texto: { fontSize: 16, color: "#444", textAlign: "center", lineHeight: 23 },
    textoDark: { color: "#fff" },
    botao: { marginTop: 18, backgroundColor: "#0066B3", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
    botaoTexto: { color: "#fff", fontWeight: "800" },
});
