export const API_URL = "https://apps-api-livros.ucxocw.easypanel.host";

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getToken() {
  return AsyncStorage.getItem("livraria_token");
}

function extrairMensagem(dados, status) {
  if (!dados) return `Erro HTTP ${status}`;
  if (typeof dados === "string") return dados;
  if (Array.isArray(dados?.detail)) {
    return dados.detail.map((e) => e?.msg || e?.message).filter(Boolean).join("\n") || `Erro HTTP ${status}`;
  }
  return dados?.detail || dados?.message || dados?.mensagem || dados?.erro || `Erro HTTP ${status}`;
}

export async function requisicao(endpoint, opcoes = {}) {
  const token = await getToken();
  const headers = {
    Accept: "application/json",
    ...(opcoes.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(opcoes.headers || {}),
  };

  if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${API_URL}${endpoint}`, { ...opcoes, headers });
  const texto = await resposta.text();
  let dados = null;
  try { dados = texto ? JSON.parse(texto) : null; } catch { dados = texto; }

  if (!resposta.ok) {
    const erro = new Error(extrairMensagem(dados, resposta.status));
    erro.status = resposta.status;
    erro.data = dados;
    throw erro;
  }
  return dados;
}
