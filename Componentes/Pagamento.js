import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import React, { useContext } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { ProdutosContext } from "../Context/produtoContext";
import Icon from "react-native-vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

export default function Pagamento({ navigation, route }) {
  const { produtoId, produtoPreco, produtoNome } = route.params || {};
  const { tema } = usarTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: tema.background,
      }}
    >
      <Button
        title={produtoNome}
        onPress={() =>
          navigation.navigate("CardProduto", {
            produtoPreco,
            produtoNome,
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  btn_menu: {
    width: 24,
    marginLeft: 20,
  },
});
