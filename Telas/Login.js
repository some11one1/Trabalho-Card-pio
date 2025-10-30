import { View, Text, Button, TextInput, Alert, StyleSheet, Image, TouchableOpacity  } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import  { AuthContext } from "../Context/AuthContext";
import React, { useContext } from "react";
export default function Login() {
  const { loginUser } = useContext(AuthContext)  // pega a função de logar do AuthContext
  const [username, setUsername] = React.useState(""); // estado pro username e vai mudar com o input
  const [senha, setSenha] = React.useState(""); // estado pra senha e vai mudar com o input


  const handleLogin = async () => { // é executada ao apertar no botao se um dos campos estiver vazio, avisa, mude isso depois pra ser um texto em baixo do input pra ficar melhor
    if (!username || !senha) {
      Alert.alert("um dos campos está vazio.");
      return; // se der errado, sai da função e nao continua o resto dela
    }
    
    const sucesso = await loginUser(username, senha); // verifica  um dos campos estiver errado, avisa, mude  isso depois pra ser um texto em baixo do input pra ficar melhor
    if (!sucesso) {
      Alert.alert("Usuário ou senha incorretos. se vira ai pra saber qual");
    }
  }
// se der certo, o Authconext atualiza o user automaticamente e vai mandar pro home 👍



  // não precisa explicar isso nem o resto, né
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 32, marginBottom: '10%'}}>
        FEED
        <Text style={{ color: "#2D7BFF" }}>HUB</Text>
      </Text>
      <TextInput
        style={styles.inputname}
        placeholder="Usuario"
        value={username} //o valor do input é o estado do username
        onChangeText={setUsername} //quando o texto mudar, atualiza o estado do username
      />
      <TextInput
        style={styles.inputname}
        placeholder="Senha"
        value={senha} // mesma coisa pra senha
        onChangeText={setSenha}
      />
      {/* quando clicar no botão, chama a função de logar */}
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
