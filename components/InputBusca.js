import React from "react";
import {
    View,
    TextInput,
    StyleSheet
} from "react-native";

export default function InputBusca({ value, onChangeText }) {

    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                placeholder="Buscar..."
                placeholderTextColor="#777"
                value={value}
                onChangeText={onChangeText}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        width: "100%",
        marginVertical: 10,
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        fontSize: 16,
    },

});