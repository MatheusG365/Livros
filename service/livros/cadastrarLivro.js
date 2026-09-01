import { requisicao } from "../api";

export async function cadastrarLivro(livro) {
    return requisicao("/livros", {
        method: "POST",
        body: JSON.stringify({
            imagem: livro.imagem,
            titulo: livro.titulo,
            categoria: livro.categoria,
            descricao: livro.descricao,
            autor: livro.autor,
            faixa_etaria: livro.faixa_etaria,
        }),
    });
}

