import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Supabase";
export default function ConfigUsuarios() {
  const { CriarUsuario, TrocarEstadoUser, ListarUsuarios, usuarios } =
    useContext(AuthContext);
  const { tema, isModoEscuro } = usarTheme();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [is_admin, setIs_Admin] = useState(false);

  useEffect(() => {
    ListarUsuarios();

    const canal = supabase
      .channel("usuarios-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "usuarios",
        },
        (payload) => {
          console.log(payload);
          ListarUsuarios();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  const handleCriarUsuario = async () => {
    if (!username || !senha) {
      alert("Um dos campos está vazio.");
      return;
    }
    const sucesso = await CriarUsuario(username, senha, is_admin);
    if (!sucesso) {
      alert("Erro ao criar usuário, Usuário já existe.");
      return;
    }
    ListarUsuarios();
    setUsername("");
    setSenha("");
    setIs_Admin(false);
  };

  const corDeletar = isModoEscuro ? "#FFFFFF" : tema.perigo;

  return (
    <View style={[styles.container, { backgroundColor: tema.background }]}>
      <View style={styles.criarContainer}>
        <Text style={[styles.title, { color: tema.texto }]}>Criar Usuário</Text>

        <TextInput
          style={[styles.input, { borderColor: tema.texto, color: tema.texto }]}
          placeholder="Usuário"
          placeholderTextColor={tema.texto + "99"}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={[styles.input, { borderColor: tema.texto, color: tema.texto }]}
          placeholder="Senha"
          placeholderTextColor={tema.texto + "99"}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.toggleButton, { borderColor: tema.texto }]}
          onPress={() => setIs_Admin(!is_admin)}
        >
          <Text style={{ color: tema.texto }}>
            {is_admin ? "É admin" : "Não é admin"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.criarButton, { backgroundColor: tema.textoAtivo }]}
          onPress={handleCriarUsuario}
        >
          <Text style={{ color: tema.textoReverse, fontWeight: "bold" }}>
            Criar Usuário
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listaContainer}>
        <Text style={[styles.title, { color: tema.texto }]}>
          Lista de Usuários
        </Text>

        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[styles.usuarioItem, { borderColor: tema.textoAtivo }]}
            >
              <Text style={{ color: tema.texto }}>
                {item.username} - {item.is_admin ? "Admin" : "User"} -{" "}
                {item.ativo ? "Ativo" : "Desativado"}
              </Text>
              <TouchableOpacity
                style={[styles.deletarButton, { borderColor: corDeletar }]}
                onPress={() => TrocarEstadoUser(item.id)}
              >
                <Text style={{ color: corDeletar }}>
                  {" "}
                  {item.ativo ? "Desativar" : "Ativar"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    justifyContent: "space-between",
  },
  criarContainer: {
    flex: 1,
    gap: 10,
  },
  listaContainer: {
    flex: 1,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 10,
  },
  toggleButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  criarButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  usuarioItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  deletarButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
