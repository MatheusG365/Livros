
import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


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


export default function Card({
    livro,
    onPress,
    favorito,
    onFavorito,
    modoEscuro,
    podeFavoritar = true,
}) {

    const preco =
        obterPreco(livro);


    function favoritar(event) {

        event?.stopPropagation?.();

        onFavorito?.(livro);
    }


    const imagem =
        livro?.imagem ||
        livro?.capa;


    const titulo =
        livro?.titulo ||
        livro?.title ||
        "Sem título";


    const categoria =
        livro?.categoria ||
        livro?.category ||
        "Sem categoria";


    const autor =
        livro?.autor ||
        livro?.author ||
        "Autor não informado";


    return (

        <TouchableOpacity
            style={[
                styles.card,
                modoEscuro &&
                styles.cardEscuro,
            ]}
            onPress={() =>
                onPress?.(livro)
            }
            activeOpacity={0.85}
        >

            {/* =================================================
                IMAGEM
            ================================================= */}

            <View
                style={[
                    styles.imagemContainer,
                    modoEscuro &&
                    styles.imagemDark,
                ]}
            >

                {
                    imagem ? (

                        <Image
                            source={{
                                uri: imagem,
                            }}
                            style={
                                styles.imagem
                            }
                            resizeMode="contain"
                        />

                    ) : (

                        <Ionicons
                            name="book-outline"
                            size={52}
                            color={
                                modoEscuro
                                    ? "#888"
                                    : "#777"
                            }
                        />

                    )
                }


                {/* =================================================
                    FAVORITO
                ================================================= */}

                {
                    podeFavoritar && (

                        <TouchableOpacity
                            style={
                                styles.favorito
                            }
                            onPress={
                                favoritar
                            }
                            hitSlop={8}
                        >

                            <Ionicons
                                name={
                                    favorito
                                        ? "heart"
                                        : "heart-outline"
                                }
                                size={21}
                                color={
                                    favorito
                                        ? "#d21f3c"
                                        : "#333"
                                }
                            />

                        </TouchableOpacity>

                    )
                }

            </View>


            {/* =================================================
                TÍTULO
            ================================================= */}

            <Text
                style={[
                    styles.titulo,
                    modoEscuro &&
                    styles.textoEscuro,
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {titulo}
            </Text>


            {/* =================================================
                CATEGORIA / AUTOR
            ================================================= */}

            <Text
                style={[
                    styles.informacao,
                    modoEscuro &&
                    styles.informacaoEscura,
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {categoria} • {autor}
            </Text>


            {/* =================================================
                PREÇO
            ================================================= */}

            <Text
                style={[
                    styles.preco,
                    modoEscuro &&
                    styles.precoDark,
                ]}
                numberOfLines={1}
            >

                {
                    preco === null
                        ? "Preço não informado"
                        : `R$ ${preco
    .toFixed(2)
    .replace(".", ",")}`
                }

            </Text>

        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({

    /*
     * IMPORTANTE:
     *
     * NÃO coloque width: "48%" aqui.
     *
     * A largura agora é controlada pelo
     * cardWrap da Home.
     */

    card: {

        width: "100%",

        backgroundColor: "#fff",

        borderRadius: 14,

        padding: 8,

        marginBottom: 5,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.15,

        shadowRadius: 5,

        elevation: 4,
    },


    cardEscuro: {
        backgroundColor: "#1e1e1e",
    },


    /*
     * Área da capa
     */

    imagemContainer: {

        width: "100%",

        height: 180,

        borderRadius: 10,

        backgroundColor: "#f0f0f0",

        overflow: "hidden",

        marginBottom: 8,

        position: "relative",

        alignItems: "center",

        justifyContent: "center",
    },


    imagemDark: {
        backgroundColor: "#292929",
    },


    imagem: {

        width: "100%",

        height: "100%",
    },


    /*
     * Botão de favorito
     */

    favorito: {

        position: "absolute",

        right: 7,

        top: 7,

        width: 36,

        height: 36,

        borderRadius: 18,

        backgroundColor:
            "rgba(255,255,255,0.94)",

        justifyContent: "center",

        alignItems: "center",

        elevation: 2,
    },


    /*
     * Título
     */

    titulo: {

        width: "100%",

        fontSize: 15,

        lineHeight: 19,

        fontWeight: "bold",

        color: "#222",

        marginBottom: 5,
    },


    textoEscuro: {
        color: "#fff",
    },


    /*
     * Categoria + autor
     */

    informacao: {

        width: "100%",

        fontSize: 12,

        lineHeight: 16,

        color: "#555",
    },


    informacaoEscura: {
        color: "#bbb",
    },


    /*
     * Preço
     */

    preco: {

        width: "100%",

        fontSize: 13,

        lineHeight: 18,

        fontWeight: "bold",

        color: "#0066B3",

        marginTop: 7,
    },


    precoDark: {
        color: "#63b4ef",
    },

});

