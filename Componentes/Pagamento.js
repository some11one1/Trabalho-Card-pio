import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Entypo";
import { usarTheme } from "../Context/ThemeContext";
// FEITO POR IA, se inspire nela e re faça o código, essa tela será refeita, e essa tela é uma base para termos uma noção
export default function Pagamento({ navigation, route }) {
  const { tema } = usarTheme();

  const {
    carrinho = null,
    totalGeral = null,
    produtoId = null,
    produtoNome = null,
    produtoPreco = null,
    produtoImg = null,
  } = route.params || {};

  // Determina se é compra direta ou via carrinho
  const itens = carrinho
    ? carrinho
    : [
        {
          id: produtoId,
          nome: produtoNome,
          preco: produtoPreco,
          img: produtoImg,
        },
      ];

  const total = totalGeral ? totalGeral : produtoPreco;
  const [metodo, setMetodo] = useState(null);

  const metodosPagamento = [
    { id: "pix", nome: "Pix", icone: "dots-three-horizontal" },
    { id: "cartao", nome: "Cartão de Crédito", icone: "credit-card" },
    { id: "saldo", nome: "Saldo da Conta", icone: "wallet" },
  ];

  const confirmarPagamento = () => {
    if (!metodo) {
      alert("Selecione um método de pagamento");
      return;
    }

    alert(`Pagamento confirmado via ${metodo.nome}`);
    navigation.navigate("HomeDrawer");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: tema.background }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={32} color={tema.texto} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: tema.texto }]}>Pagamento</Text>

        <View style={{ width: 32 }} />
      </View>

      {/* LISTA DE ITENS */}
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ padding: 20 }}
      >
        {itens.map((item, i) => (
          <View
            key={i}
            style={[
              styles.cardItem,
              { backgroundColor: tema.card },
            ]}
          >
            <Text style={[styles.itemNome, { color: tema.texto }]}>
              {item.nome}
            </Text>

            {item.quantidade && item.quantidade > 1 && (
              <Text style={[styles.itemQtd, { color: tema.textoSecundario || "#aaa" }]}>
                Quantidade: {item.quantidade}
              </Text>
            )}

            <Text style={[styles.itemPreco, { color: tema.textoAtivo }]}>
              R$ {item.preco.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        ))}

        {/* MÉTODOS DE PAGAMENTO */}
        <Text
          style={[
            styles.metodosTitulo,
            { color: tema.texto, marginTop: 10 },
          ]}
        >
          Método de pagamento:
        </Text>

        {metodosPagamento.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.metodoItem,
              {
                backgroundColor:
                  metodo?.id === m.id ? tema.textoAtivo : tema.card,
                borderColor: tema.textoAtivo,
              },
            ]}
            onPress={() => setMetodo(m)}
          >
            <Icon
              name={m.icone}
              size={22}
              color={metodo?.id === m.id ? "#FFF" : tema.texto}
              style={{ marginRight: 10 }}
            />
            <Text
              style={[
                styles.metodoTexto,
                { color: metodo?.id === m.id ? "#FFF" : tema.texto },
              ]}
            >
              {m.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* TOTAL E BOTÃO */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: tema.texto }]}>TOTAL:</Text>
          <Text style={[styles.totalPreco, { color: tema.textoAtivo }]}>
            R$ {total.toFixed(2).replace(".", ",")}
          </Text>
        </View>

        <TouchableOpacity style={styles.btnComprar} onPress={confirmarPagamento}>
          <Icon name="check" size={24} color="#FFF" />
          <Text style={styles.btnComprarTexto}>Confirmar Pagamento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },

  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 26, fontWeight: "bold" },

  cardItem: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },

  itemNome: { fontSize: 18, fontWeight: "600" },
  itemQtd: { fontSize: 14, marginTop: 4 },
  itemPreco: { fontSize: 18, fontWeight: "bold", marginTop: 6 },

  metodosTitulo: { fontSize: 20, fontWeight: "bold", marginTop: 16 },

  metodoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 10,
  },

  metodoTexto: { fontSize: 16, fontWeight: "500" },

  footer: {
    width: "100%",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#33333333",
  },

  totalContainer: { marginBottom: 16 },

  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalPreco: { fontSize: 24, fontWeight: "bold" },

  btnComprar: {
    flexDirection: "row",
    backgroundColor: "#2D7BFF",
    padding: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  btnComprarTexto: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
