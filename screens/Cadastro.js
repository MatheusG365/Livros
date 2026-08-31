import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cadastrarUsuario } from "../storage/usuarioLocal";

export default function Cadastro({ navigation }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [salvando, setSalvando] = useState(false);
    const dark = useColorScheme() === "dark";

    async function salvar() {
        if (!nome.trim() || !email.trim() || !senha.trim()) {
            Alert.alert("Atenção", "Preencha nome, e-mail e senha.");
            return;
        }
        if (senha !== confirmarSenha) {
            Alert.alert("Atenção", "As senhas não são iguais.");
            return;
        }

        try {
            setSalvando(true);
            await cadastrarUsuario({ nome: nome.trim(), email: email.trim(), senha });
            Alert.alert("Cadastro concluído", "A conta foi salva neste aparelho. Agora faça login.", [
                { text: "Entrar", onPress: () => navigation.navigate("Login") },
            ]);
        } catch (error) {
            Alert.alert("Erro", error.message);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, dark && styles.containerDark]}>
            <View style={styles.icone}><Ionicons name="person-add" size={28} color="#fff" /></View>
            <Text style={[styles.titulo, dark && styles.textoDark]}>Criar conta</Text>
            <Text style={[styles.aviso, dark && styles.avisoDark]}>Este cadastro é local e não envia o usuário para a API.</Text>
            <TextInput style={[styles.input, dark && styles.inputDark]} placeholder="Nome" placeholderTextColor={dark ? "#888" : "#777"} value={nome} onChangeText={setNome} />
            <TextInput style={[styles.input, dark && styles.inputDark]} placeholder="E-mail" placeholderTextColor={dark ? "#888" : "#777"} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            <TextInput style={[styles.input, dark && styles.inputDark]} placeholder="Senha" placeholderTextColor={dark ? "#888" : "#777"} secureTextEntry value={senha} onChangeText={setSenha} />
            <TextInput style={[styles.input, dark && styles.inputDark]} placeholder="Confirmar senha" placeholderTextColor={dark ? "#888" : "#777"} secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />
            <TouchableOpacity style={styles.botao} onPress={salvar} disabled={salvando} activeOpacity={0.85}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.botaoTexto}>{salvando ? "Salvando..." : "Cadastrar"}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 22, flexGrow: 1, justifyContent: "center", backgroundColor: "#f5f5f5" },
    containerDark: { backgroundColor: "#121212" },
    icone: { width: 58, height: 58, borderRadius: 18, backgroundColor: "#0066B3", alignItems: "center", justifyContent: "center", marginBottom: 15 },
    titulo: { fontSize: 30, fontWeight: "800", marginBottom: 10, color: "#222" },
    textoDark: { color: "#fff" },
    aviso: { color: "#666", marginBottom: 20, lineHeight: 20 },
    avisoDark: { color: "#aaa" },
    input: { height: 52, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, paddingHorizontal: 14, marginBottom: 12, fontSize: 16, color: "#222" },
    inputDark: { backgroundColor: "#202020", borderColor: "#444", color: "#fff" },
    botao: { flexDirection: "row", gap: 8, backgroundColor: "#0066B3", padding: 15, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 8 },
    botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
