
import React, { useState } from "react";
import {
  ScrollView,
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

import {
  cadastrarLivro,
  editarLivro,
} from "../service/livros/livros";

import { getBiometria } from "../service/usuario/biometria";

export default function CadastroLivro({ navigation, route }) {
  const livro = route?.params?.livro || null;
  const editando = !!livro;
  const dark = useColorScheme() === "dark";

  const [titulo, setTitulo] = useState(livro?.titulo || "");
  const [autor, setAutor] = useState(livro?.autor || "");
  const [categoria, setCategoria] = useState(
    livro?.categoria || ""
  );
  const [faixaEtaria, setFaixaEtaria] = useState(
    livro?.faixa_etaria || ""
  );
  const [descricao, setDescricao] = useState(
    livro?.descricao || ""
  );
  const [imagem, setImagem] = useState(
    livro?.imagem || ""
  );

  const [loading, setLoading] = useState(false);

  function input(label, value, setValue, options = {}) {
    return (
      <View>
        <Text style={[styles.label, dark && styles.white]}>
          {label}
        </Text>

        <TextInput
          {...options}
          value={value}
          onChangeText={setValue}
          style={[
            styles.input,
            dark && styles.inputDark,
          ]}
          placeholderTextColor="#777"
        />
      </View>
    );
  }

  async function salvar() {
    // =========================
    // VALIDAÇÃO
    // =========================

    if (!titulo.trim()) {
      Alert.alert(
        "Atenção",
        "O título é obrigatório."
      );
      return;
    }

    if (!autor.trim()) {
      Alert.alert(
        "Atenção",
        "O autor é obrigatório."
      );
      return;
    }

    if (!categoria.trim()) {
      Alert.alert(
        "Atenção",
        "A categoria é obrigatória."
      );
      return;
    }

    if (!faixaEtaria.trim()) {
      Alert.alert(
        "Atenção",
        "A faixa etária é obrigatória."
      );
      return;
    }

    // =========================
    // BIOMETRIA
    // =========================

    const autenticado = await getBiometria();

    if (!autenticado) {
      Alert.alert(
        "Autenticação necessária",
        "Confirme sua identidade para continuar."
      );

      return;
    }

    // =========================
    // DADOS DO LIVRO
    // =========================

    const payload = {
      imagem: imagem.trim(),
      titulo: titulo.trim(),
      categoria: categoria.trim(),
      descricao: descricao.trim(),
      autor: autor.trim(),
      faixa_etaria: faixaEtaria.trim(),
    };

    console.log(
      "Enviando livro:",
      JSON.stringify(payload, null, 2)
    );

    try {
      setLoading(true);

      if (editando) {
        await editarLivro(
          livro.id,
          payload
        );
      } else {
        await cadastrarLivro(
          payload
        );
      }

      Alert.alert(
        "Sucesso",
        editando
          ? "Livro atualizado com sucesso."
          : "Livro cadastrado com sucesso.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } catch (e) {
      console.log(
        "Erro ao salvar livro:",
        e
      );

      Alert.alert(
        "Erro",
        e?.message ||
          "Não foi possível salvar o livro."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        dark && styles.dark,
      ]}
    >
      {/* ÍCONE */}
      <View style={styles.icon}>
        <Ionicons
          name="book"
          size={34}
          color="#fff"
        />
      </View>

      {/* TÍTULO */}
      <Text
        style={[
          styles.title,
          dark && styles.white,
        ]}
      >
        {editando
          ? "Editar livro"
          : "Cadastrar livro"}
      </Text>

      <Text
        style={[
          styles.sub,
          dark && styles.gray,
        ]}
      >
        {editando
          ? "Atualize as informações do livro."
          : "Cadastre um novo livro na API."}
      </Text>

      {/* TÍTULO */}
      {input(
        "Título",
        titulo,
        setTitulo,
        {
          placeholder:
            "Título do livro",
        }
      )}

      {/* AUTOR */}
      {input(
        "Autor",
        autor,
        setAutor,
        {
          placeholder:
            "Nome do autor",
        }
      )}

      {/* CATEGORIA */}
      {input(
        "Categoria",
        categoria,
        setCategoria,
        {
          placeholder:
            "Ex: Fantasia",
        }
      )}

      {/* FAIXA ETÁRIA */}
      {input(
        "Faixa etária",
        faixaEtaria,
        setFaixaEtaria,
        {
          placeholder:
            "Ex: 10+",
        }
      )}

      {/* IMAGEM */}
      {input(
        "Imagem (URL)",
        imagem,
        setImagem,
        {
          placeholder:
            "https://exemplo.com/capa.jpg",
          keyboardType: "url",
          autoCapitalize: "none",
          autoCorrect: false,
        }
      )}

      {/* DESCRIÇÃO */}
      <Text
        style={[
          styles.label,
          dark && styles.white,
        ]}
      >
        Descrição
      </Text>

      <TextInput
        value={descricao}
        onChangeText={setDescricao}
        multiline
        placeholder="Descrição do livro"
        placeholderTextColor="#777"
        style={[
          styles.textarea,
          dark && styles.inputDark,
        ]}
      />

      {/* BOTÃO */}
      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={salvar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator
            color="#fff"
          />
        ) : (
          <>
            <Ionicons
              name={
                editando
                  ? "checkmark-circle-outline"
                  : "finger-print-outline"
              }
              size={21}
              color="#fff"
            />

            <Text
              style={styles.buttonText}
            >
              {editando
                ? "Salvar alterações"
                : "Cadastrar com digital"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
    marginBottom: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#222",
    marginBottom: 6,
  },

  white: {
    color: "#fff",
  },

  sub: {
    color: "#666",
    marginBottom: 18,
  },

  gray: {
    color: "#aaa",
  },

  label: {
    fontWeight: "800",
    color: "#444",
    marginBottom: 6,
    marginTop: 4,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 16,
    color: "#222",
    marginBottom: 10,
  },

  inputDark: {
    backgroundColor: "#202020",
    borderColor: "#444",
    color: "#fff",
  },

  textarea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 13,
    fontSize: 16,
    color: "#222",
    textAlignVertical: "top",
    marginBottom: 15,
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

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});

