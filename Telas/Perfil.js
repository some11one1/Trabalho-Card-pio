import {
  View,
  Text,
  Button,
  TextInput,
  Modal,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system";

import * as ImagePicker from "expo-image-picker";
import { fotoManager } from "../Componentes/carregarFoto";
import React, { useContext, useEffect, useState } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../Supabase";
import Nav_Menu from "../Componentes/nav_menu";
import { AuthContext } from "../Context/AuthContext";
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
  const upload = async (fileBlob) => {
    const nome = `foto_${user.id}.jpg`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(nome, fileBlob, {
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

    let url = urlData.publicUrl + `?nocache=${Date.now()}`;

    console.log("URL FOTO:", url);

    // salva no banco
    await supabase.from("usuarios").update({ foto_url: url }).eq("id", user.id);
    atualizarUsuario({ foto_url: url });
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // <-- aqui
        quality: 1,
      });

      console.log("Resultado picker:", result);

      if (!result.assets || result.assets.length === 0) return;

      const uri = result.assets[0].uri;

      // Expo recomenda usar FileSystem para ler o arquivo
      const file = {
        uri,
        name: `foto_${user.id}.jpg`,
        type: "image/jpeg",
      };

      await upload(file);
    } else {
      // Web
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

  const { ticket } = useTicket();
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
        console.log("erro ao atualizar saldo");
        setSaldo(saldo);
        setSaldoBanco(saldoBanco);
      }
    } else {
      alert("ta sem dinheiro pobre");
      console.log(saldoBanco);
    }
  };
  useEffect(() => {
    carregarSaldo();
    carregarSaldoBanco();
  }, []);
  const { tema } = usarTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: tema.background,
      }}
    >
      <Nav_Menu />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                uri: user?.foto_url || "https://i.imgur.com/3I6eQpA.png",
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: tema.textoAtivo,
                marginRight: 20, // espaço entre a imagem e o texto
              }}
            />
          </TouchableOpacity>

          <View>
            <Text
              style={{ color: tema.texto, fontSize: 34, fontWeight: "bold" }}
            >
              Olá, {user.username}
            </Text>
            <Text style={{ color: tema.texto, fontSize: 25 }}>
              saldo: R$:{saldo}
            </Text>
            {ticket ? (
              <Text style={{ color: tema.texto, fontSize: 25 }}>
                Ticket Disponivel
              </Text>
            ) : (
              <Text style={{ color: tema.texto, fontSize: 25 }}>
                Ticket indisponivel
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisivel(!modalVisivel)}
          style={{
            position: "absolute",
            bottom: 30,
            backgroundColor: tema.cardBackground,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderWidth: 2,
            borderRadius: 10,
            borderColor: tema.textoAtivo,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: tema.texto, fontSize: 22 }}>Recarregar</Text>
        </TouchableOpacity>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
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
                        onPress={() => confirmarRecarga(Number(v))} //converte em numero
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
        </View>
      </View>
    </SafeAreaView>
  );
}
