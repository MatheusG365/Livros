import { requisicao } from "../api";

export async function listarUsuarios() {
  const dados = await requisicao("/usuarios");
  return Array.isArray(dados) ? dados : dados?.usuarios || dados?.users || dados?.data || [];
}

export async function cadastrarUsuarioAPI(usuario) {
  return requisicao("/usuarios", { method: "POST", body: JSON.stringify(usuario) });
}

export async function editarUsuario(id, usuario) {
  return requisicao(`/usuarios/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(usuario) });
}

export async function obterUsuario(id) {
  return requisicao(`/usuarios/${encodeURIComponent(id)}`);
}
