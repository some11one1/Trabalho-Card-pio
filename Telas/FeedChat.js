import React, { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useChat } from "../Context/ChatContext";
import { usarTheme } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";

export default function Chat() {
  const { mensagens, texto, setTexto, enviarMensagem } = useChat();
  const { tema } = usarTheme();
  const { user, carregando } = useContext(AuthContext);

  if (carregando) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: tema.background }}>
      <FlatList
        data={mensagens}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={{ color: tema.texto, fontWeight: "bold" }}>
              {item.usuario?.username ?? "Usuário"}
              {item.usuario?.is_admin === true && (
                <Text style={{ color: "gold" }}>     [Admin]</Text>
              )}
            </Text>
            <Text style={{ color: tema.texto }}>{item.conteudo}</Text>
          </View>
        )}
      />

      <View style={{ flexDirection: "row", padding: 10 }}>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Digite uma mensagem"
          placeholderTextColor={tema.texto}
          style={{
            flex: 1,
            backgroundColor: tema.cardBackground,
            color: tema.texto,
            padding: 10,
            borderRadius: 8,
          }}
        />

        <TouchableOpacity
          onPress={enviarMensagem}
          style={{
            backgroundColor: tema.textoAtivo,
            padding: 12,
            borderRadius: 8,
            marginLeft: 8,
          }}
        >
          <Text style={{ color: "#fff" }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
