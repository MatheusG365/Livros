import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const AppContext = createContext(null);
const SESSAO_KEY = "livraria_sessao";
const TOKEN_KEY = "livraria_token";

export function AppProvider({ children }) {
    const [sessao, setSessao] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [pronto, setPronto] = useState(false);
    const esquema = useColorScheme();
    const modoEscuro = esquema === "dark";

    useEffect(() => {
        async function iniciar() {
            try {
                const sessaoSalva = await AsyncStorage.getItem(SESSAO_KEY);
                if (sessaoSalva) {
                    setSessao(JSON.parse(sessaoSalva));
                }
            } catch (error) {
                console.log("Erro ao recuperar sessão:", error);
            } finally {
                setPronto(true);
            }
        }
        iniciar();
    }, []);

    useEffect(() => {
        async function carregarFavoritosDoUsuario() {
            if (!sessao?.identificador) {
                setFavoritos([]);
                return;
            }

            try {
                const chave = `livraria_favoritos_${sessao.identificador}`;
                const salvo = await AsyncStorage.getItem(chave);
                setFavoritos(salvo ? JSON.parse(salvo) : []);
            } catch (error) {
                console.log("Erro ao carregar favoritos:", error);
                setFavoritos([]);
            }
        }

        carregarFavoritosDoUsuario();
    }, [sessao]);

    async function entrarSessao(usuario, token = null) {
        const identificador = String(
            usuario?.id || usuario?.email || usuario?.username || "usuario"
        ).toLowerCase();

        const novaSessao = {
            identificador,
            usuario: usuario || {},
            origem: token ? "api" : "local",
        };

        await AsyncStorage.setItem(SESSAO_KEY, JSON.stringify(novaSessao));
        if (token) {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        }
        setSessao(novaSessao);
    }

    async function sair() {
        await AsyncStorage.removeItem(SESSAO_KEY);
        await AsyncStorage.removeItem(TOKEN_KEY);
        setSessao(null);
        setFavoritos([]);
    }

    async function alternarFavorito(livro) {
        if (!sessao?.identificador) return false;

        const chave = `livraria_favoritos_${sessao.identificador}`;
        const existe = favoritos.some((item) => String(item.id) === String(livro.id));
        const novos = existe
            ? favoritos.filter((item) => String(item.id) !== String(livro.id))
            : [...favoritos, livro];

        setFavoritos(novos);
        await AsyncStorage.setItem(chave, JSON.stringify(novos));
        return true;
    }

    return (
        <AppContext.Provider
            value={{
                sessao,
                logado: Boolean(sessao),
                favoritos,
                alternarFavorito,
                entrarSessao,
                sair,
                modoEscuro,
                pronto,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
