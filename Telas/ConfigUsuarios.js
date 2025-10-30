import { View, Text, Button, TextInput, StyleSheet, FlatList } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import React, { useContext, useEffect } from "react";
import { usarTheme, tema} from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";


export default function ConfigUsuarios() {
  const { CriarUsuario, DeletarUsuario, ListarUsuarios,  usuarios, setUsuarios } = useContext(AuthContext);
  const { tema } = usarTheme();
  const [ username, setUsername ] = React.useState("");
  const [ senha, setSenha ] = React.useState("");
  const [ is_admin, setIs_Admin ] = React.useState(false);

  useEffect(() => {
    ListarUsuarios();
  }, []);


  const handleCriarUsuario = async () => {
    if (!username || !senha) {
      alert("Um dos campos está vazio.");
      return;
    } 
    const sucesso = await CriarUsuario(username, senha, is_admin); // chama a função de criar usuario do AuthContext
    if (!sucesso) { // se der errado
      alert("Erro ao criar usuário");
      return; // se der errado, sai da função e nao continua o resto dela
    }
    ListarUsuarios(); // atualiza a lista de usuarios depois de criar um novo
  }
  return ( 
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tema.background,
        flexDirection: "row",
        gap: 100
      }}
    >
      <View>
        <Text style={{ color: tema.texto }}>Criar Users</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: tema.texto,
            width: 150,
            height: 25,
            color: tema.texto,
          }}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: tema.texto,
            width: 150,
            height: 25,
            color: tema.texto,
          }}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
        />
        <Button
          title={is_admin ? "é admin" : "não é admin"}
          onPress={() => {
            setIs_Admin(!is_admin);
            console.log("is_admin agora:", !is_admin);
          }}
        />

        <Button title="Criar Usuario" onPress={handleCriarUsuario} />
      </View>

      <View>
        <Text style={{ color: tema.texto }}>Lista de usuarios</Text>
        <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()} // converte o id pra string pq as chaves tem que ser strings
        renderItem={({ item }) => ( // pra cada item da lista, renderiza isso aqui
          <View
            style={{
              flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: 250,}}>
                
            <Text style={{ color: tema.texto }}>{item.username} - {item.is_admin ? "Admin" : "User"}</Text> 
            <Button
              title="Deletar"
              // executa a função de deletar usuario passando o id do usuario atual, tá la no AuthContext.js
              onPress={() => DeletarUsuario(item.id)} /> 
          </View>
        )}
        />
      </View>
    </View>
  );

}
const styles = StyleSheet.create({

});
