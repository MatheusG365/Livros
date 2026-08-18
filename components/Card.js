import React from "react";

import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";

export default function Card({ livro, onPress }) {

    return (

        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(livro)}
            activeOpacity={0.8}
        >

            <Image
                source={{ uri: livro.imagem }}
                style={styles.imagem}
                resizeMode="contain"
            />

            <Text
                style={styles.titulo}
                numberOfLines={2}
            >
                {livro.titulo}
            </Text>

            <Text
                style={styles.informacao}
                numberOfLines={2}
            >
                {livro.categoria} - {livro.autor}
            </Text>

        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({

    card: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 8,
        marginBottom: 15,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,

        elevation: 4
    },

    imagem: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginBottom: 8
    },

    titulo: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 5
    },

    informacao: {
        fontSize: 12,
        color: "#555"
    }

});
