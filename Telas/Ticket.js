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
const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const margin = 8;

const itemWidth = screenWidth / numColumns - margin * 2;

export default function Ticket({ navigation, route }) {
  
const { user } = useContext(AuthContext);
  const [produtoSelect, setProdutoSelect] = useState(null);
  const { ColocarNoHistorico } = useHistorico();
  const [modalVisivel, setModalVisivel] = useState(false);
const { ticket, usarTicket } = useTicket();
  const { chanceMostrarAnuncio } = useAnuncio();
  const { produtos, listarProdutos } = useContext(ProdutosContext);
  const { tema } = usarTheme();

  useEffect(() => {
    listarProdutos();
  }, []);

  const renderProduto = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.produtoItem,
        {
          backgroundColor: tema.cardBackground,
          margin: margin,
          width: itemWidth,
          borderColor: tema.borda,
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
        style={styles.produtoImage}
        source={{ uri: item.img }}
        resizeMode="cover"
      />

      <View style={styles.produtoInfo}>
        <Text
          numberOfLines={2}
          style={[styles.produtoNome, { color: tema.texto }]}
        >
          {item.Nome}
        </Text>
        {ticket ? (
          <Text style={[styles.produtoValor, { color: tema.textoAtivo }]}>
            Usar Ticket
          </Text>
        ) : (
          <Text style={[styles.produtoValor, { color: tema.textoAtivo }]}>
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
        onRequestClose={() =>  setModalVisivel(false)}
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
              Usar Seu ticket?
            </Text>

            <View style={{ marginTop: 15 }}>
              <Button
                title="sim"
                onPress={async () => {
                  ColocarNoHistorico(produtoSelect.id, produtoSelect.Nome);
                  setModalVisivel(false);
                  usarTicket(user.id);
                  

                }}
              />
              <Button
                title="não"
                color="red"
                onPress={() => setModalVisivel(false)}
              />
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
    paddingHorizontal: margin,
    alignItems: "center",
    flexGrow: 1,
  },

  produtoItem: {
    height: 180,

    borderRadius: 8,
    borderWidth: 1,

    padding: 5,
    alignItems: "center",
  },
  produtoImage: {
    width: "90%",
    height: 80,
    borderRadius: 6,
    marginBottom: 5,
  },

  produtoInfo: {
    width: "100%",
    paddingHorizontal: 3,
    paddingBottom: 5,
    justifyContent: "flex-start",
  },
  produtoNome: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    height: 30,
  },
  produtoValor: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  vazioContainer: {
    alignItems: "center",
    padding: 20,
  },
});
