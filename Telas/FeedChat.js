import React, { useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useChat } from "../Context/ChatContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { usarTheme } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";

export default function Chat() {
  const { mensagens, texto, setTexto, enviarMensagem } = useChat();
  const { tema } = usarTheme();
  const { user, carregando } = useContext(AuthContext);

  const flatListRef = useRef(null);

  if (carregando) {
    return <Text>Carregando...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1,
        backgroundColor: tema.background,
       }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={40}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: tema.background,  }}>
      <FlatList
        ref={flatListRef}
        data={mensagens}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "flex-start",
            }}
          >
            <Image
              source={{
                uri:
                  item.usuario?.foto_url || "https://i.imgur.com/3I6eQpA.png",
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 10,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ color: tema.texto, fontWeight: "bold" }}>
                {item.usuario?.username ?? "Usuário"}
                {item.usuario?.is_admin === true && (
                  <Text style={{ color: "gold" }}> [Admin]</Text>
                )}
              </Text>
              <Text style={{ color: tema.texto }}>{item.conteudo}</Text>
            </View>
          </View>
        )}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
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
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
