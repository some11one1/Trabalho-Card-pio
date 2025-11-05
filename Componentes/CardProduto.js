
import { View, Text, Button, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import { WalletContext } from "../Context/WalletContext";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Supabase";

export default function CardProduto() {
    const route = useRoute();
    const { produtoId, produtoPreco, produtoNome} = route.params
    const { saldo, setSaldo } = useContext(WalletContext);
    const { user } = useContext(AuthContext);
    const comprar =  async (p) => {
        if (p.Valor > saldo) {
            Alert.alert("saldo insuficiente");
            return;
        } else {
                const novoSaldo = saldo - p.Valor
                setSaldo(novoSaldo)
                await supabase
                .from("usuarios")
                .update({saldo: novoSaldo})
                .eq("username", user.username)
            }
    };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{produtoNome}</Text>
        <Text>ID do produto: {produtoId}</Text>
        <Text>Preço: R$ {produtoPreco}</Text>
        <Text>Seu saldo atual: R$ {saldo}</Text>
        <Button
            title="Comprar"
            onPress={() =>
            comprar({ Nome: produtoNome, Valor: produtoPreco, id: produtoId })
        }
      />
    </View>
  );
}
