import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { CarrinhoContext } from "../Context/CarrinhoContext";
import { usarTheme } from "../Context/ThemeContext";
import { useAnuncio } from "../Context/AnuncioContext";

const { width } = Dimensions.get("window");

export default function Carrinho({ navigation }) {
  const {
    carrinho = [],
    limparCarrinho,
    removerItem,
    aumentarQuantidade,
    diminuirQuantidade,
  } = useContext(CarrinhoContext);

  const { chanceMostrarAnuncio } = useAnuncio();
  const { tema } = usarTheme();

  const totalGeral = carrinho.reduce((acc, item) => acc + Number(item.total || 0), 0);
  const quantidadeTotal = carrinho.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const placeholder = "https://i.imgur.com/3I6eQpA.png";

  const handleRemover = async (id) => {
    await chanceMostrarAnuncio();
    removerItem?.(id);
  };

  const handleAumentar = (id) => {
    aumentarQuantidade?.(id);
  };

  const handleDiminuir = (id) => {
    diminuirQuantidade?.(id);
  };

  const irParaPagamento = async () => {
    await chanceMostrarAnuncio();
    navigation.navigate("Pagamento", { carrinho, totalGeral, qntd: quantidadeTotal });
  };

  const renderItem = ({ item }) => {
    const imageUri = item?.produtoImg;
    const imageSrc =
      imageUri && typeof imageUri === "string" && (imageUri.startsWith("data:") || imageUri.startsWith("http"))
        ? { uri: imageUri }
        : { uri: placeholder };

    return (
      <View style={[styles.card, { backgroundColor: tema.cardBackground, borderColor: tema.borda }]}>
        <View style={styles.left}>
          <Text numberOfLines={2} style={[styles.title, { color: tema.texto }]}>
            {item.nome}
          </Text>

          <Text style={[styles.subtitle, { color: tema.texto }]}>{item.descricao || "Produto do app"}</Text>

          <View style={styles.row}>
            <Text style={[styles.price, { color: tema.textoAtivo }]}>
              R$ {Number(item.preco || 0).toFixed(2).replace(".", ",")}
            </Text>

            <View style={styles.qtdBox}>
              <TouchableOpacity onPress={() => handleDiminuir(item.id)} style={[styles.qBtn, { borderColor: tema.borda }]}>
                <Feather name="minus" size={16} color={tema.texto} />
              </TouchableOpacity>

              <Text style={[styles.qtd, { color: tema.texto }]}>{item.quantidade}</Text>

              <TouchableOpacity onPress={() => handleAumentar(item.id)} style={[styles.qBtn, { borderColor: tema.borda }]}>
                <Feather name="plus" size={16} color={tema.texto} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={{ color: tema.texto, fontSize: 13 }}>
              Total: R$ {Number(item.total || 0).toFixed(2).replace(".", ",")}
            </Text>

            <TouchableOpacity onPress={() => handleRemover(item.id)} style={styles.removeBtn}>
              <Feather name="trash-2" size={16} color="#D33" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.right}>
          <Image source={imageSrc} style={styles.image} resizeMode="cover" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: tema.background }]}>
      <View style={styles.header}>
        <View />
        <Text style={[styles.headerTitle, { color: tema.texto }]}>Meu Carrinho</Text>
        <TouchableOpacity
          onPress={async () => {
            await chanceMostrarAnuncio();
            if (!carrinho.length) return;
            Alert.alert("Limpar Carrinho", "Deseja limpar o carrinho?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Limpar", style: "destructive", onPress: () => (typeof limparCarrinho === "function" ? limparCarrinho() : Alert.alert("Limpar", "limparCarrinho não implementado.")) },
            ]);
          }}
        >
          <Feather name="trash" size={20} color={tema.texto} />
        </TouchableOpacity>
      </View>

      {carrinho.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: tema.texto, fontSize: 16 }}>Seu carrinho está vazio</Text>
          <Text style={{ color: tema.texto, fontSize: 13, marginTop: 6 }}>Adicione itens para começar</Text>
        </View>
      ) : (
        <FlatList
          data={carrinho}
          keyExtractor={(item, index) => (item.id ? String(item.id) : String(index))}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={[styles.bottomBar, { backgroundColor: tema.cardBackground, borderTopColor: tema.borda }]}>
        <View>
          <Text style={[styles.totalLabel, { color: tema.texto }]}>Total ({quantidadeTotal} itens)</Text>
          <Text style={[styles.totalValue, { color: tema.textoAtivo }]}>R$ {totalGeral.toFixed(2).replace(".", ",")}</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: tema.textoAtivo }]} onPress={irParaPagamento}>
            <Text style={styles.btnPrimaryText}>Finalizar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnOutline, { borderColor: tema.borda }]}
            onPress={async () => {
              await chanceMostrarAnuncio();
              if (typeof limparCarrinho === "function") limparCarrinho();
            }}
          >
            <Text style={[styles.btnOutlineText, { color: tema.texto }]}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },

  list: { padding: 16, paddingBottom: 120 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },

  card: {
    width: "100%",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },

  left: { flex: 1, paddingRight: 12 },
  right: { width: width * 0.28, height: width * 0.22, borderRadius: 12, overflow: "hidden" },

  title: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  subtitle: { fontSize: 12, color: "#888", marginBottom: 6 },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 15, fontWeight: "800" },

  qtdBox: { flexDirection: "row", alignItems: "center", backgroundColor: "transparent" },
  qBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  qtd: { minWidth: 24, textAlign: "center", fontWeight: "700" },

  metaRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  removeBtn: { padding: 6 },

  image: { width: "100%", height: "100%" },

  bottomBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 16,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },

  totalLabel: { fontSize: 12 },
  totalValue: { fontSize: 18, fontWeight: "800", marginTop: 4 },

  buttons: { flexDirection: "row", alignItems: "center", gap: 10 },
  btnPrimary: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 12,
  },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
  btnOutline: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  btnOutlineText: { fontWeight: "700" },
});