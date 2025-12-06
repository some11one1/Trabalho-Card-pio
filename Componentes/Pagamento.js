import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "react-native-vector-icons/Entypo";
import Icon2 from "react-native-vector-icons/MaterialIcons";

import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
import { useHistorico } from "../Context/HistoricoContext";
import { AuthContext } from "../Context/AuthContext";
import { CarrinhoContext } from "../Context/CarrinhoContext";
import { useAnuncio } from "../Context/AnuncioContext";
import { supabase } from "../Supabase";

export default function Pagamento({ navigation, route }) {


  const { tema } = usarTheme();
  const { saldo, setSaldo, carregarSaldo } = useContext(WalletContext);
  const { ColocarNoHistorico } = useHistorico();
  const { user } = useContext(AuthContext);
  const { limparCarrinho } = useContext(CarrinhoContext);
  const { chanceMostrarAnuncio } = useAnuncio();
  const [mostrarModal, setMostrarModal] = useState(false);



  useEffect(() => {
    carregarSaldo();
  }, []);


  const {
    carrinho,
    totalGeral,
    produtoId,
    produtoNome,
    produtoPreco,
    produtoImg,
    qndtd,
    produtoEstoque,
  } = route.params || {};


  const itens = carrinho ?? [{
    id: produtoId,
    nome: produtoNome,
    preco: produtoPreco,
    img: produtoImg,
    quantidade: qndtd || 1,
    produtoEstoque: produtoEstoque
  }];

  const total = totalGeral ?? produtoPreco;
  const valorCompra = total;


  const [metodo, setMetodo] = useState(null);

  const metodosPagamento = [
    { id: "pix", nome: "Pix", icone: "pix" },
    { id: "cartao", nome: "Cartão de Crédito", icone: "credit-card" },
    { id: "saldo", nome: "Saldo da Conta", icone: "wallet" },
  ];


  const atualizarEstoque = async (item) => {
    const quantidade = Number(item.quantidade || 1);
    const novoEstoque = item.produtoEstoque - quantidade;

    const { error } = await supabase
      .from("produtos")
      .update({ Estoque: novoEstoque })
      .eq("id", item.id);

    if (error) {
      console.log("Erro ao atualizar estoque:", error);
      return false;
    }

    return true;
  };


  const confirmarPagamento = async () => {

    if (!metodo) {
      alert("Selecione um método de pagamento");
      return;
    }


    if (metodo.nome === "Saldo da Conta") {
      if (saldo < valorCompra) {
        alert("Saldo insuficiente");
        return;
      }

      const novoSaldo = saldo - valorCompra;

      const { error } = await supabase
        .from("usuarios")
        .update({ saldo: novoSaldo })
        .eq("id", user.id);

      if (error) {
        alert("Erro ao atualizar saldo");
        return;
      }

      setSaldo(novoSaldo);
    }


    for (const item of itens) {

      const sucesso = await atualizarEstoque(item);

      if (!sucesso) {
        alert("Erro ao atualizar estoque");
        return;
      }

      await ColocarNoHistorico(
        item.id,
        item.nome,
        item.preco,
        item.quantidade
      );
    }


    if (carrinho) {
      limparCarrinho();
    }

    setMostrarModal(true);
  };




  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.background }]}>

      <View style={styles.header}>
        <TouchableOpacity onPress={async () => {
          await chanceMostrarAnuncio();
          navigation.goBack();
        }}>
          <Icon name="chevron-left" size={32} color={tema.texto} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: tema.texto }]}>Pagamento</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {itens.map((item, i) => (
          <View key={i} style={[styles.cardItem, { backgroundColor: tema.card }]}>
            <Text style={[styles.itemNome, { color: tema.texto }]}>
              {item.nome}
            </Text>
            {!!item.quantidade && item.quantidade > 1 && (
              <Text style={[styles.itemQtd, { color: tema.textoSecundario || "#aaa" }]}>
                Quantidade: {item.quantidade}
              </Text>
            )}
            <Text style={[styles.itemNome, { color: tema.texto }]}>
              Estoque disponível: {item.produtoEstoque}
            </Text>
            <Text style={[styles.itemPreco, { color: tema.textoAtivo }]}>
              R$ {item.preco.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        ))}

        <Text style={[styles.metodosTitulo, { color: tema.texto }]}>
          Método de pagamento:
        </Text>

        {metodosPagamento.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.metodoItem,
              {
                backgroundColor: metodo?.id === m.id ? tema.textoAtivo : tema.card,
                borderColor: tema.textoAtivo,
              },
            ]}
            onPress={async () => {
              await chanceMostrarAnuncio();
              setMetodo(m);
            }}
          >
            {m.id === "pix" ? (
              <Icon2 name={m.icone} size={22} color={metodo?.id === m.id ? "#FFF" : tema.texto} />
            ) : (
              <Icon name={m.icone} size={22} color={metodo?.id === m.id ? "#FFF" : tema.texto} />
            )}

            <Text style={[
              styles.metodoTexto,
              { color: metodo?.id === m.id ? "#FFF" : tema.texto }
            ]}>
              {m.nome}
            </Text>
          </TouchableOpacity>
        ))}

      </ScrollView>

      <View style={styles.footer}>
        <Text style={[styles.totalLabel, { color: tema.texto }]}>
          TOTAL:
        </Text>

        <Text style={[styles.totalPreco, { color: tema.textoAtivo }]}>
          R$ {total.toFixed(2).replace(".", ",")}
        </Text>

        <TouchableOpacity style={styles.btnComprar} onPress={confirmarPagamento}>
          <Icon name="check" size={24} color="#FFF" />
          <Text style={styles.btnComprarTexto}>Confirmar Pagamento</Text>
        </TouchableOpacity>

      </View>
      <Modal
        visible={mostrarModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalBox, {
              backgroundColor: tema.background,
              borderWidth: 2,
              borderColor: tema.textoAtivo,
              borderRadius: 15,
            }]}>

            <Icon name="check" size={48} color={tema.textoAtivo} />

            <Text style={[styles.modalTitulo, { color: tema.texto }]}>
              Pagamento confirmado!
            </Text>

            <Text style={{ color: tema.texto, marginVertical: 10 }}>
              Método: {metodo?.nome}
            </Text>

            <TouchableOpacity
              style={[styles.modalBotao, { backgroundColor: tema.textoAtivo }]}
              onPress={() => {
                setMostrarModal(false);
                navigation.goBack();
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>
                OK
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },

  title: { fontSize: 24, fontWeight: "bold" },

  cardItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  itemNome: { fontSize: 18, fontWeight: "600" },
  itemQtd: { fontSize: 14 },
  itemPreco: { fontSize: 18, fontWeight: "bold" },

  metodosTitulo: { fontSize: 18, marginVertical: 10 },

  metodoItem: {
    flexDirection: "row",
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: "center",
  },

  metodoTexto: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },

  footer: {
    padding: 15,
  },

  totalLabel: { fontSize: 16, fontWeight: "bold" },
  totalPreco: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  btnComprar: {
    backgroundColor: "#2D7BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  btnComprarTexto: {
    color: "#FFF",
    fontSize: 17,
    marginLeft: 10,
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  modalBotao: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

});
