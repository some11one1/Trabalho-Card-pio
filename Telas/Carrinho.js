import React, { useContext } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CarrinhoContext } from "../Context/CarrinhoContext";
import { usarTheme } from "../Context/ThemeContext";
import { useAnuncio } from "../Context/AnuncioContext";

export default function Carrinho({ navigation }) {
  const { carrinho, limparCarrinho } = useContext(CarrinhoContext);
  const { chanceMostrarAnuncio } = useAnuncio();
  const { tema } = usarTheme();

  // --- Cálculos ---
  const totalGeral = carrinho.reduce((acc, item) => acc + item.total, 0);
  const quantidadeTotal = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  // --- Render de cada item do carrinho ---
  const renderItem = ({ item }) => (
    <View style={{
      marginBottom: 10,
      padding: 10,
      borderWidth: 2,
      borderRadius: 8,
      borderColor: tema.textoAtivo,
      shadowColor: tema.textoAtivo,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    }}>
      <Text style={{ color: tema.texto, fontWeight: "bold" }}>{item.nome}</Text>
      <Text style={{ color: tema.texto }}>Preço: R$ {item.preco}</Text>
      <Text style={{ color: tema.texto }}>Quantidade: {item.quantidade}</Text>
      <Text style={{ color: tema.texto }}>Total: R$ {item.total}</Text>
    </View>
  );

  // --- Ações ---
  const irParaPagamento = async () => {
    await chanceMostrarAnuncio();
    navigation.navigate("Pagamento", {
      carrinho,
      totalGeral,
      qndtd: quantidadeTotal,
    });
  };

  const limpar = async () => {
    await chanceMostrarAnuncio();
    limparCarrinho();
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: tema.background }}>
      
      {/* Título */}
      <Text style={{
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: tema.texto,
      }}>
        Carrinho
      </Text>

      {/* Lista ou mensagem */}
      {carrinho.length === 0 ? (
        <Text style={{ color: tema.texto }}>Seu carrinho está vazio.</Text>
      ) : (
        <FlatList
          data={carrinho}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}

      {/* Botões de ação */}
      {carrinho.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Button title="Comprar" onPress={irParaPagamento} />
          <Button title="Limpar Carrinho" onPress={limpar} />
        </View>
      )}

      {/* Total Geral */}
      <Text style={{
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        color: tema.texto,
      }}>
        Total geral: R$ {totalGeral}
      </Text>
    </SafeAreaView>
  );
}
