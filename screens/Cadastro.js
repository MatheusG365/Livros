import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cadastrarUsuarioAPI, editarUsuario } from "../service/usuario/usuarios";
import { useApp } from "../context/AppContext";

export default function Cadastro({ navigation, route }) {
  const usuarioEdicao = route?.params?.usuario || null;
  const [nome,setNome]=useState(usuarioEdicao?.nome || ""); const [email,setEmail]=useState(usuarioEdicao?.email || ""); const [senha,setSenha]=useState(""); const [loading,setLoading]=useState(false); const dark=useColorScheme()==="dark"; const { usuario: atual, entrarSessao, token }=useApp();
  const editando=!!usuarioEdicao;
  async function salvar(){
    if(!nome.trim() || !email.trim() || (!editando && !senha)) return Alert.alert("Atenção","Preencha nome, e-mail e senha.");
    const payload={nome:nome.trim(),email:email.trim()}; if(senha) payload.senha=senha;
    try { setLoading(true); const resposta=editando ? await editarUsuario(usuarioEdicao.id,payload) : await cadastrarUsuarioAPI({...payload,senha});
      if(editando && atual?.id && String(atual.id)===String(usuarioEdicao.id)) await entrarSessao({...atual,...payload},token);
      Alert.alert("Sucesso",editando?"Usuário atualizado com sucesso.":"Usuário cadastrado com sucesso.",[ {text:"OK",onPress:()=>navigation.goBack()} ]);
    } catch(e){ Alert.alert("Erro",e.message||"Não foi possível salvar o usuário."); } finally{setLoading(false);}
  }
  return <ScrollView contentContainerStyle={[styles.container,dark&&styles.dark]}><View style={styles.icon}><Ionicons name="person-add" size={34} color="#fff"/></View><Text style={[styles.title,dark&&styles.white]}>{editando?"Editar usuário":"Criar conta"}</Text><Text style={[styles.sub,dark&&styles.gray]}>{editando?"Atualize os dados do usuário.":"O cadastro agora é feito diretamente na API."}</Text>
    <TextInput style={[styles.input,dark&&styles.inputDark]} placeholder="Nome" placeholderTextColor="#777" value={nome} onChangeText={setNome}/><TextInput style={[styles.input,dark&&styles.inputDark]} placeholder="E-mail" placeholderTextColor="#777" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}/><TextInput style={[styles.input,dark&&styles.inputDark]} placeholder={editando?"Nova senha (opcional)":"Senha"} placeholderTextColor="#777" secureTextEntry value={senha} onChangeText={setSenha}/>
    <TouchableOpacity style={styles.button} onPress={salvar} disabled={loading}>{loading?<ActivityIndicator color="#fff"/>:<><Ionicons name="save-outline" size={20} color="#fff"/><Text style={styles.buttonText}>{editando?"Salvar alterações":"Cadastrar"}</Text></>}</TouchableOpacity>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{flexGrow:1,padding:22,backgroundColor:"#f5f5f5"},dark:{backgroundColor:"#121212"},icon:{width:64,height:64,borderRadius:20,backgroundColor:"#0066B3",alignItems:"center",justifyContent:"center",marginBottom:18},title:{fontSize:30,fontWeight:"800",color:"#222",marginBottom:8},white:{color:"#fff"},sub:{color:"#666",marginBottom:20},gray:{color:"#aaa"},input:{height:52,borderWidth:1,borderColor:"#ddd",borderRadius:12,backgroundColor:"#fff",paddingHorizontal:14,marginBottom:12,fontSize:16,color:"#222"},inputDark:{backgroundColor:"#202020",borderColor:"#444",color:"#fff"},button:{height:52,borderRadius:12,backgroundColor:"#0066B3",alignItems:"center",justifyContent:"center",flexDirection:"row",gap:8},buttonText:{color:"#fff",fontWeight:"800",fontSize:16}});
