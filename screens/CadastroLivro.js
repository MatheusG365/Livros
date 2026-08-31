
import React, { useRef, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
    View,
    Modal,
    useColorScheme,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

import { cadastrarLivro } from "../service/livros/cadastrarLivro";
import { useApp } from "../context/AppContext";

export default function CadastroLivro({ navigation }) {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [categoria, setCategoria] = useState("");
    const [ano, setAno] = useState("");
    const [preco, setPreco] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState(null);

    const [salvando, setSalvando] = useState(false);
    const [cameraAberta, setCameraAberta] = useState(false);
    const [cameraFrontal, setCameraFrontal] = useState(false);

    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();

    const dark = useColorScheme() === "dark";
    const { logado } = useApp();

    // Bloqueia o cadastro caso o usuário não esteja logado
    if (!logado) {
        return (
            <View style={[styles.bloqueado, dark && styles.containerDark]}>
                <Ionicons
                    name="lock-closed-outline"
                    size={52}
                    color="#0066B3"
                />

                <Text
                    style={[
                        styles.bloqueadoTitulo,
                        dark && styles.textoDark,
                    ]}
                >
                    Login necessário
                </Text>

                <Text
                    style={[
                        styles.bloqueadoTexto,
                        dark && styles.avisoDark,
                    ]}
                >
                    Entre na sua conta para cadastrar um livro.
                </Text>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.botaoTexto}>Entrar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Abre a câmera
    async function abrirCamera() {
        if (!permission?.granted) {
            const resultado = await requestPermission();

            if (!resultado.granted) {
                Alert.alert(
                    "Câmera bloqueada",
                    "Permita o acesso à câmera nas configurações do aparelho."
                );

                return;
            }
        }

        setCameraAberta(true);
    }

    // Tira a foto
    async function tirarFoto() {
        if (!cameraRef.current) return;

        try {
            const foto = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                skipProcessing: true,
            });

            if (foto?.uri) {
                setImagem(foto.uri);
                setCameraAberta(false);
            }
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Erro",
                "Não foi possível tirar a foto."
            );
        }
    }

    // Cadastra o livro
    async function salvar() {
        // Validação
        if (!titulo.trim()) {
            Alert.alert("Atenção", "Informe o título do livro.");
            return;
        }

        if (!autor.trim()) {
            Alert.alert("Atenção", "Informe o autor do livro.");
            return;
        }

        if (!preco.trim()) {
            Alert.alert("Atenção", "Informe o preço do livro.");
            return;
        }

        const precoNumerico = Number(
            preco.replace(",", ".")
        );

        if (isNaN(precoNumerico) || precoNumerico < 0) {
            Alert.alert(
                "Atenção",
                "Informe um preço válido."
            );
            return;
        }

        let anoNumerico;

        if (ano.trim()) {
            anoNumerico = Number(ano);

            if (
                isNaN(anoNumerico) ||
                anoNumerico < 0
            ) {
                Alert.alert(
                    "Atenção",
                    "Informe um ano válido."
                );
                return;
            }
        }

        // Objeto enviado para a API
        const livro = {
            titulo: titulo.trim(),
            autor: autor.trim(),
            categoria: categoria.trim(),
            descricao: descricao.trim(),
            preco: precoNumerico,
        };

        // Só adiciona ano se foi informado
        if (anoNumerico !== undefined) {
            livro.ano = anoNumerico;
        }

        // Só adiciona imagem se existe
        if (imagem) {
            livro.imagem = imagem;
        }

        try {
            setSalvando(true);

            console.log(
                "Enviando livro:",
                livro
            );

            await cadastrarLivro(livro);

            Alert.alert(
                "Sucesso!",
                "Livro cadastrado com sucesso.",
                [
                    {
                        text: "OK",
                        onPress: () =>
                            navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.error(
                "Erro no cadastro:",
                error
            );

            Alert.alert(
                "Erro",
                error?.message ||
                    "Não foi possível cadastrar o livro."
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                dark && styles.containerDark,
            ]}
        >
            {/* Ícone */}
            <View style={styles.icone}>
                <Ionicons
                    name="book"
                    size={28}
                    color="#fff"
                />
            </View>

            <Text
                style={[
                    styles.titulo,
                    dark && styles.textoDark,
                ]}
            >
                Novo livro
            </Text>

            <Text
                style={[
                    styles.aviso,
                    dark && styles.avisoDark,
                ]}
            >
                Cadastre um novo livro preenchendo
                os dados abaixo.
            </Text>

            {/* Título */}
            <TextInput
                style={[
                    styles.input,
                    dark && styles.inputDark,
                ]}
                placeholder="Título *"
                placeholderTextColor={
                    dark ? "#888" : "#777"
                }
                value={titulo}
                onChangeText={setTitulo}
            />

            {/* Autor */}
            <TextInput
                style={[
                    styles.input,
                    dark && styles.inputDark,
                ]}
                placeholder="Autor *"
                placeholderTextColor={
                    dark ? "#888" : "#777"
                }
                value={autor}
                onChangeText={setAutor}
            />

            {/* Categoria */}
            <TextInput
                style={[
                    styles.input,
                    dark && styles.inputDark,
                ]}
                placeholder="Categoria"
                placeholderTextColor={
                    dark ? "#888" : "#777"
                }
                value={categoria}
                onChangeText={setCategoria}
            />

            {/* Ano */}
            <TextInput
                style={[
                    styles.input,
                    dark && styles.inputDark,
                ]}
                placeholder="Ano"
                placeholderTextColor={
                    dark ? "#888" : "#777"
                }
                keyboardType="number-pad"
                value={ano}
                onChangeText={setAno}
            />

            {/* Preço */}
            <TextInput
                style={[
                    styles.input,
                    dark && styles.inputDark,
                ]}
                placeholder="Preço *"
                placeholderTextColor={
                    dark ? "#888" : "#777"
                }
                keyboardType="decimal-pad"
                value={preco}
                onChangeText={setPreco}
            />

            {/* Descrição */}
            <TextInput
                style={[
                    styles.input,
                    styles.multiline,
                    dark && styles.inputDark,
                ]}
                placeholder="Descrição"
                placeholderTextColor={
                    dark ? "#888" : "#777"
                }
                multiline
                value={descricao}
                onChangeText={setDescricao}
            />

            {/* Câmera */}
            <Text
                style={[
                    styles.secao,
                    dark && styles.textoDark,
                ]}
            >
                Capa do livro
            </Text>

            <TouchableOpacity
                style={[
                    styles.cameraBotao,
                    dark && styles.cameraBotaoDark,
                ]}
                onPress={abrirCamera}
                activeOpacity={0.85}
            >
                <Ionicons
                    name="camera-outline"
                    size={22}
                    color="#0066B3"
                />

                <Text
                    style={[
                        styles.cameraTexto,
                        dark && styles.textoDark,
                    ]}
                >
                    {imagem
                        ? "Tirar outra foto"
                        : "Abrir câmera"}
                </Text>
            </TouchableOpacity>

            {/* Preview da foto */}
            {imagem && (
                <View style={styles.previewBox}>
                    <Image
                        source={{ uri: imagem }}
                        style={styles.preview}
                        resizeMode="cover"
                    />

                    <TouchableOpacity
                        style={styles.removerFoto}
                        onPress={() =>
                            setImagem(null)
                        }
                    >
                        <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            )}

            {/* Cadastrar */}
            <TouchableOpacity
                style={styles.botao}
                onPress={salvar}
                disabled={salvando}
                activeOpacity={0.85}
            >
                {salvando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Ionicons
                            name="cloud-upload-outline"
                            size={20}
                            color="#fff"
                        />

                        <Text
                            style={
                                styles.botaoTexto
                            }
                        >
                            Cadastrar livro
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Modal da câmera */}
            <Modal
                visible={cameraAberta}
                animationType="slide"
                onRequestClose={() =>
                    setCameraAberta(false)
                }
            >
                <View style={styles.cameraTela}>
                    <CameraView
                        ref={cameraRef}
                        style={
                            StyleSheet.absoluteFillObject
                        }
                        facing={
                            cameraFrontal
                                ? "front"
                                : "back"
                        }
                    />

                    {/* Topo */}
                    <View style={styles.cameraTopo}>
                        <TouchableOpacity
                            style={styles.cameraIcone}
                            onPress={() =>
                                setCameraAberta(false)
                            }
                        >
                            <Ionicons
                                name="close"
                                size={26}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cameraIcone}
                            onPress={() =>
                                setCameraFrontal(
                                    (valor) =>
                                        !valor
                                )
                            }
                        >
                            <Ionicons
                                name="camera-reverse-outline"
                                size={26}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Botão da câmera */}
                    <View
                        style={styles.cameraBase}
                    >
                        <Text
                            style={
                                styles.cameraAjuda
                            }
                        >
                            Posicione a capa no centro
                        </Text>

                        <TouchableOpacity
                            style={styles.disparo}
                            onPress={tirarFoto}
                        >
                            <View
                                style={
                                    styles.disparoInterno
                                }
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 22,
        backgroundColor: "#f5f5f5",
    },

    containerDark: {
        backgroundColor: "#121212",
        flexGrow: 1,
    },

    icone: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: "#0066B3",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },

    titulo: {
        fontSize: 30,
        fontWeight: "800",
        color: "#222",
        marginBottom: 8,
    },

    textoDark: {
        color: "#fff",
    },

    aviso: {
        color: "#666",
        marginBottom: 18,
        lineHeight: 20,
    },

    avisoDark: {
        color: "#aaa",
    },

    input: {
        minHeight: 52,
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

    multiline: {
        minHeight: 110,
        paddingTop: 14,
        textAlignVertical: "top",
    },

    secao: {
        fontSize: 17,
        fontWeight: "800",
        color: "#222",
        marginTop: 4,
        marginBottom: 8,
    },

    cameraBotao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        borderWidth: 1,
        borderColor: "#0066B3",
        borderRadius: 12,
        padding: 13,
        backgroundColor: "#fff",
    },

    cameraBotaoDark: {
        backgroundColor: "#202020",
        borderColor: "#318bc5",
    },

    cameraTexto: {
        color: "#333",
        fontWeight: "700",
    },

    previewBox: {
        height: 230,
        marginTop: 12,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#ddd",
    },

    preview: {
        width: "100%",
        height: "100%",
    },

    removerFoto: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#c62828",
        borderRadius: 20,
        width: 38,
        height: 38,
        alignItems: "center",
        justifyContent: "center",
    },

    botao: {
        flexDirection: "row",
        gap: 8,
        backgroundColor: "#0066B3",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
        marginBottom: 30,
    },

    botaoTexto: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
    },

    bloqueado: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "#f5f5f5",
    },

    bloqueadoTitulo: {
        fontSize: 23,
        fontWeight: "800",
        color: "#222",
        marginTop: 14,
    },

    bloqueadoTexto: {
        color: "#666",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 22,
    },

    cameraTela: {
        flex: 1,
        backgroundColor: "#000",
    },

    cameraTopo: {
        position: "absolute",
        top: 55,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    cameraIcone: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor:
            "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
    },

    cameraBase: {
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: "center",
    },

    cameraAjuda: {
        color: "#fff",
        marginBottom: 18,
        fontWeight: "600",
    },

    disparo: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor:
            "rgba(255,255,255,0.35)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },

    disparoInterno: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#fff",
    },
});
