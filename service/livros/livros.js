
import { requisicao } from "../api";


// ============================================================
// CADASTRAR LIVRO
// POST /livros
// ============================================================

export async function cadastrarLivro(livro) {

    if (!livro) {
        throw new Error(
            "Os dados do livro não foram informados."
        );
    }


    const dados = {
        titulo: livro.titulo,
        autor: livro.autor,
        categoria: livro.categoria,
        descricao: livro.descricao,
    };


    // Só envia ano se foi informado
    if (
        livro.ano !== undefined &&
        livro.ano !== null &&
        livro.ano !== ""
    ) {
        dados.ano = Number(livro.ano);
    }


    // Só envia preço se foi informado
    if (
        livro.preco !== undefined &&
        livro.preco !== null &&
        livro.preco !== ""
    ) {
        dados.preco = Number(livro.preco);
    }


    // Só envia imagem se foi informada
    if (
        livro.imagem &&
        String(livro.imagem).trim() !== ""
    ) {
        dados.imagem =
            String(livro.imagem).trim();
    }


    console.log(
        "================================"
    );

    console.log(
        "CADASTRANDO LIVRO"
    );

    console.log(
        "POST /livros"
    );

    console.log(
        "Dados:",
        dados
    );

    console.log(
        "================================"
    );


    return await requisicao(
        "/livros",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify(
                dados
            ),
        }
    );
}


// ============================================================
// EDITAR LIVRO
// PUT /livros/{id}
// ============================================================

export async function editarLivro(
    id,
    livro
) {

    if (!id) {
        throw new Error(
            "ID do livro não informado."
        );
    }


    if (!livro) {
        throw new Error(
            "Os dados do livro não foram informados."
        );
    }


    const dados = {
        titulo: livro.titulo,
        autor: livro.autor,
        categoria: livro.categoria,
        descricao: livro.descricao,
    };


    if (
        livro.ano !== undefined &&
        livro.ano !== null &&
        livro.ano !== ""
    ) {
        dados.ano = Number(livro.ano);
    }


    if (
        livro.preco !== undefined &&
        livro.preco !== null &&
        livro.preco !== ""
    ) {
        dados.preco = Number(livro.preco);
    }


    if (
        livro.imagem &&
        String(livro.imagem).trim() !== ""
    ) {
        dados.imagem =
            String(livro.imagem).trim();
    }


    console.log(
        "================================"
    );

    console.log(
        "EDITANDO LIVRO"
    );

    console.log(
        `PUT /livros/${id}`
    );

    console.log(
        "Dados:",
        dados
    );

    console.log(
        "================================"
    );


    return await requisicao(
        `/livros/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify(
                dados
            ),
        }
    );
}


// ============================================================
// EXCLUIR LIVRO
// DELETE /livros/{id}
// ============================================================

export async function excluirLivro(
    id
) {

    if (!id) {
        throw new Error(
            "ID do livro não informado."
        );
    }


    console.log(
        `DELETE /livros/${id}`
    );


    return await requisicao(
        `/livros/${id}`,
        {
            method: "DELETE",
        }
    );
}


// ============================================================
// LISTAR LIVROS
// GET /livros
// ============================================================

export async function listarLivros() {

    console.log(
        "GET /livros"
    );


    const resposta =
        await requisicao(
            "/livros",
            {
                method: "GET",
            }
        );


    /*
     * Algumas APIs retornam diretamente:
     *
     * [
     *   {...},
     *   {...}
     * ]
     *
     * Outras retornam:
     *
     * {
     *   livros: [...]
     * }
     *
     * ou:
     *
     * {
     *   data: [...]
     * }
     */

    if (Array.isArray(resposta)) {
        return resposta;
    }


    if (
        Array.isArray(
            resposta?.livros
        )
    ) {
        return resposta.livros;
    }


    if (
        Array.isArray(
            resposta?.data
        )
    ) {
        return resposta.data;
    }


    return [];
}

