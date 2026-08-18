import React from "react";

import {
    Modal,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from "react-native";

export default function ModalLivro({
                                       livro,
                                       visible,
                                       onClose
                                   }) {

    return (

        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >

            <View style={styles.fundoModal}>

                <View style={styles.modal}>

                    {/* BOTÃO FECHAR */}

                    <TouchableOpacity
                        style={styles.botaoFechar}
                        onPress={onClose}
                    >

                        <Text style={styles.textoFechar}>
                            X
                        </Text>

                    </TouchableOpacity>


                    {/* INFORMAÇÕES DO LIVRO */}

                    {livro && (

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >

                            <Image
                                source={{
                                    uri: livro.imagem
                                }}
                                style={styles.imagemGrande}
                                resizeMode="contain"
                            />


                            <Text style={styles.titulo}>
                                {livro.titulo}
                            </Text>


                            <Text style={styles.informacao}>
                                <Text style={styles.label}>
                                    Autor:
                                </Text>

                                {" "}{livro.autor}
                            </Text>


                            <Text style={styles.informacao}>
                                <Text style={styles.label}>
                                    Categoria:
                                </Text>

                                {" "}{livro.categoria}
                            </Text>


                            <Text style={styles.tituloDescricao}>
                                Descrição
                            </Text>


                            <Text style={styles.descricao}>
                                {livro.descricao}
                            </Text>

                        </ScrollView>

                    )}

                </View>

            </View>

        </Modal>

    );
}


const styles = StyleSheet.create({

    fundoModal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
    },

    modal: {
        width: "95%",
        height: "90%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
    },

    botaoFechar: {
        position: "absolute",

        right: 15,
        top: 15,

        width: 40,
        height: 40,

        borderRadius: 20,

        backgroundColor: "#0066B3",

        justifyContent: "center",
        alignItems: "center",

        zIndex: 10,
    },

    textoFechar: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },

    imagemGrande: {
        width: "100%",
        height: 350,

        marginTop: 20,
        marginBottom: 20,
    },

    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#222",

        marginBottom: 15,
    },

    informacao: {
        fontSize: 17,
        color: "#444",

        marginBottom: 8,
    },

    label: {
        fontWeight: "bold",
        color: "#0066B3",
    },

    tituloDescricao: {
        fontSize: 20,
        fontWeight: "bold",

        color: "#0066B3",

        marginTop: 15,
        marginBottom: 8,
    },

    descricao: {
        fontSize: 16,
        color: "#555",

        lineHeight: 24,

        marginBottom: 30,
    },

});