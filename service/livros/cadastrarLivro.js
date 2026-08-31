
import { requisicao } from "../api";

export async function cadastrarLivro(livro) {
    try {
        const resposta = await requisicao("/livros", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(livro),
        });

        return resposta;
    } catch (error) {
        console.error("Erro ao cadastrar livro:", error);
        throw error;
    }
}

