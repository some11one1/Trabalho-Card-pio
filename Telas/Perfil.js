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
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity onPress={trocarFoto}>
            <Image
              source={{
                uri:
                  user?.foto_url ||
                  "https://i.pinimg.com/474x/73/14/cc/7314cc1a88bf3cdc48347ab186e12e81.jpg",
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: tema.textoAtivo,
                marginRight: 20,
              }}
            />
          </TouchableOpacity>

          <View>
            <Text
              style={{ color: tema.texto, fontSize: 34, fontWeight: "bold" }}
            >
              Olá, {user.username}
            </Text>

            {user?.is_admin ? (
              <Text style={{ color: "tema.texto", fontSize: 25 }}>
                Administrador
              </Text>
            ) : (
              <>
                <Text style={{ color: tema.texto, fontSize: 25 }}>
                  Saldo: R$ {saldo}
                </Text>

                <Text style={{ color: tema.texto, fontSize: 25 }}>
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
          bottom: 60,
          alignSelf: "center",
          backgroundColor: tema.cardBackground,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: tema.texto,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "600", color: tema.texto }}>
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
              width: 250,
              backgroundColor: "white",
              borderRadius: 15,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Recarregar Saldo
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {["10", "25", "50", "100"].map((v) => (
                <View key={v} style={{ margin: 5 }}>
                  <Button
                    title={`R$${v}`}
                    onPress={() => confirmarRecarga(Number(v))}
                  />
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