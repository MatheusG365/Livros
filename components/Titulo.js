import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";

export default function Titulo() {
    const dark = useColorScheme() === "dark";
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                <Text style={styles.senai}>SENAI</Text>
                <Text style={dark ? styles.bookeDark : styles.booke}> Booke</Text>
            </Text>
            <Text style={[styles.subtitulo, dark && styles.subtituloDark]}>Sua biblioteca digital</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: "100%", marginBottom: 12 },
    titulo: { fontSize: 28, fontWeight: "bold" },
    senai: { color: "#0066B3" },
    booke: { color: "#000" },
    bookeDark: { color: "#fff" },
    subtitulo: { color: "#666", marginTop: 2, fontSize: 12 },
    subtituloDark: { color: "#aaa" },
});
