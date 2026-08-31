import { requisicao } from "../api";

export async function buscarCategorias() {
    const dados = await requisicao("/categorias");
    return Array.isArray(dados) ? dados : dados?.categorias || [];
}
