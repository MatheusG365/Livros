import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../api";
import { verificarUsuario } from "../../storage/usuarioLocal";

export async function login(email, senha) {
    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado || !senha) {
        throw new Error("Informe e-mail e senha.");
    }

    let erroApi = null;

    try {
        console.log("=================================");
        console.log("FAZENDO LOGIN");
        console.log("URL:", `${API_URL}/auth/login`);
        console.log("EMAIL:", emailNormalizado);
        console.log("=================================");

        const resposta = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                email: emailNormalizado,
                senha: senha,
            }),
        });

        const texto = await resposta.text();

        console.log("STATUS LOGIN:", resposta.status);
        console.log("RESPOSTA LOGIN:", texto);

        let dados;

        try {
            dados = texto ? JSON.parse(texto) : null;
        } catch {
            dados = null;
        }

        if (!resposta.ok) {
            erroApi = new Error(
                dados?.detail ||
                dados?.message ||
                dados?.erro ||
                texto ||
                `Erro HTTP ${resposta.status}`
            );
        } else {
            const token =
                dados?.access_token ||
                dados?.token ||
                dados?.accessToken ||
                null;

            const usuario =
                dados?.usuario ||
                dados?.user ||
                dados?.usuarioLogado ||
                {
                    email: emailNormalizado,
                };

            if (token) {
                await AsyncStorage.setItem(
                    "livraria_token",
                    token
                );
            }

            await AsyncStorage.setItem(
                "livraria_sessao",
                JSON.stringify({
                    usuario,
                    token,
                    origem: "api",
                    logado: true,
                })
            );

            return {
                token,
                usuario,
                origem: "api",
                resposta: dados,
            };
        }

    } catch (error) {
        console.log("ERRO DE CONEXÃO COM A API:", error);
        erroApi = error;
    }

    /*
     * Caso a conta tenha sido cadastrada localmente,
     * ainda permite o login local.
     */
    try {
        const usuarioLocal = await verificarUsuario(
            emailNormalizado,
            senha
        );

        if (usuarioLocal) {
            await AsyncStorage.setItem(
                "livraria_sessao",
                JSON.stringify({
                    usuario: usuarioLocal,
                    token: null,
                    origem: "local",
                    logado: true,
                })
            );

            return {
                token: null,
                usuario: usuarioLocal,
                origem: "local",
                resposta: null,
            };
        }
    } catch (error) {
        console.log(
            "Erro ao verificar usuário local:",
            error
        );
    }

    throw erroApi || new Error(
        "E-mail ou senha inválidos."
    );
}

export async function sair() {
    await AsyncStorage.multiRemove([
        "livraria_token",
        "livraria_sessao",
    ]);
}

export async function obterSessao() {
    try {
        const sessao = await AsyncStorage.getItem(
            "livraria_sessao"
        );

        if (!sessao) {
            return null;
        }

        return JSON.parse(sessao);

    } catch (error) {
        console.log(
            "Erro ao recuperar sessão:",
            error
        );

        return null;
    }
}

