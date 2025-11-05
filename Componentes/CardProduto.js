import { View, Text, Button, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useContext } from "react";
import { WalletContext } from "../Context/WalletContext";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Supabase";
import { useHistorico } from "../Context/HistoricoContext";

export default function CardProduto() {
  const route = useRoute();
  const { produtoId, produtoPreco, produtoNome } = route.params;
  const { ColocarNoHistorico } = useHistorico();
  const { saldo, setSaldo } = useContext(WalletContext);
  const { user } = useContext(AuthContext);

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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{produtoNome}</Text>
      <Text>ID do produto: {produtoId}</Text>
      <Text>Preço: R$ {produtoPreco}</Text>
      <Text>Seu saldo atual: R$ {saldo}</Text>
      <Button title="Comprar" onPress={comprar} />
    </View>
  );
}
