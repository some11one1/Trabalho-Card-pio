import React, { useContext, useRef, useEffect, useState, memo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useChat } from "../Context/ChatContext";
import { usarTheme } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";

import Rainbow from "../Componentes/Rainbow";
import RainbowHighlight from "../Componentes/RainbowHighlight";
import { FontAwesome5 } from "@expo/vector-icons";

/* ========= ITEM ========= */
const MessageItem = memo(({ item, tema }) => {
  const isOwner = item.usuario?.id === 15;
  const isAdmin = item.usuario?.is_admin === true;

  const Content = (
    <View
      style={{
        flexDirection: "row",
        padding: 10,
        marginBottom: 8,
        borderRadius: 10,
        backgroundColor: isOwner ? tema.cardBackground : "transparent",
      }}
    >
      <Image
        source={{
          uri:
            item.usuario?.foto_url ||
            "https://i.pinimg.com/474x/73/14/cc/7314cc1a88bf3cdc48347ab186e12e81.jpg",
        }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
      />

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: tema.texto }}>
            {item.usuario?.username}
          </Text>

          {isOwner && (
            <Rainbow style={{ marginLeft: 6, fontSize: 12 }}>
              [<FontAwesome5 name="crown" size={12} /> Owner]
            </Rainbow>
          )}

          {!isOwner && isAdmin && (
            <Rainbow style={{ marginLeft: 6, fontSize: 12 }}>
              [<FontAwesome5 name="user-shield" size={12} /> Admin]
            </Rainbow>
          )}
        </View>

        <Text style={{ marginTop: 4, color: tema.texto }}>
          {item.conteudo}
        </Text>
      </View>
    </View>
  );

  return isOwner ? <RainbowHighlight>{Content}</RainbowHighlight> : Content;
});

export default function Chat() {
  const { mensagens, texto, setTexto, enviarMensagem } = useChat();
  const { tema } = usarTheme();
  const { carregando } = useContext(AuthContext);

  const flatListRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [mensagens.length]);

  if (carregando) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: tema.background,
        paddingBottom: keyboardHeight,
      }}
    >
      <FlatList
        ref={flatListRef}
        data={mensagens}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MessageItem item={item} tema={tema} />
        )}
        contentContainerStyle={{ padding: 10 }}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
      />

      <View
        style={{
          flexDirection: "row",
          padding: 10,
          backgroundColor: tema.background,
          borderTopWidth: 1,
          borderColor: tema.cardBackground,
        }}
      >
        <TextInput
          value={texto}
          onChangeText={setTexto}
          multiline
          placeholder="Digite uma mensagem..."
          placeholderTextColor={`${tema.texto}99`}
          style={{
            flex: 1,
            backgroundColor: tema.cardBackground,
            color: tema.texto,
            padding: 10,
            borderRadius: 10,
            maxHeight: 120,
          }}
        />

        <TouchableOpacity
          onPress={enviarMensagem}
          disabled={!texto.trim()}
          style={{
            marginLeft: 8,
            backgroundColor: tema.textoAtivo,
            paddingHorizontal: 16,
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
