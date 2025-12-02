import React, { useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useChat } from "../Context/ChatContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { usarTheme } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";

import Rainbow from "../Componentes/Rainbow";
import RainbowHighlight from "../Componentes/RainbowHighlight";
import { FontAwesome5 } from "@expo/vector-icons";

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
      style={{ flex: 1, backgroundColor: tema.background }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={40}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: tema.background }}>
        <FlatList
          ref={flatListRef}
          data={mensagens}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => {
            const isOwner = item.usuario?.id === 15;

const MessageContent = (
  <View
    style={{
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: 10, // espaço vertical entre mensagens
      paddingHorizontal: 12, // espaço horizontal dentro da mensagem
      marginBottom: 6, // separação entre mensagens
      backgroundColor: isOwner ? tema.cardBackground : "transparent",
      borderRadius: 8,
    }}
  >
    <Image
      source={{
        uri:
          item.usuario?.foto_url ||
          "https://i.pinimg.com/474x/73/14/cc/7314cc1a88bf3cdc48347ab186e12e81.jpg",
      }}
      style={{
        width: 48, // aumentei o tamanho do avatar
        height: 48,
        borderRadius: 24,
        marginRight: 12, // distância entre avatar e conteúdo
      }}
    />

    <View style={{ flex: 1 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
      >
        <Text
          style={{
            fontWeight: isOwner ? "bold" : "normal",
            color: tema.texto,
            fontSize: 16, // tamanho maior do nome
          }}
        >
          {item.usuario?.username}
        </Text>

        {isOwner && (
          <Rainbow style={{ marginLeft: 8, fontWeight: "bold", fontSize: 14 }}>
            [<FontAwesome5 name="crown" size={14} /> Owner]
          </Rainbow>
        )}
      </View>

      <Text style={{ color: tema.texto, fontSize: 15, lineHeight: 20 }}>
        {item.conteudo}
      </Text>
    </View>
  </View>
);

            // Se for owner, aplica highlight; senão, renderiza normal
            return isOwner ? (
              <RainbowHighlight>{MessageContent}</RainbowHighlight>
            ) : (
              MessageContent
            );
          }}
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
