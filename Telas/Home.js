import { View, Text, StyleSheet } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import React, { useContext } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { ProdutosContext, } from "../Context/produtoContext";
export default function Home() {
  const { produtos, listarProdutos } = useContext(ProdutosContext);

  const { tema } = usarTheme();
  return (
    <View
      style={{flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tema.background,}}
    >
      <View>
        <Text style={{ color: tema.texto}}>
          ssssssssssssssss
        </Text>
        {produtos.map((p) => (
          <Text key={p.id} style={{color: tema.texto}}>
            {p.Nome} - R$ {p.Valor}
          </Text>
        ))}
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },

  text_white: {
    
  }
}); 