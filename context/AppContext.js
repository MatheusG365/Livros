import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { getUsuario, getToken, limparDados } from "../service/usuario/usuarioStorage";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [pronto, setPronto] = useState(false);
  const dark = useColorScheme() === "dark";

  useEffect(() => {
    (async () => {
      try {
        const [u, t] = await Promise.all([getUsuario(), getToken()]);
        setUsuario(u); setToken(t);
      } finally { setPronto(true); }
    })();
  }, []);

  useEffect(() => {
    if (!usuario) { setFavoritos([]); return; }
    const key = `livraria_favoritos_${String(usuario.id || usuario.email || "usuario").toLowerCase()}`;
    AsyncStorage.getItem(key).then((v) => setFavoritos(v ? JSON.parse(v) : [])).catch(() => setFavoritos([]));
  }, [usuario]);

  async function entrarSessao(u, t) {
    setUsuario(u); setToken(t);
  }

  async function sair() {
    await limparDados(); setUsuario(null); setToken(null); setFavoritos([]);
  }

  async function alternarFavorito(livro) {
    if (!usuario) return false;
    const key = `livraria_favoritos_${String(usuario.id || usuario.email || "usuario").toLowerCase()}`;
    const existe = favoritos.some((x) => String(x.id) === String(livro.id));
    const novos = existe ? favoritos.filter((x) => String(x.id) !== String(livro.id)) : [...favoritos, livro];
    setFavoritos(novos); await AsyncStorage.setItem(key, JSON.stringify(novos)); return true;
  }

  return <AppContext.Provider value={{ usuario, token, logado: !!token, favoritos, alternarFavorito, entrarSessao, sair, modoEscuro: dark, pronto }}>{children}</AppContext.Provider>;
}
export function useApp() { return useContext(AppContext); }
