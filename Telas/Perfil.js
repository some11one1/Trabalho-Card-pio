import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav_Menu from "../Componentes/nav_menu";
import { useAnuncio } from "../Context/AnuncioContext";

export default function Perfil() {
  const [modalGenero, setModalGenero] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [generoSelecionado, setGeneroSelecionado] = useState(null);

  const GeneroOpcoes = [
    "Homem",
    "Mulher",
    "Helicoptero de combate",
    "outro (Alien)",
    "RTX 5090",
    "Pascal",
    "Expo",
    "Máquina de combate",
    "Thanos",
    "Alface",
    "Carne bovina",
    "Abacaxi",
    "Thomas o Trem",
    "Jéssica",
    "escala 6x1",
    "Bengala ergonômica",
    "coxinha",
    "terror",
    "Emo",
    "Iphone 17",
    "Relevo",
    "Função Afim",
    "Progamador de Website",
    "Multimidia",
    "Senai",
    "Stalin",
    "To Be",
    "Complemento Nominal",
    "Movimento Uniforme",
    "Lindo",
    "Mr Beast",
    "Elon Musk",
    "Ronaldo",
    "Ronaldo",
    "Leonel Messi",
    "Clash Royale",
  ];

  const { chanceMostrarAnuncio } = useAnuncio();
  const {
    saldo,
    setSaldo,
    carregarSaldo,
    saldoBanco,
    setSaldoBanco,
    carregarSaldoBanco,
  } = useContext(WalletContext);
  const { tema } = usarTheme();

  useEffect(() => {
    const carregarGenero = async () => {
      try {
        const salvo = await AsyncStorage.getItem("@genero");
        if (salvo) setGeneroSelecionado(salvo);
      } catch (e) {
        console.log("Erro ao carregar genero:", e);
      }
    };
    carregarGenero();
  }, []);

  const selecionarGenero = async (genero) => {
    try {
      await AsyncStorage.setItem("@genero", genero);
      setGeneroSelecionado(genero);
      setModalGenero(false);
      alert(`Gênero selecionado: ${genero}`);
    } catch (e) {
      console.log("Erro ao salvar gênero:", e);
      alert("Erro ao salvar gênero!");
    }
  };

  const confirmarRecarga = async (valor) => {
    chanceMostrarAnuncio();
    if (saldoBanco >= valor) {
      const novoSaldo = saldo + valor;
      const novoSaldoBanco = saldoBanco - valor;
      setSaldo(novoSaldo);
      setSaldoBanco(novoSaldoBanco);
    } else {
      alert("Tá sem dinheiro, pobre");
    }
  };

  useEffect(() => {
    carregarSaldo();
    carregarSaldoBanco();
  }, []);

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
        <Text style={{ color: tema.texto, fontSize: 22, marginBottom: 10 }}>
          Perfil
        </Text>
        <Text style={{ color: tema.texto, marginBottom: 15 }}>
          Saldo: {saldo}
        </Text>

        <Text style={{ color: tema.texto, marginBottom: 5 }}>
          Gênero atual:{" "}
          <Text style={{ fontWeight: "bold" }}>
            {generoSelecionado || "Não definido"}
          </Text>
        </Text>

        <Button title="Recarregar" onPress={() => setModalVisivel(true)} />

        <TouchableOpacity
          onPress={() => setModalGenero(true)}
          style={{
            backgroundColor: "blue",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginTop: 15,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>
            Selecionar Gênero
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

        <Modal
          visible={modalGenero}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalGenero(false)}
        >
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: tema.background,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: tema.texto,
                fontSize: 22,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Selecione seu gênero
            </Text>

            <ScrollView contentContainerStyle={{ alignItems: "center" }}>
              {GeneroOpcoes.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => selecionarGenero(item)}
                  style={{
                    backgroundColor:
                      generoSelecionado === item ? "#6200ea" : "#f3f3f3",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    marginVertical: 5,
                    width: "90%",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: generoSelecionado === item ? "white" : "black",
                      fontSize: 16,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setModalGenero(false)}
                style={{
                  marginTop: 20,
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 8,
                  width: "60%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
