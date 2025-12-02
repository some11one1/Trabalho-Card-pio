import { View, Text, Button, TextInput, Alert, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../Context/AuthContext";
import React, { useContext, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../Supabase";
export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const [username, setUsername] = React.useState("");
  const [senha, setSenha] = React.useState(""); 

  const [isSecure, setIsSecure] = useState(true);

  // Função para alternar a visibilidade
  const toggleVisibility = () => {
    setIsSecure((prev) => !prev);
  };

  const handleLogin = async () => {
    if (!username || !senha) {
      Alert.alert("um dos campos está vazio.");
      return;
    }

    const sucesso = await loginUser(username, senha);
    if (!sucesso) {
      Alert.alert("Usuário ou senha incorretos. se vira ai pra saber qual");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 32, marginBottom: '10%' }}>
        FEED
        <Text style={{ color: "#2D7BFF" }}>HUB</Text>
      </Text>
      <TextInput
        style={styles.inputname}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#bbb"
      />

  
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={isSecure} 
          placeholderTextColor="#bbb"
        />
        <TouchableOpacity onPress={toggleVisibility} style={styles.iconButton}>
          <Feather
            name={isSecure ? 'eye-off' : 'eye'} 
            size={22}
            color="#ffffffff"
            
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button_send} onPress={handleLogin}>
        <Text style={styles.text_white} >Logar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1aff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputname: {
    width: '50%',
    backgroundColor: '#6e6e6eff',
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    color: '#ffffffff',
    marginBottom: 10,
    outlineWidth: 0,
  },


  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    backgroundColor: '#6e6e6eff',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 5,
    color: '#ffffffff',
    outlineWidth: 0,
  },
  iconButton: {
    padding: 10,
  },
 

  button_send: {
    width: '20%',
    height: 40,
    backgroundColor: '#067EC9',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  logo: {
    width: '19%',
    height: '9%',
  },
  text_white: {
    fontWeight: 'bold',
    color: 'white',
  }
}); 