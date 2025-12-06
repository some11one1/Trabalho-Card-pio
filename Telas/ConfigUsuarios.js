import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Supabase";

export default function ConfigUsuarios() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

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
        () => {
          ListarUsuarios();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
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
    setUsername("");
    setSenha("");
    setIs_Admin(false);
  };

  const corDeletar = isModoEscuro ? "#FFFFFF" : tema.perigo;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tema.background,
          flexDirection: isTablet ? "row" : "column",
        },
      ]}
    >
      {/* ✅ Criar usuário */}
      <View style={[styles.card, isTablet && styles.cardTablet]}>
        <Text style={[styles.title, { color: tema.texto }]}>
          Criar Usuário
        </Text>

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

      {/* ✅ Lista */}
      <View style={[styles.card, isTablet && styles.cardTablet]}>
        <Text style={[styles.title, { color: tema.texto }]}>
          Lista de Usuários
        </Text>

        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.usuarioItem,
                { borderColor: tema.textoAtivo },
              ]}
            >
              <Text
                style={{ color: tema.texto, flex: 1, marginRight: 6 }}
                numberOfLines={1}
              >
                {item.username} •{" "}
                {item.is_admin ? "Admin" : "User"} •{" "}
                {item.ativo ? "Ativo" : "Desativado"}
              </Text>

              <TouchableOpacity
                style={[styles.deletarButton, { borderColor: corDeletar }]}
                onPress={() => TrocarEstadoUser(item.id)}
              >
                <Text style={{ color: corDeletar }}>
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
    padding: 16,
    gap: 12,
  },

  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },

  cardTablet: {
    marginHorizontal: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  toggleButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },

  criarButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },

  usuarioItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
  },

  deletarButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
