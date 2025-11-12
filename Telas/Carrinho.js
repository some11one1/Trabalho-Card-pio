import React, { useContext } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { CarrinhoContext } from "../Context/CarrinhoContext";

export default function Carrinho({ navigation }) {
  const { carrinho, limparCarrinho } = useContext(CarrinhoContext);
  const totalGeral = carrinho.reduce((sum, item) => sum + item.total, 0);
  const qndtd = carrinho.reduce((sum, item) => item.quantidade + sum, 0)
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Carrinho
      </Text>

      {carrinho.length === 0 ? (
        <Text>Seu carrinho está vazio.</Text>
      ) : (
        <FlatList
          data={carrinho}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 10,
                padding: 10,
                borderWidth: 1,
                borderRadius: 8,
              }}
            >
              <Text>{item.nome}</Text>
              <Text>Preço: R$ {item.preco}</Text>
              <Text>Quantidade: {item.quantidade}</Text>
              <Text>Total: R$ {item.total}</Text>
            </View>
          )}
        />
      )}

      {carrinho.length > 0 && (
        <View>
          <Button
            title="Comprar"
            onPress={() =>
              navigation.navigate("Pagamento", {
                carrinho,
                totalGeral,
                qndtd
              })
            }
          />
          <Button title="Limpar Carrinho" onPress={limparCarrinho} />
        </View>
      )}
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Total geral: R$ {totalGeral}
      </Text>
    </View>
  );
}
