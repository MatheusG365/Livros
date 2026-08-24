const API_URL =
    "https://apps-api-livros.ucxocw.easypanel.host";


export async function buscarCategorias() {

    try {

        const response = await fetch(
            `${API_URL}/categorias`
        );

        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            );

        }

        const dados = await response.json();

        console.log(
            "CATEGORIAS API:",
            dados
        );

        return dados.categorias;

    } catch (error) {

        console.log(
            "ERRO AO BUSCAR CATEGORIAS:",
            error
        );

        throw error;

    }

}