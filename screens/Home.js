import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Alert,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Card from "../components/Card";
import CategoriaBotao from "../components/CategoriaBotao";
import Titulo from "../components/Titulo";
import InputBuscar from "../components/InputBusca";
import BotoesAcao from "../components/BotoesAcao";
import FiltroOrdenacao from "../components/FiltroOrdenacao";
import { buscarLivros } from "../service/livros/buscarLivros";
import { buscarCategorias } from "../service/categorias/buscarCategorias";
import { useApp } from "../context/AppContext";

function obterPreco(livro) {
    const valor = livro?.preco ?? livro?.price ?? livro?.valor;
    if (valor === undefined || valor === null || valor === "") return null;
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
}

export default function Home({ navigation }) {
    const [livros, setLivros] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [ordenacao, setOrdenacao] = useState("nenhuma");
    const [precoMinimo, setPrecoMinimo] = useState("");
    const [precoMaximo, setPrecoMaximo] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [atualizando, setAtualizando] = useState(false);
    const dark = useColorScheme() === "dark";
    const { favoritos, alternarFavorito, logado, sair } = useApp();

    const carregarLivros = useCallback(async (refresh = false) => {
        if (refresh) setAtualizando(true);
        try {
            await buscarLivros({ setLivros, setCarregando, setErro });
        } finally {
            if (refresh) setAtualizando(false);
        }
    }, []);

    const carregarCategorias = useCallback(async () => {
        try {
            setCategorias(await buscarCategorias());
        } catch (error) {
            console.log("ERRO AO CARREGAR CATEGORIAS:", error);
        }
    }, []);

    useEffect(() => {
        carregarLivros();
        carregarCategorias();
    }, [carregarLivros, carregarCategorias]);

    const possuiPreco = useMemo(() => livros.some((livro) => obterPreco(livro) !== null), [livros]);

    const livrosFiltrados = useMemo(() => {
        const texto = busca.toLowerCase().trim();
        const minimo = precoMinimo ? Number(precoMinimo.replace(",", ".")) : null;
        const maximo = precoMaximo ? Number(precoMaximo.replace(",", ".")) : null;

        let resultado = livros.filter((livro) => {
            const titulo = String(livro.titulo ?? livro.title ?? "").toLowerCase();
            const autor = String(livro.autor ?? livro.author ?? "").toLowerCase();
            const categoria = String(livro.categoria ?? livro.category ?? "").trim().toLowerCase();
            const preco = obterPreco(livro);

            const correspondeBusca = !texto || titulo.includes(texto) || autor.includes(texto);
            const correspondeCategoria =
                categoriaSelecionada === null ||
                categoria === String(categoriaSelecionada).trim().toLowerCase();
            const correspondeMinimo = minimo === null || (preco !== null && preco >= minimo);
            const correspondeMaximo = maximo === null || (preco !== null && preco <= maximo);

            return correspondeBusca && correspondeCategoria && correspondeMinimo && correspondeMaximo;
        });

        if (ordenacao === "az") {
            resultado.sort((a, b) => String(a.titulo ?? a.title ?? "").localeCompare(String(b.titulo ?? b.title ?? "")));
        }
        if (ordenacao === "precoMenor") {
            resultado.sort((a, b) => (obterPreco(a) ?? Infinity) - (obterPreco(b) ?? Infinity));
        }
        if (ordenacao === "precoMaior") {
            resultado.sort((a, b) => (obterPreco(b) ?? -Infinity) - (obterPreco(a) ?? -Infinity));
        }

        return resultado;
    }, [livros, busca, categoriaSelecionada, ordenacao, precoMinimo, precoMaximo]);

    function exigirLogin() {
        Alert.alert("Faça login", "Entre na sua conta para usar os favoritos.", [
            { text: "Agora não", style: "cancel" },
            { text: "Entrar", onPress: () => navigation.navigate("Login") },
        ]);
    }

    async function favoritar(livro) {
        if (!logado) {
            exigirLogin();
            return;
        }
        await alternarFavorito(livro);
    }

    function abrirFavoritos() {
        if (!logado) {
            exigirLogin();
            return;
        }
        navigation.navigate("Favoritos");
    }

    function abrirCadastroLivro() {
        if (!logado) {
            Alert.alert("Faça login", "Entre na sua conta para cadastrar um livro.", [
                { text: "Cancelar", style: "cancel" },
                { text: "Entrar", onPress: () => navigation.navigate("Login") },
            ]);
            return;
        }
        navigation.navigate("CadastroLivro");
    }

    async function deslogar() {
        await sair();
        Alert.alert("Sessão encerrada", "Você foi desconectado.");
    }

    return (
        <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={atualizando} onRefresh={() => carregarLivros(true)} />}
            >
                <Titulo />

                <BotoesAcao
                    onFavoritos={abrirFavoritos}
                    onAtualizar={() => carregarLivros(true)}
                    onCadastrarLivro={abrirCadastroLivro}
                    onLogin={() => navigation.navigate("Login")}
                    onLogout={deslogar}
                    logado={logado}
                    dark={dark}
                />

                {logado ? (
                    <View style={[styles.statusConta, dark && styles.statusContaDark]}>
                        <Ionicons name="person-circle" size={18} color="#0066B3" />
                        <Text style={[styles.statusTexto, dark && styles.textoDark]}>Você está logado</Text>
                    </View>
                ) : null}

                <InputBuscar value={busca} onChangeText={setBusca} />
                <FiltroOrdenacao ordenacao={ordenacao} setOrdenacao={setOrdenacao} modoEscuro={dark} />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollCategorias} contentContainerStyle={styles.listaCategorias}>
                    <CategoriaBotao categoria="Todas" selecionada={categoriaSelecionada === null} onPress={() => setCategoriaSelecionada(null)} />
                    {categorias.map((categoria) => (
                        <CategoriaBotao
                            key={categoria}
                            categoria={categoria}
                            selecionada={categoriaSelecionada === categoria}
                            onPress={(valor) => setCategoriaSelecionada((anterior) => anterior === valor ? null : valor)}
                        />
                    ))}
                </ScrollView>

                {carregando ? (
                    <View style={styles.estado}>
                        <ActivityIndicator size="large" color="#0066B3" />
                        <Text style={[styles.estadoTexto, dark && styles.textoDark]}>Carregando livros...</Text>
                    </View>
                ) : erro ? (
                    <View style={styles.estado}>
                        <Ionicons name="cloud-offline-outline" size={46} color="#c62828" />
                        <Text style={styles.erro}>{erro}</Text>
                        <TouchableOpacity style={styles.tentar} onPress={() => carregarLivros(true)}>
                            <Text style={styles.tentarTexto}>Tentar novamente</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.lista}>
                        {livrosFiltrados.length === 0 ? (
                            <Text style={[styles.vazio, dark && styles.textoDark]}>Nenhum livro encontrado.</Text>
                        ) : livrosFiltrados.map((livro) => (
                            <Card
                                key={livro.id}
                                livro={livro}
                                onPress={(item) => navigation.navigate("DetalhesLivro", { livro: item })}
                                favorito={favoritos.some((item) => String(item.id) === String(livro.id))}
                                onFavorito={favoritar}
                                modoEscuro={dark}
                                podeFavoritar={true}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 15, paddingTop: 10, backgroundColor: "#f5f5f5" },
    containerDark: { backgroundColor: "#121212" },
    statusConta: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", marginBottom: 4 },
    statusContaDark: { opacity: 0.95 },
    statusTexto: { color: "#555", fontSize: 12, fontWeight: "600" },
    textoDark: { color: "#fff" },
    scrollCategorias: { marginTop: 8, marginBottom: 12, maxHeight: 50 },
    listaCategorias: { alignItems: "center", paddingRight: 15 },
    lista: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingBottom: 30, paddingTop: 4 },
    estado: { alignItems: "center", justifyContent: "center", paddingVertical: 60, paddingHorizontal: 20 },
    estadoTexto: { marginTop: 12, color: "#333", fontSize: 16 },
    erro: { color: "#c62828", textAlign: "center", fontSize: 15, marginVertical: 12 },
    tentar: { backgroundColor: "#0066B3", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
    tentarTexto: { color: "#fff", fontWeight: "700" },
    vazio: { width: "100%", textAlign: "center", marginTop: 30, fontSize: 16, color: "#444" },
});
