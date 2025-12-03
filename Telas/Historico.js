import React from "react";
import { View, Text, FlatList } from "react-native";
import { usarTheme } from "../Context/ThemeContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHistorico } from "../Context/HistoricoContext";

export default function TelaHistorico() {
  
  const { historico } = useHistorico();
  const { tema } = usarTheme();

  const renderHistoricoItem = ({ item }) => {
    
    const precoUnitario = item.preco || 0;
    const quantidade = item.quantidade || 1;
    const precoTotal = precoUnitario * quantidade;

    return (
      <View
        style={{
          padding: 10,
          marginVertical: 5,
          borderWidth: 2,
          shadowColor: tema.textoAtivo,
          shadowOpacity: 0.5,
          shadowRadius: 10,
          borderColor: tema.textoAtivo,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: tema.texto, fontWeight: 'bold' }}>ID: {item.id}</Text>
        <Text style={{ color: tema.texto }}>Nome: {item.nome}</Text>

        
        {quantidade > 1 ? (
          <View>
            <Text style={{ color: tema.texto, fontWeight: 'bold' }}>
              Total: R$ {precoTotal.toFixed(2).replace(".", ",")}
            </Text>
            <Text style={{ color: tema.textoSecundario || tema.texto, fontSize: 12 }}>
              ({quantidade} x R$ {precoUnitario.toFixed(2).replace(".", ",")} cada)
            </Text>
          </View>
        ) : (
          <Text style={{ color: tema.texto }}>
            Preço: R$ {precoUnitario.toFixed(2).replace(".", ",")}
          </Text>
        )}
        
        <Text style={{ color: tema.texto }}>Quantidade: {quantidade}</Text>
        
        <Text style={{ color: tema.texto }}>
          Data: {item.data ? new Date(item.data).toLocaleString("pt-BR") : "Data indisponível"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: tema.background,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
          color: tema.texto,
        }}
      >
        Histórico de Compras
      </Text>

      {historico && historico.length === 0 ? (
        <Text style={{ color: tema.texto }}>Nenhuma compra realizada ainda.</Text>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderHistoricoItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}