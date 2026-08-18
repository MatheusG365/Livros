import React from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";

export default function Titulo() {

    return (
        <View style={styles.container}>

            <Text style={styles.titulo}>
                <Text style={styles.senai}>SENAI</Text>
                <Text style={styles.booke}> Booke</Text>
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        width: "100%",
        marginBottom: 15,
    },

    titulo: {
        fontSize: 28,
        fontWeight: "bold",
    },

    senai: {
        color: "#0066B3",
    },

    booke: {
        color: "#000",
    },

});