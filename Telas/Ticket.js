import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Dimensions,
  Button,
  Alert,
  useWindowDimensions
} from "react-native";
import { AuthContext } from "../Context/AuthContext";
import { useAnuncio } from "../Context/AnuncioContext";
import React, { useContext, useState, useEffect } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { ProdutosContext } from "../Context/produtoContext";
import Icon from "react-native-vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav_Menu from "../Componentes/nav_menu";
import { useTicket } from "../Context/TicketContext";

import { useHistorico } from "../Context/HistoricoContext";


export default function Ticket({ navigation, route }) {

  const { user } = useContext(AuthContext);
  const [produtoSelect, setProdutoSelect] = useState(null);
  const { ColocarNoHistorico } = useHistorico();
  const [modalVisivel, setModalVisivel] = useState(false);
  const { ticket, usarTicket } = useTicket();
  const { chanceMostrarAnuncio } = useAnuncio();
  const { produtos, listarProdutos } = useContext(ProdutosContext);
  const { tema } = usarTheme();

  const { width, height } = useWindowDimensions();

  const numColumns = width < 380 ? 2 : 3;
  const margin = width * 0.02;
  const itemWidth = width / numColumns - margin * 2;

  useEffect(() => {
    listarProdutos();
  }, [ticket]);

  const renderProduto = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.produtoItem,
        {
          backgroundColor: tema.cardBackground,
          width: itemWidth,
          margin,
          borderColor: tema.borda,
          padding: width * 0.02,
          height: height * 0.25,
        },
      ]}
      onPress={() => {
        ticket ? (
          setProdutoSelect(item),
          setModalVisivel(true)
        ) : (
          Alert.alert("Ticket indisponivel", "voce ja usou seu ticket hoje")
        );

      }}
    >
      <Image
        style={[
          styles.produtoImage,
          {
            height: height * 0.10,
            borderRadius: width * 0.02,
          },
        ]}
        source={{ uri: item.img }}
        resizeMode="contain"
      />

      <View style={styles.produtoInfo}>
        <Text
          numberOfLines={2}
          style={[
            styles.produtoNome,
            {
              color: tema.texto,
              fontSize: width * 0.032,
            },
          ]}
        >
          {item.Nome}
        </Text>
        {ticket ? (
          <Text
            style={[
              styles.produtoValor,
              {
                color: tema.textoAtivo,
                fontSize: width * 0.035,
              },
            ]}>
            Usar Ticket
          </Text>
        ) : (
          <Text
            style={[
              styles.produtoValor,
              {
                color: tema.textoAtivo,
                fontSize: width * 0.035,
              },
            ]}>
            Ticket indisponivel
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
  const produtosFiltrados = produtos.filter(
    (item) => item.categorias === "comida"
  );
  return (
    <SafeAreaView
      style={[styles.containerPrincipal, { backgroundColor: tema.background }]}
    >
      <Nav_Menu />

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
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ fontSize: width * 0.06, marginBottom: 10, color: tema.texto, fontWeight: "bold", maxWidth: width * 0.8 }}>
              Usar Seu ticket?
            </Text>

            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: tema.cardBackground,
                  borderColor: tema.textoAtivo,
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingVertical: width * 0.03,
                  alignItems: "center",
                  marginBottom: height * 0.03
                }}
                onPress={async () => {
                  ColocarNoHistorico(produtoSelect.id, produtoSelect.Nome);
                  setModalVisivel(false);
                  usarTicket(user.id);


                }}
              >
                <Text
                  umberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ fontSize: width * 0.05, color: tema.texto, fontWeight: "600", maxWidth: width * 0.2, }}>
                  Sim
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: tema.cardBackground,
                  borderColor: tema.textoAtivo,
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingVertical: width * 0.03,
                  alignItems: "center",
                }}
                onPress={() => setModalVisivel(false)}
              >
                <Text
                  umberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ fontSize: width * 0.05, color: tema.texto, fontWeight: "600", maxWidth: width * 0.2, }}>
                  Não
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduto}
        contentContainerStyle={styles.listaContainer}
        numColumns={numColumns}
        ListEmptyComponent={() => (
          <View style={styles.vazioContainer}>
            <Text style={{ color: tema.texto }}>
              Nenhum produto encontrado.
            </Text>
            <TouchableOpacity onPress={listarProdutos}>
              <Text style={{ color: tema.textoAtivo, marginTop: 10 }}>
                Tentar Recarregar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
  },

  listaContainer: {
    alignItems: "center",
    paddingVertical: 10,
    flexGrow: 1,
  },

  produtoItem: {
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
  },

  produtoImage: {
    width: "90%",
    marginBottom: 6,
  },

  produtoInfo: {
    width: "100%",
    paddingHorizontal: 4,
    alignItems: "center",
  },

  produtoNome: {
    fontWeight: "bold",
    textAlign: "center",
    height: 35,
  },

  produtoValor: {
    fontWeight: "700",
    marginTop: 4,
  },

  vazioContainer: {
    alignItems: "center",
    padding: 20,
  },
});
