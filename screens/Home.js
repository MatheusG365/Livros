import {
    View,
    ScrollView,
    StyleSheet,
} from "react-native";

import {
    SafeAreaView
} from "react-native-safe-area-context";

import {
    useEffect,
    useState
} from "react";

import Card from "../components/Card";
import CategoriaBotao from "../components/CategoriaBotao";

import {
    buscarLivros
} from "../service/livros/buscarLivros";

import {
    buscarCategorias
} from "../service/categorias/buscarCategorias";

import Titulo from "../components/Titulo";
import InputBuscar from "../components/InputBusca";
import ModalLivro from "../components/ModalLivro";


export default function Home() {

    // ==========================================
    // LIVROS
    // ==========================================

    const [livros, setLivros] = useState([]);


    // ==========================================
    // CATEGORIAS
    // ==========================================

    const [categorias, setCategorias] = useState([]);


    // ==========================================
    // TEXTO DA BUSCA
    // ==========================================

    const [busca, setBusca] = useState("");


    // ==========================================
    // CATEGORIA SELECIONADA
    // ==========================================

    const [
        categoriaSelecionada,
        setCategoriaSelecionada
    ] = useState(null);


    // ==========================================
    // LIVRO SELECIONADO
    // ==========================================

    const [
        livroSelecionado,
        setLivroSelecionado
    ] = useState(null);


    // ==========================================
    // CARREGAR DADOS
    // ==========================================

    useEffect(() => {

        carregarLivros();

        carregarCategorias();

    }, []);


    // ==========================================
    // BUSCAR LIVROS
    // ==========================================

    function carregarLivros() {

        buscarLivros({
            setLivros
        });

    }


    // ==========================================
    // BUSCAR CATEGORIAS
    // ==========================================

    async function carregarCategorias() {

        try {

            const dados = await buscarCategorias();

            console.log(
                "CATEGORIAS:",
                dados
            );

            /*
             * A API retorna:
             *
             * {
             *     categorias: [...],
             *     total: 25
             * }
             *
             * O service já retorna somente
             * o array de categorias.
             */

            setCategorias(dados);

        } catch (error) {

            console.log(
                "ERRO AO CARREGAR CATEGORIAS:",
                error
            );

        }

    }


    // ==========================================
    // SELECIONAR CATEGORIA
    // ==========================================

    function selecionarCategoria(categoria) {

        /*
         * Se clicar novamente na mesma categoria,
         * remove o filtro.
         */

        if (
            categoriaSelecionada === categoria
        ) {

            setCategoriaSelecionada(null);

            return;

        }


        setCategoriaSelecionada(categoria);

    }


    // ==========================================
    // FILTRAR LIVROS
    // ==========================================

    const livrosFiltrados = livros.filter(
        function (livro) {

            // ==================================
            // BUSCA POR TEXTO
            // ==================================

            const textoBusca =
                busca
                    .toLowerCase()
                    .trim();


            const correspondeBusca =

                livro.titulo
                    ?.toLowerCase()
                    .includes(textoBusca)

                ||

                livro.autor
                    ?.toLowerCase()
                    .includes(textoBusca);


            // ==================================
            // FILTRO POR CATEGORIA
            // ==================================

            const correspondeCategoria =

                categoriaSelecionada === null

                ||

                livro.categoria
                    ?.toLowerCase()
                    .trim()

                ===

                categoriaSelecionada
                    ?.toLowerCase()
                    .trim();


            // ==================================
            // RESULTADO FINAL
            // ==================================

            return (
                correspondeBusca &&
                correspondeCategoria
            );

        }
    );


    // ==========================================
    // ABRIR LIVRO
    // ==========================================

    function abrirLivro(livro) {

        setLivroSelecionado(livro);

    }


    // ==========================================
    // FECHAR LIVRO
    // ==========================================

    function fecharLivro() {

        setLivroSelecionado(null);

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <SafeAreaView
            style={styles.container}
        >

            {/* ==================================
                TÍTULO
            ================================== */}

            <Titulo />


            {/* ==================================
                CAMPO DE BUSCA
            ================================== */}

            <InputBuscar
                value={busca}
                onChangeText={setBusca}
            />


            {/* ==================================
                CATEGORIAS
            ================================== */}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollCategorias}
                contentContainerStyle={
                    styles.listaCategorias
                }
            >

                {/* ==============================
                    BOTÃO TODAS
                ============================== */}

                <CategoriaBotao
                    categoria="Todas"

                    selecionada={
                        categoriaSelecionada === null
                    }

                    onPress={() =>
                        setCategoriaSelecionada(null)
                    }
                />


                {/* ==============================
                    CATEGORIAS DA API
                ============================== */}

                {categorias.map(
                    function (categoria) {

                        return (

                            <CategoriaBotao
                                key={categoria}

                                categoria={categoria}

                                selecionada={
                                    categoriaSelecionada
                                    ===
                                    categoria
                                }

                                onPress={
                                    selecionarCategoria
                                }
                            />

                        );

                    }
                )}

            </ScrollView>


            {/* ==================================
                LISTA DE LIVROS
            ================================== */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollLivros}
            >

                <View style={styles.lista}>

                    {livrosFiltrados.map(
                        function (livro) {

                            return (

                                <Card
                                    key={livro.id}

                                    livro={livro}

                                    onPress={
                                        abrirLivro
                                    }
                                />

                            );

                        }
                    )}

                </View>

            </ScrollView>


            {/* ==================================
                MODAL DO LIVRO
            ================================== */}

            <ModalLivro

                livro={livroSelecionado}

                visible={
                    livroSelecionado !== null
                }

                onClose={
                    fecharLivro
                }

            />

        </SafeAreaView>

    );

}


const styles = StyleSheet.create({

    // ==========================================
    // CONTAINER PRINCIPAL
    // ==========================================

    container: {

        flex: 1,

        paddingHorizontal: 15,

        paddingTop: 10,

        backgroundColor: "#f5f5f5",

    },


    // ==========================================
    // CATEGORIAS
    // ==========================================

    scrollCategorias: {

        marginTop: 12,

        marginBottom: 12,

        maxHeight: 50,

    },


    listaCategorias: {

        alignItems: "center",

        paddingRight: 15,

    },


    // ==========================================
    // LIVROS
    // ==========================================

    scrollLivros: {

        flex: 1,

    },


    lista: {

        flexDirection: "row",

        flexWrap: "wrap",

        justifyContent: "space-between",

        paddingBottom: 20,

    },

});