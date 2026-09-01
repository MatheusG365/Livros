import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "livraria_token";
const USER_KEY = "livraria_usuario";

// Salvar usuário
export async function salvarUsuario(usuario) {
  const usuarioSeguro = {
    id: usuario?.id,
    nome: usuario?.nome,
    email: usuario?.email,
  };

  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(usuarioSeguro)
  );

  return usuarioSeguro;
}

// Compatibilidade com código antigo
export async function salvarUsuairo(
  id,
  nome,
  email,
  senha = undefined,
  extra = {}
) {
  const atual = await getUsuario();

  const usuario = {
    ...(atual || {}),
    ...extra,
    id,
    nome,
    email,
  };

  // NÃO salvar senha no armazenamento local
  // O parâmetro é mantido apenas para não quebrar
  // chamadas antigas da aplicação.

  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(usuario)
  );

  return usuario;
}

// Salvar token recebido no login
export async function salvarToken(token) {
  if (!token) {
    throw new Error("Token inválido.");
  }

  await AsyncStorage.setItem(
    TOKEN_KEY,
    String(token)
  );

  console.log("Token salvo com sucesso.");
}

// Recuperar token
export async function getToken() {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

// Recuperar usuário
export async function getUsuario() {
  const salvo = await AsyncStorage.getItem(USER_KEY);

  if (!salvo) {
    return null;
  }

  try {
    return JSON.parse(salvo);
  } catch (error) {
    console.log("Erro ao ler usuário:", error);
    return null;
  }
}

// Limpar login
export async function limparDados() {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_KEY,
    "usuario",
  ]);
}

// Compatibilidade com código antigo
export const liparDados = limparDados;

