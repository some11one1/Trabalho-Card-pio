import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useWindowDimensions } from "react-native";
import { AuthContext } from "../Context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../Supabase";
import { usarTheme } from "../Context/ThemeContext";

import { InputModerno } from "../Componentes/style/input";
export default function Login() {

  // documentação do diego se achar que é IA problema seu, achei melhor comentar pq vai ficar confuso

  {/*Isso é apenas para pegar o tamanho das imagens*/ }
  const { width, height } = useWindowDimensions();

  const { loginUser } = useContext(AuthContext);
  const [username, setUsername] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const { tema, TrocarTheme, isModoEscuro } = usarTheme();
  const [loading, setLoading] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);


  const [iconModal, setIconModal] = useState("info");
  const [avisoModal, setAvisoModal] = useState("");

  const spinAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [loading]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleLogin = async () => {
    if (!username.trim() || !senha.trim()) {
      setAvisoModal("Preencha usuário e senha");
      setIconModal("alert");
      setModalVisivel(true);
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(username.trim(), senha);

      if (result?.success) {
        setModalVisivel(true);
        setTimeout(() => {
          navigation.replace("AppTabs", { screen: "Home" });
        }, 500);
      } else {
        setAvisoModal(result?.error || "Erro ao realizar login.");
        setIconModal("alert");
        setModalVisivel(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setAvisoModal("Erro inesperado ao tentar logar.");
      setIconModal("alert");
      setModalVisivel(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: tema.background,
    }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: "100%", padding: width * 0.03 }}>
            <TouchableOpacity
              style={{
                width: width * 0.12,
                marginLeft: "auto",
                alignItems: "center",
              }}
              onPress={TrocarTheme}
            >
              <Feather
                name={isModoEscuro ? "moon" : "sun"}
                size={width * 0.1}
                color={tema.texto}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={require("../assets/logo.png")}
            style={{
              width: width * 0.2,
              height: height * 0.08,
              resizeMode: "contain",
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: tema.texto,
              fontWeight: "bold",
              fontSize: 32,
              marginBottom: "10%",
            }}
          >
            FEED
            <Text style={{ color: "#2D7BFF" }}>HUB</Text>
          </Text>
          <View style={{ width: "90%", marginTop: height * 0.03 }}>
            <InputModerno
              value={username}
              onChangeText={setUsername}
              placeholder="Seu username"
              />
            <InputModerno
              value={senha}
              onChangeText={setSenha}
              placeholder="Sua senha"
              secure
            />


          </View>
          <TouchableOpacity 
            style={[styles.button_send, loading && { opacity: 0.6 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Feather name="loader" color="#FFF" size={24} />
              </Animated.View>
            ) : (
              <Text style={styles.text_white}>Entrar</Text>
            )}
          </TouchableOpacity>



          <Modal
            transparent={true}
            animationType="fade"
            visible={modalVisivel}
            onRequestClose={() => setModalVisivel(false)}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setModalVisivel(false)}
            >
              <View
                style={{
                  width: 250,
                  backgroundColor: tema.background,
                  borderRadius: 15,
                  padding: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 5,
                  borderWidth: 2,
                  borderColor: tema.textoAtivo
                }}
              >
                <Feather name={iconModal} color={tema.iconEstoque} size={34} />
                <Text style={{ fontSize: 18, marginBottom: 10, color: tema.texto, fontWeight: "bold" }}>
                  {avisoModal}
                </Text>
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  inputname: {
    backgroundColor: "#6e6e6eff",
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    color: "#ffffffff",
    marginBottom: 10,
    outlineWidth: 0,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6e6e6eff",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 5,
    color: "#ffffffff",
    outlineWidth: 0,
  },
  iconButton: {
    padding: 10,
  },

  button_send: {
    width: "20%",
    height: 40,
    backgroundColor: "#067EC9",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  text_white: {
    fontWeight: "bold",
    color: "white",
  },
});
