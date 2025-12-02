import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  Image,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
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

  const corRecarregar = tema.textoAtivo;

  useEffect(() => {
    carregarSaldo();
    carregarSaldoBanco();
  }, []);

  // upload compatível web / native (converte URI para blob no mobile)
  const upload = async (fileOrBlob) => {
    try {
      const nome = `foto_${user.id}.jpg`;
      let uploadData = fileOrBlob;

      // se veio um objeto com uri (expo native), converte em blob
      if (fileOrBlob && fileOrBlob.uri && Platform.OS !== "web") {
        const resp = await fetch(fileOrBlob.uri);
        uploadData = await resp.blob();
      }

      // no web, fileOrBlob pode ser File diretamente
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(nome, uploadData, {
          upsert: true,
          contentType: "image/jpeg",
          cacheControl: "0",
        });

      if (error) {
        console.log("Erro no upload:", error);
        return;
      }
      if (error) {
        console.log("Erro no upload:", error);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(nome);
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(nome);

      const url = urlData.publicUrl + `?nocache=${Date.now()}`;
      console.log("URL FOTO:", url);
      const url = urlData.publicUrl + `?nocache=${Date.now()}`;
      console.log("URL FOTO:", url);

      // salva no banco
      await supabase.from("usuarios").update({ foto_url: url }).eq("id", user.id);
      atualizarUsuario({ foto_url: url });
    } catch (e) {
      console.log("Erro no processo de upload:", e);
    }
  };

  const trocarFoto = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Precisa de permissão para acessar as fotos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.assets || result.assets.length === 0) return;
      const uri = result.assets[0].uri;
      const file = { uri, name: `foto_${user.id}.jpg`, type: "image/jpeg" };
      await upload(file);
    } else {
      // web
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
    await chanceMostrarAnuncio();
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
        // rollbacks simples
        await carregarSaldo();
        await carregarSaldoBanco();
      } else {
        setModalVisivel(false);
      }
    } else {
      alert("Saldo bancário insuficiente.");
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: tema.background }]}>
      <Nav_Menu />

      <View style={styles.container}>
        <View style={styles.profileRow}>
          <TouchableOpacity onPress={trocarFoto} style={styles.avatarWrapper}>
            <Image
              source={{ uri: user?.foto_url || "https://i.imgur.com/3I6eQpA.png" }}
              style={[styles.avatar, { borderColor: tema.textoAtivo }]}
            />
          </TouchableOpacity>

          <View style={styles.info}>
            <Text style={[styles.title, { color: tema.texto }]}>
              Olá, {user?.username ?? "usuário"}
            </Text>

            <Text style={[styles.saldoText, { color: tema.texto }]}>
              Saldo: R$ {Number(saldo || 0).toFixed(2).replace(".", ",")}
            </Text>

            <Text style={{ color: tema.texto, fontSize: 18 }}>
              {ticket ? "Ticket disponível" : "Ticket indisponível"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setModalVisivel(true)}
        style={[
          styles.recarregarBtn,
          { backgroundColor: tema.cardBackground, borderColor: corRecarregar },
        ]}
      >
        <Text style={{ color: corRecarregar, fontSize: 18, fontWeight: "600" }}>
          Recarregar
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisivel} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Recarregar Saldo</Text>

            <View style={styles.modalButtons}>
              {["10", "25", "50", "100"].map((v) => (
                <View key={v} style={{ margin: 6 }}>
                  <Button title={`R$ ${v}`} onPress={() => confirmarRecarga(Number(v))} />
                </View>
              ))}
            </View>

            <View style={{ marginTop: 15 }}>
              <Button title="Fechar" color="red" onPress={() => setModalVisivel(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center" },
  container: { flex: 1, width: "100%", padding: 20, alignItems: "center" },
  profileRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 8,
  },
  avatarWrapper: { marginRight: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2 },
  info: { flex: 1 },
  title: { fontSize: 34, fontWeight: "700" },
  saldoText: { fontSize: 20, marginTop: 4 },
  recarregarBtn: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 280,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    elevation: 6,
  },
  modalTitle: { fontSize: 18, marginBottom: 10 },
  modalButtons: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
});