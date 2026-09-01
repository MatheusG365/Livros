import React from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "./context/AppContext";
import Home from "./screens/Home"; import Login from "./screens/Login"; import Cadastro from "./screens/Cadastro"; import CadastroLivro from "./screens/CadastroLivro"; import DetalhesLivro from "./screens/DetalhesLivro"; import Favoritos from "./screens/Favoritos"; import Usuarios from "./screens/Usuarios";
const Stack=createNativeStackNavigator();
export default function App(){const dark=useColorScheme()==="dark";return <AppProvider><NavigationContainer theme={dark?DarkTheme:DefaultTheme}><StatusBar style={dark?"light":"dark"}/><Stack.Navigator initialRouteName="Login" screenOptions={{headerStyle:{backgroundColor:dark?"#181818":"#fff"},headerTintColor:dark?"#fff":"#222",headerTitleStyle:{fontWeight:"700"}}}><Stack.Screen name="Login" component={Login} options={{title:"Entrar"}}/><Stack.Screen name="Cadastro" component={Cadastro} options={{title:"Usuário"}}/><Stack.Screen name="Home" component={Home} options={{headerShown:false}}/><Stack.Screen name="CadastroLivro" component={CadastroLivro} options={{title:"Livro"}}/><Stack.Screen name="DetalhesLivro" component={DetalhesLivro} options={{title:"Detalhes do livro"}}/><Stack.Screen name="Favoritos" component={Favoritos} options={{title:"Meus favoritos"}}/><Stack.Screen name="Usuarios" component={Usuarios} options={{title:"Usuários"}}/></Stack.Navigator></NavigationContainer></AppProvider>}
