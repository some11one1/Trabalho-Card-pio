import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { usarTheme } from "../Context/ThemeContext";
const anuncios = [
  {
    texto: "Contrata-se Jovem Programador",
    imagem: require("../assets/professor.jpg"),
    botoes: [
      {
        label: "Contrate agora!",
        acao: () => console.log("Ir para página de vaga"),
      },
    ],
  },
  {
    texto: "Faça Exercício e compartilhe seus resultados no Reviva!",
    imagem: require("../assets/Reviva.png"),
    botoes: [
      { label: "Baixar App", acao: () => console.log("Ir para Reviva") },
      {
        label: "Saiba mais",
        acao: () => console.log("Saiba mais sobre Reviva"),
      },
    ],
  },
  {
    texto: "Aposte na SilkBet e Ganhe muito dinheiro sem riscos!",
    imagem: require("../assets/SilkBet.png"),
    botoes: [
      { label: "APOSTE AGORA!", acao: () => console.log("Ir para SilkBet") },
    ],
  },
];

export default function Anuncio({ visivel, onFechar }) {
  const { tema } = usarTheme()
  const [anuncio, setAnuncio] = useState(null);
  const [botaoLiberado, setBotaoLiberado] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visivel) {
      const aleatorio = anuncios[Math.floor(Math.random() * anuncios.length)];
      setAnuncio(aleatorio);
      setBotaoLiberado(false);

      // Liberar botão fechar depois de 3 segundos
      const timer = setTimeout(() => setBotaoLiberado(true), 3000);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      return () => clearTimeout(timer);
    } else {
      setAnuncio(null);
      fadeAnim.setValue(0);
    }
  }, [visivel]);

  if (!anuncio) return null;

  return (
    <Modal visible={visivel} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { opacity: fadeAnim, backgroundColor: tema.background }]}>
          {/* Botão fechar no canto */}
          <TouchableOpacity
            onPress={botaoLiberado ? onFechar : null}
            disabled={!botaoLiberado}
            style={styles.botaoFechar}
          >
            <Text
              style={[styles.txtFechar, {color: tema.texto}, { opacity: botaoLiberado ? 1 : 0.4 }]}
            >
              ✖
            </Text>
          </TouchableOpacity>

          {/* Imagem e texto */}
          <Image source={anuncio.imagem} style={styles.imagem} />
          <Text style={[styles.texto, {color: tema.texto }]} >{anuncio.texto}</Text>

          {/* Renderizar botões personalizados */}
          <View style={styles.areaBotoes}>
            {anuncio.botoes?.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={styles.botaoAcao}
                onPress={btn.acao}
              >
                <Text style={styles.txtBotao}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "99%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  imagem: {
    width: 300,
    height: 400,
    borderRadius: 16,
    marginBottom: 15,
  },
  texto: {
    fontSize: 23,
    textAlign: "center",
    fontWeight: "600",
    color: "#222",
    marginBottom: 15,
  },
  areaBotoes: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  botaoAcao: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  txtBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  botaoFechar: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  txtFechar: {
    fontSize: 18,
    color: "#444",
  },
});
