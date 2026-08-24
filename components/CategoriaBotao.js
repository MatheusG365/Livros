import {
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";


export default function CategoriaBotao({
                                           categoria,
                                           selecionada,
                                           onPress
                                       }) {

    return (

        <TouchableOpacity
            style={[
                styles.botao,
                selecionada && styles.botaoSelecionado
            ]}
            onPress={() => onPress(categoria)}
            activeOpacity={0.8}
        >

            <Text
                style={[
                    styles.texto,
                    selecionada && styles.textoSelecionado
                ]}
            >
                {categoria}
            </Text>

        </TouchableOpacity>

    );

}


const styles = StyleSheet.create({

    botao: {
        backgroundColor: "#fff",

        borderWidth: 1,
        borderColor: "#ddd",

        borderRadius: 20,

        paddingVertical: 9,
        paddingHorizontal: 16,

        marginRight: 8
    },

    botaoSelecionado: {
        backgroundColor: "#222",
        borderColor: "#222"
    },

    texto: {
        fontSize: 13,
        fontWeight: "500",
        color: "#333"
    },

    textoSelecionado: {
        color: "#fff",
        fontWeight: "bold"
    }

});