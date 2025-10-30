import { View, Text, Button, TextInput, Alert,  } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: "black", width: 150, height: 25 }}
        placeholder="Usuario"
        value={username} //o valor do input é o estado do username
        onChangeText={setUsername} //quando o texto mudar, atualiza o estado do username
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: "black", width: 150, height: 25 }}
        placeholder="Senha"
        value={senha} // mesma coisa pra senha
        onChangeText={setSenha}
      />
      {/* quando clicar no botão, chama a função de logar */}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}