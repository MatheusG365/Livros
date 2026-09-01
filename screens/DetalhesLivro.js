import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import { useApp } from "../context/AppContext";

function obterPreco(livro) {
    const valor = livro?.preco ?? livro?.price ?? livro?.valor;
    const numero = Number(valor);
    return valor !== undefined && valor !== null && valor !== "" && Number.isFinite(numero) ? numero : null;
}

export default function DetalhesLivro({ route, navigation }) {
    const { livro } = route.params || {};
    const { favoritos, alternarFavorito, logado } = useApp();
    const dark = useColorScheme() === "dark";
    const favorito = favoritos.some((item) => String(item.id) === String(livro?.id));

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

    if (!livro) {
        return <View style={styles.erro}><Text>Livro não encontrado.</Text></View>;
    }

    const preco = obterPreco(livro);

    function favoritar() {
        if (!logado) {
            Alert.alert("Faça login", "Entre para adicionar livros aos favoritos.", [
                { text: "Cancelar", style: "cancel" },
                { text: "Entrar", onPress: () => navigation.navigate("Login") },
            ]);
            return;
        }
        alternarFavorito(livro);
    }

    const campo = (nome, valor) => {
        if (valor === undefined || valor === null || valor === "") return null;
        return (
            <View style={styles.campo}>
                <Text style={styles.label}>{nome}</Text>
                <Text style={[styles.informacao, dark && styles.informacaoDark]}>{String(valor)}</Text>
            </View>
        );
    };

    return (
        <ScrollView style={[styles.container, dark && styles.containerDark]} contentContainerStyle={styles.conteudo}>
            <View style={styles.capaBox}>
                {livro.imagem || livro.capa ? (
                    <Image source={{ uri: livro.imagem || livro.capa }} style={styles.imagem} resizeMode="contain" />
                ) : (
                    <Ionicons name="book-outline" size={90} color={dark ? "#777" : "#888"} />
                )}
            </View>

            <Text style={[styles.titulo, dark && styles.textoDark]}>{livro.titulo || livro.title || "Sem título"}</Text>
            <Text style={[styles.autor, dark && styles.autorDark]}>{livro.autor || livro.author || "Autor não informado"}</Text>

            <TouchableOpacity style={styles.favoritoBotao} onPress={favoritar} activeOpacity={0.85}>
                <Ionicons name={favorito ? "heart" : "heart-outline"} size={20} color="#fff" />
                <Text style={styles.favoritoTexto}>{favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}</Text>
            </TouchableOpacity>

            {campo("Categoria", livro.categoria ?? livro.category)}
            {campo("Preço", preco === null ? "Preço não informado" : `R$ ${preco.toFixed(2).replace(".", ",")}`)}
            {campo("Ano", livro.ano ?? livro.year)}
            {campo("ISBN", livro.isbn)}
            {campo("Editora", livro.editora ?? livro.publisher)}
            {campo("Páginas", livro.paginas ?? livro.pages)}

            {livro.descricao || livro.description ? (
                <>
                    <Text style={styles.subtitulo}>Descrição</Text>
                    <Text style={[styles.descricao, dark && styles.informacaoDark]}>{livro.descricao || livro.description}</Text>
                </>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    containerDark: { backgroundColor: "#121212" },
    conteudo: { padding: 20, paddingBottom: 40 },
    capaBox: { width: "100%", height: 330, borderRadius: 18, backgroundColor: "#e9e9e9", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 18 },
    imagem: { width: "100%", height: "100%" },
    titulo: { fontSize: 28, fontWeight: "800", color: "#222", marginBottom: 5 },
    textoDark: { color: "#fff" },
    autor: { fontSize: 16, color: "#666", marginBottom: 16 },
    autorDark: { color: "#aaa" },
    favoritoBotao: { flexDirection: "row", gap: 8, backgroundColor: "#0066B3", borderRadius: 12, padding: 13, alignItems: "center", justifyContent: "center", marginBottom: 20 },
    favoritoTexto: { color: "#fff", fontWeight: "700" },
    campo: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#ccc", paddingVertical: 10 },
    label: { color: "#0066B3", fontWeight: "800", fontSize: 12, marginBottom: 3 },
    informacao: { fontSize: 16, color: "#444" },
    informacaoDark: { color: "#ddd" },
    subtitulo: { fontSize: 20, fontWeight: "800", color: "#0066B3", marginTop: 18, marginBottom: 8 },
    descricao: { fontSize: 16, lineHeight: 25, color: "#555" },
    erro: { flex: 1, alignItems: "center", justifyContent: "center" },
});
