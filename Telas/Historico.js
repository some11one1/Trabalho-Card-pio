import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Entypo";
import { usarTheme } from "../Context/ThemeContext";
import { useHistorico } from "../Context/HistoricoContext";

export default function TelaHistorico() {
  const { historico } = useHistorico();
  const { tema } = usarTheme();
  const { width } = useWindowDimensions();

  const fontBase = width * 0.04;
  const fontSmall = width * 0.032;
  const paddingCard = width * 0.04;

  const renderHistoricoItem = ({ item }) => {
    const preco = item.preco || 0;
    const quantidade = item.quantidade || 1;
    const total = preco * quantidade;

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: tema.cardBackground,
            borderColor: tema.textoAtivo,
            padding: paddingCard,
          },
        ]}
      >
        
        <View style={styles.header}>
          <Icon name="shopping-bag" size={fontBase * 1.2} color={tema.textoAtivo} />
          <Text
            style={[
              styles.nome,
              { color: tema.texto, fontSize: fontBase },
            ]}
            numberOfLines={1}
          >
            {item.nome}
          </Text>
        </View>

      
        <View style={styles.info}>
          <Text style={{ color: tema.texto, fontSize: fontSmall }}>
            Quantidade: {quantidade}
          </Text>

          {quantidade > 1 ? (
            <Text style={{ color: tema.texto, fontSize: fontSmall }}>
              {quantidade} × R$ {preco.toFixed(2).replace(".", ",")}
            </Text>
          ) : null}

          <Text
            style={{
              color: tema.textoAtivo,
              fontWeight: "bold",
              fontSize: fontBase * 0.95,
              marginTop: 6,
            }}
          >
            Total: R$ {total.toFixed(2).replace(".", ",")}
          </Text>
        </View>

      
        <View style={styles.footer}>
          <Icon name="clock" size={fontSmall * 1.2} color={tema.texto} />
          <Text style={{ color: tema.texto, fontSize: fontSmall }}>
            {item.data
              ? new Date(item.data).toLocaleString("pt-BR")
              : "Data indisponível"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: tema.background }}
    >
      <View style={{ paddingHorizontal: width * 0.05, paddingTop: 10 }}>
        <Text
          style={{
            fontSize: fontBase * 1.3,
            fontWeight: "bold",
            color: tema.texto,
            marginBottom: 12,
          }}
        >
          Histórico de Compras
        </Text>

        {historico?.length === 0 ? (
          <Text style={{ color: tema.texto }}>
            Nenhuma compra realizada ainda.
          </Text>
        ) : (
          <FlatList
            data={historico}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderHistoricoItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: 14,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  nome: {
    fontWeight: "bold",
    flex: 1,
  },

  info: {
    marginTop: 4,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    opacity: 0.7,
  },
});
