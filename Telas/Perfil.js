import {
  View,
  Text,
  Modal,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
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
  const { tema, isModoEscuro } = usarTheme();
  const { ticket } = useTicket();

  // --- CORES TEMÁTICAS ---
  const corRecarregar = isModoEscuro ? "#FFFFFF" : tema.textoAtivo;
  const corFechar = isModoEscuro ? "#FFFFFF" : tema.perigo;

  const upload = async (fileBlob) => {
    const nome = `foto_${user.id}.jpg`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(nome, fileBlob, {
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) return;

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(nome);

    let url = urlData.publicUrl + `?nocache=${Date.now()}`;

    await supabase.from("usuarios").update({ foto_url: url }).eq("id", user.id);
    atualizarUsuario({ foto_url: url });
  };

  const uriParaBlob = async (uri) => {
    const file = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
    return Buffer.from(file, "base64");
  };

  const trocarFoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;

      const file = await uriParaBlob(result.assets[0].uri);
      await upload(file);
    } catch (error) {}
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
        setSaldo(saldo);
        setSaldoBanco(saldoBanco);
      }
    } else {
      alert("Saldo insuficiente.");
    }
  };

  useEffect(() => {
    carregarSaldo();
    carregarSaldoBanco();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.background }}>
      
      {/* -------------- CABEÇALHO FIXO -------------- */}
      <Nav_Menu />

      {/* -------------- CONTEÚDO NO TOPO -------------- */}
      <View style={{ flex: 1, padding: 20, justifyContent: "flex-start" }}>
        
        {/* FOTO E INFORMAÇÕES */}
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
                marginRight: 20,
              }}
            />
          </TouchableOpacity>

          <View>
            <Text style={{ color: tema.texto, fontSize: 34, fontWeight: "bold" }}>
              Olá, {user.username}
            </Text>
            <Text style={{ color: tema.texto, fontSize: 25 }}>
              Saldo: R$ {saldo}
            </Text>
            <Text style={{ color: tema.texto, fontSize: 25 }}>
              {ticket ? "Ticket disponível" : "Ticket indisponível"}
            </Text>
          </View>
        </View>

      </View>

      {/* -------------- BOTÃO RECARREGAR FIXO EMBAIXO -------------- */}
      <TouchableOpacity
        onPress={() => setModalVisivel(true)}
        style={{
          position: "absolute",
          bottom: 30,
          alignSelf: "center",
          backgroundColor: tema.cardBackground,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: corRecarregar,
        }}
      >
        <Text
          style={{ fontSize: 22, fontWeight: "600", color: corRecarregar }}
        >
          Recarregar
        </Text>
      </TouchableOpacity>

      {/* -------------- MODAL -------------- */}
      <Modal
        transparent
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
              width: 260,
              backgroundColor: tema.cardBackground,
              borderRadius: 15,
              padding: 20,
              alignItems: "center",
              borderColor: tema.textoAtivo,
              borderWidth: 2,
            }}
          >
            <Text style={{ color: tema.texto, fontSize: 20, marginBottom: 10 }}>
              Recarregar saldo
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {["10", "25", "50", "100"].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={{
                    borderWidth: 1,
                    borderColor: tema.texto,
                    padding: 8,
                    borderRadius: 7,
                    margin: 4,
                  }}
                  onPress={() => confirmarRecarga(Number(v))}
                >
                  <Text style={{ color: tema.texto, fontSize: 18 }}>
                    R${v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* BOTÃO FECHAR */}
            <TouchableOpacity
              style={{
                marginTop: 15,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                borderColor: corFechar,
                borderWidth: 2,
              }}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={{ fontSize: 18, color: corFechar }}>
                Fechar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
