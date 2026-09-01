
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { realizarLogin } from "../service/usuario/realizarLogin";
import { useApp } from "../context/AppContext";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);

  const dark = useColorScheme() === "dark";
  const { entrarSessao } = useApp();

  async function entrar() {
    if (!email.trim() || !senha) {
      return Alert.alert("Atenção", "Informe e-mail e senha.");
    }

    try {
      setLoading(true);

      const { usuario, token } = await realizarLogin(email, senha);

      await entrarSessao(usuario, token);

      navigation.replace("Home");
    } catch (e) {
      Alert.alert(
        "Não foi possível entrar",
        e.message || "E-mail ou senha inválidos."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, dark && styles.dark]}>
      <View style={styles.icon}>
        <Ionicons name="book" size={36} color="#fff" />
      </View>

      <Text style={[styles.title, dark && styles.white]}>
        Entrar
      </Text>

      <Text style={[styles.sub, dark && styles.gray]}>
        Entre para acessar a livraria e seus recursos.
      </Text>

      <TextInput
        style={[styles.input, dark && styles.inputDark]}
        placeholder="E-mail"
        placeholderTextColor={dark ? "#888" : "#777"}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={[styles.pass, dark && styles.inputDark]}>
        <TextInput
          style={[styles.passInput, dark && styles.white]}
          placeholder="Senha"
          placeholderTextColor={dark ? "#888" : "#777"}
          secureTextEntry={!mostrar}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          onPress={() => setMostrar(!mostrar)}
        >
          <Ionicons
            name={mostrar ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={entrar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons
              name="log-in-outline"
              size={20}
              color="#fff"
            />

            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={styles.linkText}>
          Criar conta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },

  dark: {
    backgroundColor: "#121212",
  },

  icon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#0066B3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#222",
    marginBottom: 8,
  },

  white: {
    color: "#fff",
  },

  sub: {
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },

  gray: {
    color: "#aaa",
  },

  input: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
    color: "#222",
  },

  inputDark: {
    backgroundColor: "#202020",
    borderColor: "#444",
    color: "#fff",
  },

  pass: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  passInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#0066B3",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  link: {
    padding: 15,
    alignItems: "center",
  },

  linkText: {
    color: "#0066B3",
    fontWeight: "800",
  },
});

