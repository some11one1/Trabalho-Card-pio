import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Entypo";
import { useAnuncio } from "../Context/AnuncioContext"
import { useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useContext, useState, useEffect } from "react";

import { WalletContext } from "../Context/WalletContext";
import { AuthContext } from "../Context/AuthContext";
import { CarrinhoContext } from "../Context/CarrinhoContext";
import { useHistorico } from "../Context/HistoricoContext";
import { usarTheme } from "../Context/ThemeContext";
import { useWindowDimensions } from "react-native";

import { supabase } from "../Supabase";

export default function CardProduto({ navigation }) {

  const { width, height } = useWindowDimensions();

  const { chanceMostrarAnuncio } = useAnuncio()

  const route = useRoute();
  const { carrinho, AdicionarAoCarrinho } = useContext(CarrinhoContext);
  const { tema } = usarTheme();

  // Estado para armazenar os parâmetros do produto
  const [produto, setProduto] = useState({
    produtoId: null,
    produtoPreco: 0,
    produtoNome: "",
    produtoImg: "",
    produtoEstoque: 0,
  });

  // useEffect para capturar os parâmetros da rota

  useEffect(() => {
    if (route.params) {
      const { produtoId, produtoPreco, produtoNome, produtoImg, produtoEstoque } = route.params;
      setProduto({
        produtoId,
        produtoPreco,
        produtoNome,
        produtoImg,
        produtoEstoque,
      });
    }
  }, [route.params]);

  const { saldo, setSaldo } = useContext(WalletContext);
  const { Estoque } = useState(0);
  const { user } = useContext(AuthContext);
  const { ColocarNoHistorico } = useHistorico();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");



  const adicionarCarrinho = async () => {
    await chanceMostrarAnuncio();

    const { produtoId, produtoNome, produtoPreco, produtoImg, produtoEstoque } = produto;

    // Verifica se o produto já está no carrinho
    const produtoNoCarrinho = carrinho.find((item) => item.id === produtoId);

    // Verifica se a quantidade no carrinho já atingiu o estoque
    if (produtoNoCarrinho && produtoNoCarrinho.quantidade >= produtoEstoque) {
      console.log(`O produto ${produtoNome} já atingiu o limite do estoque.`);
      setMensagemModal("Em falta no estoque!");
      setModalVisivel(true);
      return;
    }

    // Adiciona ao carrinho se ainda houver estoque disponível
    if (produtoEstoque <= 0) {
      console.log(`O produto ${produtoNome} está sem estoque.`);
      setMensagemModal("Em falta no estoque!");
      setModalVisivel(true);
    } else {
      AdicionarAoCarrinho(produtoId, produtoNome, produtoPreco, produtoImg, produtoEstoque);
      console.log(`Produto ${produtoNome} adicionado ao carrinho.`);
      setMensagemModal("Produto adicionado ao carrinho!");
      setModalVisivel(true);
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

      <View
        style={{
          width: width * 1,
          height: height * 0.08,
          backgroundColor: tema.background,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity onPress={async () => {
          await chanceMostrarAnuncio();
          navigation.goBack()
        }}>
          <Icon name="chevron-left" color={tema.texto} size={width * 0.09} />
        </TouchableOpacity>

        <View style={[styles.container_img, { width: width * 0.24 }]}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ color: "#ffffff", fontWeight: "bold", fontSize: width * 0.2, maxWidth: width * 0.2 }}
          >
            FEED
            <Text style={{ color: "#2D7BFF" }}>HUB</Text>
          </Text>
          <Image
            source={require("../assets/logo.png")}
            style={{ width: width * 0.1, height: height * 0.04 }}
            resizeMode="contain"
          />
        </View>

        <View style={{ width: width * 0.08 }} />
      </View>


      <Image
        style={[styles.img, {
          width: width * 0.8,
          height: width * 0.6,
        }]}
        source={{ uri: produto.produtoImg }}
        resizeMode="cover"
      />


      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ color: tema.texto, fontWeight: "bold", fontSize: width * 0.08, marginBottom: 10, maxWidth: width * 0.85 }}
      >
        {produto.produtoNome}
      </Text>


      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[{ color: tema.textoAtivo, fontSize: width * 0.09, maxWidth: width * 0.85 }, styles.texto]}
      >
        R$ {produto.produtoPreco.toFixed(2).replace(".", ",")}
      </Text>


      <View style={styles.saldoContainer}>
        <Text
          numberOfLines={1}
          style={[styles.saldoLabel, { color: tema.texto, fontSize: width * 0.05, maxWidth: width * 0.3 }]}
        >
          Seu saldo:
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.saldoValor,
            { color: produto.produtoPreco > saldo ? "red" : tema.textoAtivo, fontSize: width * 0.05, maxWidth: width * 0.35 },
          ]}
        >
          R$ {saldo.toFixed(2).replace(".", ",")}
        </Text>
      </View>


      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          {
            color: tema.texto,
            top: width * 1.7,
            position: "absolute",
            fontSize: width * 0.03,
            fontWeight: "100",
            maxWidth: width * 0.8,
          },
          styles.texto,
        ]}
      >
        ID do produto: {produto.produtoId}
      </Text>


      <View style={[styles.footerAcoes, { backgroundColor: tema.background, width: width * 1, }]}>

        <TouchableOpacity
          onPress={adicionarCarrinho}
          style={[
            styles.btnAcao,
            styles.btnCarrinho,
            { borderColor: tema.textoAtivo, height: height * 0.08, },
          ]}
        >
          <Icon name="shopping-basket" color={tema.textoAtivo} size={width * 0.08} />
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.btnTexto, { color: tema.textoAtivo, fontSize: width * 0.2, maxWidth: width * 0.3 }]}>
            Adicionar
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={async () => {
            const produtoNoCarrinho = carrinho.find((item) => item.id === produto.produtoId);

            // Verifica se a quantidade no carrinho já atingiu o estoque
            if (produtoNoCarrinho && produtoNoCarrinho.quantidade >= produto.produtoEstoque) {
              console.log(`O produto ${produto.produtoNome} já atingiu o limite do estoque.`);
              setModalVisivel(true);
              return;
            } else {

            }
            if (produto.produtoEstoque <= 0) {
              console.log(`O produto ${produto.produtoNome} está sem estoque.`);
              setModalVisivel(true);
            } else {
              await chanceMostrarAnuncio();
              navigation.navigate("Pagamento", {
                produtoId: produto.produtoId,
                produtoNome: produto.produtoNome,
                produtoPreco: produto.produtoPreco,
                produtoImg: produto.produtoImg,
                produtoEstoque: produto.produtoEstoque,
              })
            }
          }}
          style={[styles.btnAcao, styles.btnComprar, { height: height * 0.08 }]}
        >
          <Icon name="credit-card" color="#FFFFFF" size={width * 0.08} />
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.btnTexto, { color: "#FFFFFF", fontSize: width * 0.05, maxWidth: width * 0.3 }]}>
            Comprar Agora
          </Text>
        </TouchableOpacity>
      </View>
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
            <Icon name="box" color={tema.iconEstoque} size={width * 0.09} />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ fontSize: width * 0.06, marginBottom: 10, color: tema.texto, fontWeight: "bold", maxWidth: width * 0.8 }}>
              {mensagemModal}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontWeight: "bold",
  },

  container_img: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },

  img: {
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  saldoContainer: {
    flexDirection: "row",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },

  saldoLabel: {
    marginRight: 8,
  },

  saldoValor: {
    fontWeight: "bold",
  },

  footerAcoes: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#33333333",
    justifyContent: "space-between",
    marginTop: "auto",
  },

  btnAcao: {
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  btnCarrinho: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "transparent",
    borderWidth: 2,
  },

  btnComprar: {
    flex: 1.5,
    backgroundColor: "#2D7BFF",
    shadowColor: "#2D7BFF",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },

  btnTexto: {
    fontWeight: "bold",
    marginLeft: 8,
  },
});
