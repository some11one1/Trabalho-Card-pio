import * as FileSystem from "expo-file-system";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Platform,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../Supabase";
import Nav_Menu from "../Componentes/nav_menu";
import { AuthContext } from "../Context/AuthContext";
import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
import { useAnuncio } from "../Context/AnuncioContext";
import { useTicket } from "../Context/TicketContext";

export default function Perfil() {
  const { chanceMostrarAnuncio } = useAnuncio();
  const [modalVisivel, setModalVisivel] = useState(false);
  const { width, height } = useWindowDimensions();

  const {
    saldo,
    setSaldo,
    carregarSaldo,
    saldoBanco,
    setSaldoBanco,
    carregarSaldoBanco,
  } = useContext(WalletContext);

  const { user, atualizarUsuario } = useContext(AuthContext);
  const { ticket } = useTicket();
  const { tema } = usarTheme();

  useEffect(() => {
    carregarSaldo();
    carregarSaldoBanco();
  }, []);

  const upload = async (file) => {
    try {
      let fileData;

      if (Platform.OS !== "web") {
        const base64 = file.base64;
        if (!base64) {
          console.log("Erro: base64 vazio");
          return;
        }
        const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        fileData = buffer;
      } else {
        fileData = file;
      }

      const nome = `foto_${user.id}.jpg`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(nome, fileData, {
          upsert: true,
          contentType: "image/jpeg",
          cacheControl: "0",
        });

      if (error) {
        console.log("Erro no upload:", error);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(nome);

      const url = urlData.publicUrl + `?nocache=${Date.now()}`;
      console.log("URL FOTO:", url);

      await supabase
        .from("usuarios")
        .update({ foto_url: url })
        .eq("id", user.id);
      atualizarUsuario({ foto_url: url });
    } catch (err) {
      console.log("Erro geral no upload:", err);
    }
  };
  const trocarFoto = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Precisa de permissão para acessar as fotos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: true,
      });

      if (!result.assets || result.assets.length === 0) return;

      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;

      await upload({ base64 });
    } else {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;
        await upload(arquivo);
      };
      input.click();
    }
  };

  const confirmarRecarga = async (valor) => {
    chanceMostrarAnuncio();

    if (saldoBanco >= valor) {
      const novoSaldo = saldo + valor;
      const novoSaldoBanco = saldoBanco - valor;

      setSaldo(novoSaldo);
      setSaldoBanco(novoSaldoBanco);

      const { error } = await supabase
        .from("usuarios")
        .update({ saldo: novoSaldo, saldoBanco: novoSaldoBanco })
        .eq("id", user.id);

      if (error) {
        console.log("Erro ao atualizar saldo");
        setSaldo(saldo);
        setSaldoBanco(saldoBanco);
      }
    } else {
      alert("Saldo insuficiente");
      console.log(saldoBanco);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: tema.background,
      }}
    >
      <Nav_Menu />

      <View style={{ flex: 0 }}>
        <View
          style={{
            width: width * 1,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}>
          <TouchableOpacity onPress={trocarFoto} style={{ width: width * 0.4, alignItems: "center", padding: 10 }}>
            <Image
              source={{
                uri:
                  user?.foto_url ||
                  "https://i.pinimg.com/474x/73/14/cc/7314cc1a88bf3cdc48347ab186e12e81.jpg",
              }}
              style={{
                width: width * 0.35,
                height: width * 0.35,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: tema.textoAtivo,
                marginRight: width * 0.03,
              }}
            />
          </TouchableOpacity>

          <View>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ color: tema.texto, fontSize: width * 0.05, fontWeight: "bold", maxWidth: width * 0.5 }}
            >
              {
                user.username == 'Orelliara' ? '✩.⋆. 𝒪𝑟𝑒𝑙𝑙𝑖𝑎𝑟𝑎.˳⁺୨୧˚⋆' : `Olá, ${user.username}`
              }
            </Text>

            {user?.is_admin ? (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ color: tema.textoAtivo, fontSize: width * 0.05, fontWeight: "bold", maxWidth: width * 0.5 }}>
                Administrador
              </Text>
            ) : (
              <>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ color: tema.textoAtivo, fontSize: width * 0.05, fontWeight: "bold", maxWidth: width * 0.5 }}>
                  Estudante
                </Text>
                <Text
                  umberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ color: tema.texto, fontSize: width * 0.05, fontWeight: "bold", maxWidth: width * 0.5 }}>
                  Saldo: R$ {saldo}
                </Text>

                <Text
                  umberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ color: tema.texto, fontSize: width * 0.05, maxWidth: width * 0.5 }}>
                  {ticket ? "Ticket Disponível" : "Ticket Indisponível"}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setModalVisivel(true)}
        style={{
          position: "absolute",
          bottom: height * 0.15,
          alignSelf: "center",
          backgroundColor: tema.background,
          paddingVertical: width * 0.03,
          paddingHorizontal: width * 0.1,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: tema.texto,
        }}
      >
        <Text
          umberOfLines={1}
          adjustsFontSizeToFit
          style={{ fontSize: width * 0.05, fontWeight: "600", color: tema.texto, maxWidth: width * 0.5 }}>
          Recarregar
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: width * 0.8,
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
            <Text
              umberOfLines={1}
              adjustsFontSizeToFit
              style={{ fontSize: width * 0.05, marginBottom: 10, color: tema.texto, fontWeight: "bold", maxWidth: width * 0.6 }}>
              Recarregar Saldo
            </Text>

            <View
              style={{
                width: width * 0.6,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {["10", "25", "50", "100"].map((v) => (
                <View key={v} style={{ margin: 5, width: width * 0.25 }}>
                  <TouchableOpacity
                    onPress={() => confirmarRecarga(Number(v))}
                    style={{
                      backgroundColor: tema.cardBackground,
                      borderColor: tema.textoAtivo,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingVertical: width * 0.03,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      umberOfLines={1}
                      adjustsFontSizeToFit
                      style={{ fontSize: width * 0.05, color: tema.texto, fontWeight: "600", maxWidth: width * 0.2 }}>
                      R$ {v}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 15 }}>
              <Button
                title="Fechar"
                color="red"
                onPress={() => setModalVisivel(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}