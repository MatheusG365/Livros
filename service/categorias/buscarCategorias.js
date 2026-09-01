import { requisicao } from "../api";

export async function buscarCategorias() {
  try {
    const dados = await requisicao("/categorias");
    return Array.isArray(dados) ? dados : dados?.categorias || dados?.data || [];
  } catch {
    return [];
  }
}
