import { requisicao } from "../api";

export async function buscarLivros({ setLivros, setCarregando, setErro }) {
    if (setCarregando) setCarregando(true);
    if (setErro) setErro("");

    try {
        const resultado = await requisicao("/livros");
        const lista = Array.isArray(resultado) ? resultado : resultado?.livros || [];
        setLivros(lista);
        return lista;
    } catch (error) {
        console.log("ERRO AO BUSCAR LIVROS:", error);
        if (setErro) setErro("Não foi possível carregar os livros. Tente novamente.");
        throw error;
    } finally {
        if (setCarregando) setCarregando(false);
    }
}
