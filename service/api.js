import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL =
    "https://apps-api-livros.ucxocw.easypanel.host";

export async function requisicao(endpoint, opcoes = {}) {
    const url = `${API_URL}${endpoint}`;

    try {
        // Recupera o token salvo no login
        const token = await AsyncStorage.getItem(
            "livraria_token"
        );

        console.log("=================================");
        console.log("REQUISIÇÃO");
        console.log("URL:", url);
        console.log("TOKEN EXISTE:", !!token);
        console.log("=================================");

        const headers = {
            Accept: "application/json",
            ...(opcoes.headers || {}),
        };

        /*
         * Só adiciona Content-Type automaticamente
         * quando não estiver enviando FormData.
         */
        if (!(opcoes.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        /*
         * AQUI ESTÁ A CORREÇÃO PRINCIPAL:
         *
         * Todas as requisições protegidas passam
         * o token JWT para a API.
         */
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const resposta = await fetch(url, {
            ...opcoes,
            headers,
        });

        const texto = await resposta.text();

        let dados = null;

        try {
            dados = texto ? JSON.parse(texto) : null;
        } catch {
            dados = texto;
        }

        console.log("STATUS:", resposta.status);
        console.log("RESPOSTA:", dados);

        if (!resposta.ok) {
            if (resposta.status === 401) {
                throw new Error(
                    "Sessão inválida ou expirada. Faça login novamente."
                );
            }

            throw new Error(
                dados?.detail ||
                dados?.message ||
                dados?.erro ||
                `Erro HTTP ${resposta.status}`
            );
        }

        return dados;

    } catch (error) {
        console.log(
            "ERRO NA REQUISIÇÃO:",
            error
        );

        throw error;
    }
}
