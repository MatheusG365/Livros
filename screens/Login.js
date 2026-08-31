
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { login } from "../service/auth/login";
import { useApp } from "../context/AppContext";

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const dark = useColorScheme() === "dark";
    const { entrarSessao } = useApp();

    async function entrar() {
        if (!email.trim() || !senha) {
            Alert.alert("Atenção", "Informe o e-mail e a senha.");
            return;
        }

        if (carregando) return;

        try {
            setCarregando(true);

            const resultado = await login(email.trim(), senha);

            if (!resultado || !resultado.usuario) {
                throw new Error("Não foi possível identificar o usuário.");
            }

            await entrarSessao(
                resultado.usuario,
                resultado.token || null
            );

            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });

        } catch (error) {
            console.log("ERRO LOGIN:", error);

            Alert.alert(
                "Erro no login",
                error?.message || "E-mail ou senha inválidos."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <View style={[styles.container, dark && styles.containerDark]}>

            <View style={styles.iconeTopo}>
                <Ionicons
                    name="book"
                    size={36}
                    color="#fff"
                />
            </View>

            <Text style={[styles.titulo, dark && styles.textoDark]}>
                Entrar
            </Text>

            <Text
                style={[
                    styles.subtitulo,
                    dark && styles.subtituloDark,
                ]}
            >
                Entre para liberar favoritos e cadastro de livros.
            </Text>

            <TextInput
                style={[
                    styles.input,
                    dark && styles.inputDark,
                ]}
                placeholder="E-mail"
                placeholderTextColor={dark ? "#888" : "#777"}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!carregando}
            />

            <View
                style={[
                    styles.senhaBox,
                    dark && styles.inputDark,
                ]}
            >
                <TextInput
                    style={[
                        styles.senhaInput,
                        dark && styles.textoDark,
                    ]}
                    placeholder="Senha"
                    placeholderTextColor={dark ? "#888" : "#777"}
                    secureTextEntry={!mostrarSenha}
                    value={senha}
                    onChangeText={setSenha}
                    editable={!carregando}
                />

                <TouchableOpacity
                    onPress={() =>
                        setMostrarSenha((valor) => !valor)
                    }
                    hitSlop={10}
                    disabled={carregando}
                >
                    <Ionicons
                        name={
                            mostrarSenha
                                ? "eye-off-outline"
                                : "eye-outline"
                        }
                        size={22}
                        color={dark ? "#bbb" : "#666"}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[
                    styles.botao,
                    carregando && styles.botaoDesativado,
                ]}
                onPress={entrar}
                disabled={carregando}
                activeOpacity={0.85}
            >
                {carregando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Ionicons
                            name="log-in-outline"
                            size={20}
                            color="#fff"
                        />

                        <Text style={styles.botaoTexto}>
                            Entrar
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.link}
                onPress={() =>
                    navigation.navigate("Cadastro")
                }
                disabled={carregando}
            >
                <Text style={styles.linkTexto}>
                    Criar conta neste aparelho
                </Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 22,
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },

    containerDark: {
        backgroundColor: "#121212",
    },

    iconeTopo: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: "#0066B3",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    titulo: {
        fontSize: 32,
        fontWeight: "800",
        color: "#222",
        marginBottom: 8,
    },

    subtitulo: {
        color: "#666",
        lineHeight: 20,
        marginBottom: 20,
    },

    subtituloDark: {
        color: "#aaa",
    },

    textoDark: {
        color: "#fff",
    },

    input: {
        height: 52,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 12,
        fontSize: 16,
        color: "#222",
    },

    inputDark: {
        backgroundColor: "#202020",
        borderColor: "#444",
        color: "#fff",
    },

    senhaBox: {
        height: 52,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    senhaInput: {
        flex: 1,
        fontSize: 16,
        color: "#222",
    },

    botao: {
        flexDirection: "row",
        gap: 8,
        backgroundColor: "#0066B3",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    botaoDesativado: {
        opacity: 0.7,
    },

    botaoTexto: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
    },

    link: {
        padding: 15,
        alignItems: "center",
    },

    linkTexto: {
        color: "#0066B3",
        fontWeight: "700",
    },
});
