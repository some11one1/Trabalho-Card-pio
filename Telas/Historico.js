import React from "react";
import { View, Text, FlatList } from "react-native";
import { usarTheme } from "../Context/ThemeContext";
import { useHistorico } from "../Context/HistoricoContext";
export default function TelaHistorico() {
  const { historico } = useHistorico();
  const { tema } = usarTheme();

  return (
    <View
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

      {historico.length === 0 ? (
        <Text>Nenhuma compra realizada ainda.</Text>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 10,
                marginVertical: 5,
                borderWidth: 1,
                borderColor: tema.texto,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: tema.texto }}>ID: {item.id}</Text>
              <Text style={{ color: tema.texto }}>Nome: {item.nome}</Text>
              <Text style={{ color: tema.texto }}>Preço: R$ {item.preco}</Text>
              <Text style={{ color: tema.texto }}>
                Data: {new Date(item.data).toLocaleString("pt-BR")}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
