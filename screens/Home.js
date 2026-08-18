import {
    View,
    ScrollView,
    StyleSheet,
    SafeAreaView
} from "react-native";

import {
    useEffect,
    useState
} from "react";

import Card from "../components/Card";

import {
    buscarLivros
} from "../service/livros/buscarLivros";

import Titulo from "../components/Titulo";
import InputBuscar from "../components/InputBusca";
import ModalLivro from "../components/ModalLivro";


export default function Home() {

    const [livros, setLivros] = useState([]);

    const [busca, setBusca] = useState("");

    const [livroSelecionado, setLivroSelecionado] = useState(null);


    useEffect(() => {

        buscarLivros({
            setLivros
        });

    }, []);


    function abrirLivro(livro) {

        setLivroSelecionado(livro);

    }


    function fecharLivro() {

        setLivroSelecionado(null);

    }


    return (

        <SafeAreaView style={styles.container}>

            <Titulo />

            <InputBuscar
                value={busca}
                onChangeText={setBusca}
            />


            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.lista}>

                    {livros.map(function (livro) {

                        return (

                            <Card
                                key={livro.id}
                                livro={livro}
                                onPress={abrirLivro}
                            />

                        );

                    })}

                </View>

            </ScrollView>


            {/* MODAL */}

            <ModalLivro
                livro={livroSelecionado}
                visible={livroSelecionado !== null}
                onClose={fecharLivro}
            />

        </SafeAreaView>

    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,

        paddingHorizontal: 15,
        paddingTop: 19,

        backgroundColor: "#f5f5f5",
    },

    lista: {
        flexDirection: "row",

        flexWrap: "wrap",

        justifyContent: "space-between",
    },

});