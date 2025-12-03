import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useWindowDimensions } from "react-native";
import { AuthContext } from "../Context/AuthContext";
import React, { useContext, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../Supabase";
import { usarTheme } from "../Context/ThemeContext";

import { InputModerno } from "../Componentes/style/input";
export default function Login() {

  // documentação do diego se achar que é IA problema seu, achei melhor comentar pq vai ficar confuso

  {/*Isso é apenas para pegar o tamanho das imagens*/ }
  const { width, height } = useWindowDimensions();

  const { loginUser } = useContext(AuthContext);
  const [username, setUsername] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const { tema } = usarTheme();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !senha) {
      Alert.alert("um dos campos está vazio.");
      return;
    }

    const resultado = await loginUser(username, senha);

    if (resultado === false) {
      // usuário não existe ou senha errada
      Alert.alert("Erro", "Usuário ou senha incorretos.");
      return;
    }

    if (resultado && resultado.error) {
      // usuário existe mas está desativado
      Alert.alert("Acesso negado", resultado.error);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text
        style={{
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: 32,
          marginBottom: "10%",
        }}
      >
        FEED
        <Text style={{ color: "#2D7BFF" }}>HUB</Text>
      </Text>
      <View style={{ width: "90%", marginTop: height * 0.03 }}>
        <InputModerno
          value={username}
          onChangeText={setUsername}
          placeholder="Seu username"
        />
        <InputModerno
          value={senha}
          onChangeText={setSenha}
          secure
        />


      </View>
      <TouchableOpacity style={{
        width: width * 0.9,
        backgroundColor: tema.textoAtivo,
        paddingVertical: height * 0.02,
        borderRadius: 12,
        marginTop: height * 0.03,
        alignItems: "center",
        opacity: loading ? 0.7 : 1,
      }} onPress={handleLogin}>
        <Text style={styles.text_white}>Logar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1aff",
    alignItems: "center",
    justifyContent: "center",
  },

  inputname: {
    backgroundColor: "#6e6e6eff",
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    color: "#ffffffff",
    marginBottom: 10,
    outlineWidth: 0,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6e6e6eff",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 5,
    color: "#ffffffff",
    outlineWidth: 0,
  },
  iconButton: {
    padding: 10,
  },

  button_send: {
    width: "20%",
    height: 40,
    backgroundColor: "#067EC9",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  logo: {
    width: "19%",
    height: "9%",
  },
  text_white: {
    fontWeight: "bold",
    color: "white",
  },
});
