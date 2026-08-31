import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "livraria_usuarios_locais";

export async function cadastrarUsuario(usuario) {
    const salvo = await AsyncStorage.getItem(CHAVE);
    const usuarios = salvo ? JSON.parse(salvo) : [];

    const existe = usuarios.some(
        (item) => item.email.toLowerCase() === usuario.email.toLowerCase()
    );

    if (existe) {
        throw new Error("Este e-mail já está cadastrado neste aparelho.");
    }

    await AsyncStorage.setItem(CHAVE, JSON.stringify([...usuarios, usuario]));
}

export async function verificarUsuario(email, senha) {
    const salvo = await AsyncStorage.getItem(CHAVE);
    const usuarios = salvo ? JSON.parse(salvo) : [];

    return usuarios.find(
        (item) =>
            item.email.toLowerCase() === email.toLowerCase() &&
            item.senha === senha
    ) || null;
}
