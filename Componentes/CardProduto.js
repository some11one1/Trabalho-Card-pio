import { View, Text, Button, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { WalletContext } from "../Context/WalletContext";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Supabase";
import { useHistorico } from "../Context/HistoricoContext";
import { CarrinhoContext } from "../Context/CarrinhoContext";

export default function CardProduto({ navigation }) {
  const route = useRoute();
  const { produtoId, produtoPreco, produtoNome } = route.params;
  const { ColocarNoHistorico } = useHistorico();
  const { saldo, setSaldo } = useContext(WalletContext);
  const { user } = useContext(AuthContext);
  const { AdicionarAoCarrinho } = useContext(CarrinhoContext);

  const comprar = async () => {
    if (produtoPreco > saldo) {
      Alert.alert("Saldo insuficiente");
      return;
    }
    const novoSaldo = saldo - produtoPreco;
    setSaldo(novoSaldo);

    ColocarNoHistorico(produtoId, produtoNome, produtoPreco);

    await supabase
      .from("usuarios")
      .update({ saldo: novoSaldo })
      .eq("username", user.username);
  };
  const AdicionarCarrinho = () => {
    AdicionarAoCarrinho(produtoId, produtoNome, produtoPreco);
  };
  const voltarTela = () => {
    navigation.navigate("HomeDrawer", {
      screen: "TelaTest",
      params: {
        carrinhoProdutoNome: produtoNome,
        carrinhoProdutoPreco: produtoPreco,
      },
    });
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="voltar" onPress={voltarTela}></Button>
      <Text>{produtoNome}</Text>
      <Text>ID do produto: {produtoId}</Text>
      <Text>Preço: R$ {produtoPreco}</Text>
      <Text>Seu saldo atual: R$ {saldo}</Text>
      <Button
        title="Comprar"
        onPress={() =>
          navigation.navigate("Pagamento", {
            carrinho,
            total,
          })
        }
      />
      <Button title="Carrinho" onPress={AdicionarCarrinho} />
    </View>
  );
}
