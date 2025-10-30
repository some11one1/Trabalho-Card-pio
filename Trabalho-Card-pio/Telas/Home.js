import { View, Text } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import React, { useContext } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { ProdutosContext } from "../Context/produtoContext";
import { useEffect } from "react";
export default function Home() {
  const { produtos, listarProdutos } = useContext(ProdutosContext);
  useEffect(() => {
    // Atualiza o título do documento usando a API do navegador
    listarProdutos();
  }, []);
  const { tema } = usarTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tema.background,
      }}
    >
      <View>
        {produtos.map((p) => (
          <Text key={p.id} style={{ color: tema.texto }}>
            {p.Nome} - R$ {p.Valor}
          </Text>
        ))}
      </View>
    </View>
  );
}
