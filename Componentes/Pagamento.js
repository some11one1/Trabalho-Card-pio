import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useHistorico } from "../Context/HistoricoContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
import { supabase } from "../Supabase";
import { AuthContext } from "../Context/AuthContext";
import { useAnuncio } from "../Context/AnuncioContext";
import { CarrinhoContext } from "../Context/CarrinhoContext";


import Icon from "react-native-vector-icons/Entypo";
import Icon2 from "react-native-vector-icons/MaterialIcons";


export default function Pagamento({ navigation, route }) {
  const { ColocarNoHistorico } = useHistorico();
  const { chanceMostrarAnuncio } = useAnuncio();
  const { user } = useContext(AuthContext);
  const { limparCarrinho } = useContext(CarrinhoContext);

  const { tema } = usarTheme();
  const { saldo, setSaldo, carregarSaldo } = useContext(WalletContext);
  useEffect(() => {
    carregarSaldo();
  }, []);
  const {
    carrinho = null,
    totalGeral = null,
    produtoId = null,
    produtoNome = null,
    produtoPreco = null,
    produtoImg = null,
    qndtd = null,
    produtoEstoque = null,
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
        quantidade: qndtd,
        estoque: produtoEstoque,
      },
    ];

  const total = totalGeral ? totalGeral : produtoPreco;
  const [metodo, setMetodo] = useState(null);

  const metodosPagamento = [
    { id: "pix", nome: "Pix", icone: "pix" },
    { id: "cartao", nome: "Cartão de Crédito", icone: "credit-card" },
    { id: "saldo", nome: "Saldo da Conta", icone: "wallet" },
  ];
  const valorCompra = totalGeral ?? produtoPreco;
  const confirmarPagamento = async () => {
    if (!metodo) {
      alert("Selecione um método de pagamento");
      return;
    } else if (metodo.nome == "Saldo da Conta") {
      if (saldo < valorCompra) {
        alert("Saldo Insuficiente");
        return;
      } else {
        const novoSaldo = saldo - valorCompra;
        setSaldo(novoSaldo);
        const { error } = await supabase
          .from("usuarios")
          .update({ saldo: novoSaldo })
          .eq("id", user.id);
        if (error) {
          alert("erro ao atualizar o saldo");
          setSaldo(saldo);
          return;
        }
      }
    }

    if (carrinho) {
      carrinho.forEach(async (item) => {
        await ColocarNoHistorico(
          item.id,
          item.nome,
          item.preco,
          item.quantidade
        );
      });
      limparCarrinho();
    } else {
      ColocarNoHistorico(produtoId, produtoNome, valorCompra, qndtd);
    }
    alert(`Pagamento confirmado via ${metodo.nome}`);
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: tema.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={async () => {
            await chanceMostrarAnuncio();
            navigation.goBack();
          }}
        >
          <Icon name="chevron-left" size={32} color={tema.texto} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: tema.texto }]}>Pagamento</Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ padding: 20 }}
      >
        {itens.map((item, i) => (
          
          <View
            key={i}
            style={[styles.cardItem, { backgroundColor: tema.card }]}
          >
            <Text style={[styles.itemNome, { color: tema.texto }]}>
              {item.nome}
            </Text>

            {item.quantidade && item.quantidade > 1 && (
              <Text
                style={[
                  styles.itemQtd,
                  { color: tema.textoSecundario || "#aaa" },
                ]}
              >
                Quantidade: {item.quantidade}
              </Text>
            )}

            <Text style={[styles.itemNome, { color: tema.texto }]}>
              Estoque do produto: {item.produtoEstoque}
            </Text>

            <Text style={[styles.itemPreco, { color: tema.textoAtivo }]}>
              R$ {item.preco.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        ))}

        <Text
          style={[styles.metodosTitulo, { color: tema.texto, marginTop: 10 }]}
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
            onPress={async () => {
              await chanceMostrarAnuncio();
              setMetodo(m);
            }}
          >
            {m.id === "pix" ? (
              <Icon2
                name={m.icone}
                size={22}
                color={metodo?.id === m.id ? "#FFF" : tema.texto}
                style={{ marginRight: 10 }}
              />
            ) : (
              <Icon
                name={m.icone}
                size={22}
                color={metodo?.id === m.id ? "#FFF" : tema.texto}
                style={{ marginRight: 10 }}
              />
            )}
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

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: tema.texto }]}>TOTAL:</Text>
          <Text style={[styles.totalPreco, { color: tema.textoAtivo }]}>
            R$ {total.toFixed(2).replace(".", ",")}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btnComprar}
          onPress={async () => {
            await chanceMostrarAnuncio();
            confirmarPagamento();
          }}
        >
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
