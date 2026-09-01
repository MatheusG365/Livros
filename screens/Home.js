
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Alert,
    TextInput,
    useColorScheme,
    Modal,
    Pressable,
    Dimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Card from "../components/Card";
import Titulo from "../components/Titulo";
import CategoriaBotao from "../components/CategoriaBotao";
import FiltroOrdenacao from "../components/FiltroOrdenacao";

import { buscarLivros } from "../service/livros/buscarLivros";
import { buscarCategorias } from "../service/categorias/buscarCategorias";

import {
    getToken,
    getUsuario,
    limparDados,
} from "../service/usuario/usuarioStorage";


const { width: SCREEN_WIDTH } = Dimensions.get("window");


function obterPreco(livro) {
    const valor =
        livro?.preco ??
        livro?.price ??
        livro?.valor;

    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {
        return null;
    }

    const numero = Number(valor);

    return Number.isFinite(numero)
        ? numero
        : null;
}


export default function Home({ navigation }) {

    const dark = useColorScheme() === "dark";


    // =========================================================
    // LIVROS
    // =========================================================

    const [livros, setLivros] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [busca, setBusca] = useState("");

    const [
        categoriaSelecionada,
        setCategoriaSelecionada
    ] = useState(null);

    const [ordenacao, setOrdenacao] =
        useState("nenhuma");

    const [carregando, setCarregando] =
        useState(true);

    const [atualizando, setAtualizando] =
        useState(false);

    const [erro, setErro] =
        useState("");


    // =========================================================
    // USUÁRIO
    // =========================================================

    const [logado, setLogado] =
        useState(false);

    const [usuario, setUsuario] =
        useState(null);


    // =========================================================
    // FAVORITOS
    // =========================================================

    const [favoritos, setFavoritos] =
        useState([]);


    // =========================================================
    // MENU
    // =========================================================

    const [menuAberto, setMenuAberto] =
        useState(false);


    // =========================================================
    // CONTROLE DE CARREGAMENTO
    //
    // Isso impede duas requisições simultâneas.
    // =========================================================

    const carregandoDadosRef =
        useRef(false);


    // =========================================================
    // IDENTIFICADOR DO USUÁRIO
    // =========================================================

    const identificadorUsuario =
        useMemo(() => {

            if (!usuario) {
                return null;
            }

            return String(
                usuario.id ||
                usuario.email ||
                "usuario"
            ).toLowerCase();

        }, [usuario]);


    // =========================================================
    // FAVORITOS
    // =========================================================

    const carregarFavoritos =
        useCallback(async () => {

            if (!identificadorUsuario) {
                setFavoritos([]);
                return;
            }

            try {

                const chave =
                    `livraria_favoritos_${identificadorUsuario}`;

                const dados =
                    await AsyncStorage.getItem(chave);

                if (!dados) {
                    setFavoritos([]);
                    return;
                }

                const lista =
                    JSON.parse(dados);

                setFavoritos(
                    Array.isArray(lista)
                        ? lista
                        : []
                );

            } catch (error) {

                console.log(
                    "ERRO FAVORITOS:",
                    error
                );

                setFavoritos([]);
            }

        }, [
            identificadorUsuario
        ]);


    // =========================================================
    // VERIFICAR LOGIN
    // =========================================================

    const verificarLogin =
        useCallback(async () => {

            try {

                const token =
                    await getToken();

                const dadosUsuario =
                    await getUsuario();


                if (
                    token &&
                    dadosUsuario
                ) {

                    setLogado(true);
                    setUsuario(dadosUsuario);

                    return true;
                }


                setLogado(false);
                setUsuario(null);
                setFavoritos([]);

                return false;

            } catch (error) {

                console.log(
                    "ERRO LOGIN:",
                    error
                );

                setLogado(false);
                setUsuario(null);
                setFavoritos([]);

                return false;
            }

        }, []);


    // =========================================================
    // CARREGAR LIVROS
    //
    // IMPORTANTE:
    // Não depende de livros.
    // Portanto setLivros() não dispara outra busca.
    // =========================================================

    const carregarLivros =
        useCallback(async ({
            refresh = false
        } = {}) => {

            if (carregandoDadosRef.current) {
                console.log(
                    "Busca já em andamento. Ignorando."
                );

                return;
            }


            carregandoDadosRef.current = true;


            if (refresh) {
                setAtualizando(true);
            } else {
                setCarregando(true);
            }


            setErro("");


            try {

                const token =
                    await getToken();


                if (!token) {

                    setLivros([]);

                    setErro(
                        "Faça login para acessar os livros."
                    );

                    return;
                }


                console.log(
                    "BUSCANDO LIVROS NA API..."
                );


                await buscarLivros({
                    setLivros,
                    setCarregando,
                    setErro,
                });


                console.log(
                    "LIVROS CARREGADOS."
                );


            } catch (error) {

                console.log(
                    "ERRO AO BUSCAR LIVROS:",
                    error
                );

                setErro(
                    error?.message ||
                    "Não foi possível carregar os livros."
                );

            } finally {

                setCarregando(false);
                setAtualizando(false);

                carregandoDadosRef.current =
                    false;
            }

        }, []);


    // =========================================================
    // CARREGAR CATEGORIAS
    //
    // IMPORTANTE:
    // NÃO depende de livros.
    // =========================================================

    const carregarCategorias =
        useCallback(async () => {

            try {

                const token =
                    await getToken();


                if (!token) {
                    setCategorias([]);
                    return;
                }


                console.log(
                    "BUSCANDO CATEGORIAS..."
                );


                const resultado =
                    await buscarCategorias();


                const lista =
                    Array.isArray(resultado)
                        ? resultado
                        : resultado?.categorias || [];


                const nomes =
                    lista
                        .map(item => {

                            if (
                                typeof item === "string"
                            ) {
                                return item;
                            }

                            return (
                                item?.nome ??
                                item?.name ??
                                item?.categoria ??
                                ""
                            );
                        })
                        .filter(Boolean);


                setCategorias(
                    [...new Set(nomes)]
                );


                console.log(
                    "CATEGORIAS CARREGADAS."
                );


            } catch (error) {

                console.log(
                    "ERRO CATEGORIAS:",
                    error
                );

                setCategorias([]);
            }

        }, []);


    // =========================================================
    // CARREGAR FAVORITOS
    // =========================================================

    useEffect(() => {

        carregarFavoritos();

    }, [
        carregarFavoritos
    ]);


    // =========================================================
    // PRIMEIRA ABERTURA
    //
    // EXECUTA SOMENTE UMA VEZ.
    // =========================================================

    useEffect(() => {

        let ativo = true;


        async function iniciar() {

            if (!ativo) {
                return;
            }


            const estaLogado =
                await verificarLogin();


            if (!ativo) {
                return;
            }


            if (!estaLogado) {

                setCarregando(false);

                return;
            }


            /*
             * UMA única chamada para livros.
             */

            await carregarLivros();


            if (!ativo) {
                return;
            }


            /*
             * UMA chamada para categorias.
             */

            await carregarCategorias();

        }


        iniciar();


        return () => {
            ativo = false;
        };

    }, [
        verificarLogin,
        carregarLivros,
        carregarCategorias
    ]);


    // =========================================================
    // QUANDO VOLTAR PARA HOME
    //
    // NÃO fica chamando infinitamente.
    //
    // Só atualiza quando a tela realmente ganha foco.
    // =========================================================

    useEffect(() => {

        const unsubscribe =
            navigation.addListener(
                "focus",
                async () => {

                    /*
                     * Apenas verifica login.
                     *
                     * NÃO busca livros toda vez.
                     */

                    const estaLogado =
                        await verificarLogin();


                    if (!estaLogado) {

                        setLivros([]);
                        setCategorias([]);
                        setFavoritos([]);

                        return;
                    }


                    /*
                     * Favoritos podem ter mudado
                     * em outra tela.
                     */

                    await carregarFavoritos();

                }
            );


        return unsubscribe;

    }, [
        navigation,
        verificarLogin,
        carregarFavoritos
    ]);


    // =========================================================
    // FILTROS
    // =========================================================

    const livrosFiltrados =
        useMemo(() => {

            const texto =
                busca
                    .trim()
                    .toLowerCase();


            let resultado =
                livros.filter(livro => {

                    const titulo =
                        String(
                            livro?.titulo ??
                            livro?.title ??
                            ""
                        ).toLowerCase();


                    const autor =
                        String(
                            livro?.autor ??
                            livro?.author ??
                            ""
                        ).toLowerCase();


                    const categoria =
                        String(
                            livro?.categoria ??
                            livro?.category ??
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const encontrouTexto =
                        !texto ||
                        titulo.includes(texto) ||
                        autor.includes(texto) ||
                        categoria.includes(texto);


                    const encontrouCategoria =
                        categoriaSelecionada === null ||
                        categoria ===
                        String(
                            categoriaSelecionada
                        )
                            .trim()
                            .toLowerCase();


                    return (
                        encontrouTexto &&
                        encontrouCategoria
                    );

                });


            if (
                ordenacao === "az"
            ) {

                resultado.sort(
                    (a, b) => {

                        const tituloA =
                            String(
                                a?.titulo ??
                                a?.title ??
                                ""
                            );

                        const tituloB =
                            String(
                                b?.titulo ??
                                b?.title ??
                                ""
                            );


                        return tituloA.localeCompare(
                            tituloB,
                            "pt-BR",
                            {
                                sensitivity: "base"
                            }
                        );
                    }
                );
            }


            if (
                ordenacao === "precoMenor"
            ) {

                resultado.sort(
                    (a, b) =>
                        (
                            obterPreco(a) ??
                            Infinity
                        ) -
                        (
                            obterPreco(b) ??
                            Infinity
                        )
                );
            }


            if (
                ordenacao === "precoMaior"
            ) {

                resultado.sort(
                    (a, b) =>
                        (
                            obterPreco(b) ??
                            -Infinity
                        ) -
                        (
                            obterPreco(a) ??
                            -Infinity
                        )
                );
            }


            return resultado;

        }, [
            livros,
            busca,
            categoriaSelecionada,
            ordenacao
        ]);


    // =========================================================
    // ATUALIZAR MANUALMENTE
    //
    // Essa é uma das situações que realmente faz
    // uma nova busca na API.
    // =========================================================

    const atualizar =
        useCallback(async () => {

            setMenuAberto(false);

            await carregarLivros({
                refresh: true
            });

            await carregarCategorias();

        }, [
            carregarLivros,
            carregarCategorias
        ]);


    // =========================================================
    // FAVORITAR
    // =========================================================

    async function favoritar(livro) {

        if (!logado) {

            Alert.alert(
                "Faça login",
                "Entre na sua conta para favoritar livros.",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Entrar",
                        onPress: () =>
                            navigation.navigate(
                                "Login"
                            )
                    }
                ]
            );

            return;
        }


        if (!identificadorUsuario) {
            return;
        }


        try {

            const chave =
                `livraria_favoritos_${identificadorUsuario}`;


            const existe =
                favoritos.some(
                    item =>
                        String(item.id) ===
                        String(livro.id)
                );


            const novosFavoritos =
                existe
                    ? favoritos.filter(
                        item =>
                            String(item.id) !==
                            String(livro.id)
                    )
                    : [
                        ...favoritos,
                        livro
                    ];


            setFavoritos(
                novosFavoritos
            );


            await AsyncStorage.setItem(
                chave,
                JSON.stringify(
                    novosFavoritos
                )
            );


        } catch (error) {

            console.log(
                "ERRO FAVORITO:",
                error
            );
        }
    }


    // =========================================================
    // DETALHES
    // =========================================================

    function abrirDetalhes(livro) {

        if (!logado) {

            Alert.alert(
                "Faça login",
                "Entre na sua conta para visualizar os detalhes."
            );

            return;
        }


        navigation.navigate(
            "DetalhesLivro",
            {
                livro
            }
        );
    }


    // =========================================================
    // MENU
    // =========================================================

    function abrirFavoritos() {

        setMenuAberto(false);

        if (!logado) {

            Alert.alert(
                "Faça login",
                "Entre na sua conta para visualizar favoritos."
            );

            return;
        }

        navigation.navigate(
            "Favoritos"
        );
    }


    function abrirCadastroLivro() {

        setMenuAberto(false);

        if (!logado) {

            Alert.alert(
                "Faça login",
                "Entre na sua conta para cadastrar livros."
            );

            return;
        }

        navigation.navigate(
            "CadastroLivro"
        );
    }


    function editarUsuario() {

        setMenuAberto(false);

        if (!logado) {

            Alert.alert(
                "Faça login",
                "Entre na sua conta para editar seu usuário."
            );

            return;
        }

        navigation.navigate(
            "Cadastro",
            {
                usuario
            }
        );
    }


    function abrirLogin() {

        setMenuAberto(false);

        navigation.navigate(
            "Login"
        );
    }


    // =========================================================
    // LOGOUT
    // =========================================================

    async function deslogar() {

        setMenuAberto(false);

        try {

            await limparDados();

            setLogado(false);
            setUsuario(null);

            setLivros([]);
            setCategorias([]);
            setFavoritos([]);

            setCategoriaSelecionada(null);

        } catch (error) {

            console.log(
                "ERRO LOGOUT:",
                error
            );
        }
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <SafeAreaView
            style={[
                styles.container,
                dark &&
                styles.containerDark
            ]}
        >

            {/* =================================================
                CABEÇALHO
            ================================================= */}

            <View
                style={styles.header}
            >

                <View
                    style={styles.tituloContainer}
                >
                    <Titulo />
                </View>


                <TouchableOpacity
                    style={[
                        styles.botaoMenu,
                        dark &&
                        styles.botaoMenuDark
                    ]}
                    onPress={() =>
                        setMenuAberto(true)
                    }
                >

                    <Ionicons
                        name="menu"
                        size={28}
                        color={
                            dark
                                ? "#fff"
                                : "#222"
                        }
                    />

                </TouchableOpacity>

            </View>


            {/* =================================================
                MENU LATERAL
            ================================================= */}

            <Modal
                visible={menuAberto}
                transparent={true}
                animationType="slide"
                onRequestClose={() =>
                    setMenuAberto(false)
                }
            >

                <View
                    style={styles.modalContainer}
                >

                    {/* FUNDO */}

                    <Pressable
                        style={styles.fundoMenu}
                        onPress={() =>
                            setMenuAberto(false)
                        }
                    />


                    {/* MENU */}

                    <View
                        style={[
                            styles.menu,
                            dark &&
                            styles.menuDark
                        ]}
                    >

                        <View
                            style={styles.menuHeader}
                        >

                            <View
                                style={styles.usuarioIcon}
                            >

                                <Ionicons
                                    name={
                                        logado
                                            ? "person"
                                            : "person-outline"
                                    }
                                    size={25}
                                    color="#fff"
                                />

                            </View>


                            <View
                                style={styles.usuarioInfo}
                            >

                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.menuTitulo,
                                        dark &&
                                        styles.textoDark
                                    ]}
                                >
                                    {
                                        logado
                                            ? usuario?.nome ||
                                              usuario?.email ||
                                              "Usuário"
                                            : "Visitante"
                                    }
                                </Text>


                                <Text
                                    style={[
                                        styles.menuSubtitulo,
                                        dark &&
                                        styles.subtituloDark
                                    ]}
                                >
                                    {
                                        logado
                                            ? "Sessão ativa"
                                            : "Não conectado"
                                    }
                                </Text>

                            </View>


                            <TouchableOpacity
                                onPress={() =>
                                    setMenuAberto(false)
                                }
                            >

                                <Ionicons
                                    name="close"
                                    size={27}
                                    color={
                                        dark
                                            ? "#fff"
                                            : "#333"
                                    }
                                />

                            </TouchableOpacity>

                        </View>


                        <View
                            style={styles.linha}
                        />


                        {/* FAVORITOS */}

                        <TouchableOpacity
                            style={styles.itemMenu}
                            onPress={
                                abrirFavoritos
                            }
                        >

                            <Ionicons
                                name="heart-outline"
                                size={23}
                                color="#0066B3"
                            />

                            <Text
                                style={[
                                    styles.itemTexto,
                                    dark &&
                                    styles.textoDark
                                ]}
                            >
                                Favoritos
                            </Text>

                        </TouchableOpacity>


                        {/* CADASTRAR LIVRO */}

                        <TouchableOpacity
                            style={styles.itemMenu}
                            onPress={
                                abrirCadastroLivro
                            }
                        >

                            <Ionicons
                                name="add-circle-outline"
                                size={23}
                                color="#0066B3"
                            />

                            <Text
                                style={[
                                    styles.itemTexto,
                                    dark &&
                                    styles.textoDark
                                ]}
                            >
                                Cadastrar livro
                            </Text>

                        </TouchableOpacity>


                        {/* EDITAR USUÁRIO */}

                        <TouchableOpacity
                            style={styles.itemMenu}
                            onPress={
                                editarUsuario
                            }
                        >

                            <Ionicons
                                name="person-outline"
                                size={23}
                                color="#0066B3"
                            />

                            <Text
                                style={[
                                    styles.itemTexto,
                                    dark &&
                                    styles.textoDark
                                ]}
                            >
                                Editar usuário
                            </Text>

                        </TouchableOpacity>


                        {/* ATUALIZAR */}

                        <TouchableOpacity
                            style={styles.itemMenu}
                            onPress={
                                atualizar
                            }
                        >

                            <Ionicons
                                name="refresh-outline"
                                size={23}
                                color="#0066B3"
                            />

                            <Text
                                style={[
                                    styles.itemTexto,
                                    dark &&
                                    styles.textoDark
                                ]}
                            >
                                Atualizar livros
                            </Text>

                        </TouchableOpacity>


                        <View
                            style={styles.linha}
                        />


                        {/* LOGIN / LOGOUT */}

                        {
                            logado ? (

                                <TouchableOpacity
                                    style={styles.itemMenu}
                                    onPress={
                                        deslogar
                                    }
                                >

                                    <Ionicons
                                        name="log-out-outline"
                                        size={23}
                                        color="#c62828"
                                    />

                                    <Text
                                        style={[
                                            styles.itemTexto,
                                            styles.logout
                                        ]}
                                    >
                                        Sair
                                    </Text>

                                </TouchableOpacity>

                            ) : (

                                <TouchableOpacity
                                    style={styles.itemMenu}
                                    onPress={
                                        abrirLogin
                                    }
                                >

                                    <Ionicons
                                        name="log-in-outline"
                                        size={23}
                                        color="#0066B3"
                                    />

                                    <Text
                                        style={[
                                            styles.itemTexto,
                                            dark &&
                                            styles.textoDark
                                        ]}
                                    >
                                        Entrar
                                    </Text>

                                </TouchableOpacity>
                            )
                        }

                    </View>

                </View>

            </Modal>


            {/* =================================================
                CONTEÚDO
            ================================================= */}

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.content
                }
                refreshControl={
                    <RefreshControl
                        refreshing={
                            atualizando
                        }
                        onRefresh={
                            atualizar
                        }
                    />
                }
            >


                {/* BUSCA */}

                <View
                    style={[
                        styles.search,
                        dark &&
                        styles.searchDark
                    ]}
                >

                    <Ionicons
                        name="search"
                        size={20}
                        color="#777"
                    />


                    <TextInput
                        value={busca}
                        onChangeText={
                            setBusca
                        }
                        placeholder={
                            "Buscar livro, autor ou categoria"
                        }
                        placeholderTextColor="#777"
                        style={[
                            styles.searchInput,
                            dark &&
                            styles.textoDark
                        ]}
                    />


                    {
                        busca ? (

                            <TouchableOpacity
                                onPress={() =>
                                    setBusca("")
                                }
                            >

                                <Ionicons
                                    name="close-circle"
                                    size={19}
                                    color="#777"
                                />

                            </TouchableOpacity>

                        ) : null
                    }

                </View>


                {/* CATEGORIAS */}

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                        false
                    }
                    style={
                        styles.categorias
                    }
                >

                    <CategoriaBotao
                        categoria="Todos"
                        selecionada={
                            categoriaSelecionada ===
                            null
                        }
                        onPress={() =>
                            setCategoriaSelecionada(
                                null
                            )
                        }
                    />


                    {
                        categorias.map(
                            (
                                categoria,
                                index
                            ) => {

                                const nome =
                                    String(
                                        categoria
                                    );


                                return (

                                    <CategoriaBotao
                                        key={
                                            `${nome}-${index}`
                                        }
                                        categoria={
                                            nome
                                        }
                                        selecionada={
                                            String(
                                                categoriaSelecionada
                                            )
                                                .toLowerCase() ===
                                            nome
                                                .toLowerCase()
                                        }
                                        onPress={() =>
                                            setCategoriaSelecionada(
                                                nome
                                            )
                                        }
                                    />

                                );
                            }
                        )
                    }

                </ScrollView>


                {/* FILTRO */}

                <FiltroOrdenacao
                    ordenacao={
                        ordenacao
                    }
                    setOrdenacao={
                        setOrdenacao
                    }
                    modoEscuro={
                        dark
                    }
                />


                {/* AÇÕES */}

                <View
                    style={styles.actions}
                >

                    <TouchableOpacity
                        style={styles.action}
                        onPress={
                            abrirCadastroLivro
                        }
                    >

                        <Ionicons
                            name="add-circle-outline"
                            size={18}
                            color="#fff"
                        />

                        <Text
                            style={
                                styles.actionText
                            }
                        >
                            Cadastrar livro
                        </Text>

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.action}
                        onPress={
                            editarUsuario
                        }
                    >

                        <Ionicons
                            name="person-outline"
                            size={18}
                            color="#fff"
                        />

                        <Text
                            style={
                                styles.actionText
                            }
                        >
                            Editar usuário
                        </Text>

                    </TouchableOpacity>

                </View>


                {/* =================================================
                    LOADING
                ================================================= */}

                {
                    carregando ? (

                        <View
                            style={
                                styles.center
                            }
                        >

                            <ActivityIndicator
                                size="large"
                                color="#0066B3"
                            />

                            <Text
                                style={[
                                    styles.loadingText,
                                    dark &&
                                    styles.textoDark
                                ]}
                            >
                                Carregando livros...
                            </Text>

                        </View>

                    ) : erro ? (

                        <View
                            style={
                                styles.center
                            }
                        >

                            <Ionicons
                                name="alert-circle-outline"
                                size={50}
                                color="#0066B3"
                            />

                            <Text
                                style={[
                                    styles.error,
                                    dark &&
                                    styles.textoDark
                                ]}
                            >
                                {erro}
                            </Text>


                            <TouchableOpacity
                                style={
                                    styles.action
                                }
                                onPress={() =>
                                    carregarLivros()
                                }
                            >

                                <Text
                                    style={
                                        styles.actionText
                                    }
                                >
                                    Tentar novamente
                                </Text>

                            </TouchableOpacity>

                        </View>

                    ) : livrosFiltrados.length === 0 ? (

                        <View
                            style={
                                styles.center
                            }
                        >

                            <Ionicons
                                name="book-outline"
                                size={55}
                                color="#0066B3"
                            />

                            <Text
                                style={[
                                    styles.empty,
                                    dark &&
                                    styles.textoDark
                                ]}
                            >
                                Nenhum livro encontrado.
                            </Text>

                        </View>

                    ) : (

                        <View
                            style={styles.grid}
                        >

                            {
                                livrosFiltrados.map(
                                    livro => (

                                        <View
                                            key={
                                                String(
                                                    livro.id
                                                )
                                            }
                                            style={
                                                styles.cardWrap
                                            }
                                        >

                                            <Card
                                                livro={
                                                    livro
                                                }
                                                favorito={
                                                    favoritos.some(
                                                        item =>
                                                            String(
                                                                item.id
                                                            ) ===
                                                            String(
                                                                livro.id
                                                            )
                                                    )
                                                }
                                                onFavorito={
                                                    favoritar
                                                }
                                                onPress={
                                                    abrirDetalhes
                                                }
                                                modoEscuro={
                                                    dark
                                                }
                                                podeFavoritar={
                                                    true
                                                }
                                            />

                                        </View>

                                    )
                                )
                            }

                        </View>

                    )
                }

            </ScrollView>

        </SafeAreaView>
    );
}


/* =============================================================
   ESTILOS
============================================================= */

const styles =
    StyleSheet.create({

        container: {
            flex: 1,
            backgroundColor: "#f5f5f5",
        },

        containerDark: {
            backgroundColor: "#121212",
        },

        content: {
            padding: 15,
            paddingBottom: 40,
        },

        header: {
            width: "100%",

            minHeight: 60,

            paddingHorizontal: 15,

            flexDirection: "row",

            alignItems: "center",

            justifyContent: "space-between",
        },

        tituloContainer: {
            flex: 1,

            minWidth: 0,

            paddingRight: 10,
        },

        botaoMenu: {
            width: 46,
            height: 46,

            flexShrink: 0,

            borderRadius: 23,

            backgroundColor: "#fff",

            alignItems: "center",
            justifyContent: "center",

            elevation: 3,

            shadowOpacity: 0.15,
            shadowRadius: 4,
            shadowOffset: {
                width: 0,
                height: 2,
            },
        },

        botaoMenuDark: {
            backgroundColor: "#202020",
        },

        search: {
            height: 50,

            borderRadius: 14,

            backgroundColor: "#fff",

            borderWidth: 1,

            borderColor: "#ddd",

            flexDirection: "row",

            alignItems: "center",

            paddingHorizontal: 13,

            marginBottom: 10,
        },

        searchDark: {
            backgroundColor: "#202020",

            borderColor: "#444",
        },

        searchInput: {
            flex: 1,

            minWidth: 0,

            fontSize: 15,

            paddingHorizontal: 8,

            color: "#222",
        },

        categorias: {
            marginBottom: 8,

            maxHeight: 50,
        },

        actions: {
            flexDirection: "row",

            gap: 8,

            marginVertical: 10,
        },

        action: {
            backgroundColor: "#0066B3",

            borderRadius: 11,

            paddingVertical: 10,

            paddingHorizontal: 12,

            flexDirection: "row",

            alignItems: "center",

            gap: 6,
        },

        actionText: {
            color: "#fff",

            fontWeight: "800",

            fontSize: 12,
        },

      grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingTop: 5,
      },

      cardWrap: {
        width: "48%",
        marginBottom: 20,
        alignSelf: "flex-start",
      },

        center: {
            alignItems: "center",

            justifyContent: "center",

            paddingTop: 50,

            paddingHorizontal: 20,
        },

        loadingText: {
            marginTop: 12,

            color: "#333",

            fontSize: 15,
        },

        empty: {
            marginTop: 10,

            color: "#444",

            fontSize: 17,

            fontWeight: "700",

            textAlign: "center",
        },

        error: {
            marginVertical: 15,

            color: "#c62828",

            textAlign: "center",
        },

        textoDark: {
            color: "#fff",
        },


        /* =====================================================
           MENU
        ===================================================== */

        modalContainer: {
            flex: 1,

            flexDirection: "row",

            justifyContent: "flex-end",

            width: SCREEN_WIDTH,
        },

        fundoMenu: {
            flex: 1,

            backgroundColor:
                "rgba(0,0,0,0.45)",
        },

        menu: {
            width:
                Math.min(
                    SCREEN_WIDTH * 0.82,
                    340
                ),

            height: "100%",

            backgroundColor: "#fff",

            paddingTop: 55,

            paddingHorizontal: 20,

            elevation: 10,
        },

        menuDark: {
            backgroundColor: "#1c1c1c",
        },

        menuHeader: {
            flexDirection: "row",

            alignItems: "center",

            width: "100%",
        },

        usuarioIcon: {
            width: 44,
            height: 44,

            borderRadius: 22,

            backgroundColor: "#0066B3",

            alignItems: "center",
            justifyContent: "center",
        },

        usuarioInfo: {
            flex: 1,

            minWidth: 0,

            marginLeft: 12,

            marginRight: 10,
        },

        menuTitulo: {
            fontSize: 16,

            fontWeight: "800",

            color: "#222",
        },

        menuSubtitulo: {
            marginTop: 3,

            fontSize: 12,

            color: "#777",
        },

        subtituloDark: {
            color: "#aaa",
        },

        linha: {
            height: 1,

            backgroundColor: "#ddd",

            marginVertical: 12,
        },

        itemMenu: {
            width: "100%",

            minHeight: 52,

            flexDirection: "row",

            alignItems: "center",

            paddingVertical: 12,
        },

        itemTexto: {
            marginLeft: 14,

            fontSize: 15,

            fontWeight: "600",

            color: "#333",
        },

        logout: {
            color: "#c62828",
        },
    });

