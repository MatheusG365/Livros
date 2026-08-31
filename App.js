import React from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import Home from "./screens/Home";
import DetalhesLivro from "./screens/DetalhesLivro";
import Favoritos from "./screens/Favoritos";
import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import CadastroLivro from "./screens/CadastroLivro";
import { AppProvider } from "./context/AppContext";

const Stack = createNativeStackNavigator();

export default function App() {
    const dark = useColorScheme() === "dark";

    return (
        <AppProvider>
            <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
                <StatusBar style={dark ? "light" : "dark"} />
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: { backgroundColor: dark ? "#181818" : "#fff" },
                        headerTintColor: dark ? "#fff" : "#222",
                        headerTitleStyle: { fontWeight: "700" },
                    }}
                >
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                    <Stack.Screen name="DetalhesLivro" component={DetalhesLivro} options={{ title: "Detalhes do livro" }} />
                    <Stack.Screen name="Favoritos" component={Favoritos} options={{ title: "Meus favoritos" }} />
                    <Stack.Screen name="Login" component={Login} options={{ title: "Entrar" }} />
                    <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: "Criar conta" }} />
                    <Stack.Screen name="CadastroLivro" component={CadastroLivro} options={{ title: "Cadastrar livro" }} />
                </Stack.Navigator>
            </NavigationContainer>
        </AppProvider>
    );
}
