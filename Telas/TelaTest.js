import { View, Text, Button } from "react-native"; //TELA TEMPORARIA, DEPOIS COLOCA ELE NO HOME E REMOVE ELA
import { useContext } from "react";
import { ProdutosContext } from "../Context/produtoContext";
import { useRoute } from "@react-navigation/native";

export default function TelaTest({ navigation }) {
  const route = useRoute();
  const { produtos } = useContext(ProdutosContext);

  const { carrinhoProdutoNome, carrinhoProdutoPreco } = route.params || {};

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Button title="Carrinho" onPress={Carrinho}></Button> */}
      <View>
        {produtos.map((p) => (
          <Text key={p.id}>
            {p.Nome} - R$ {p.Valor}
            <Button
              title="ir pra detalhes"
              onPress={() =>
                navigation.navigate("CardProduto", {
                  produtoId: p.id,
                  produtoPreco: p.Valor,
                  produtoNome: p.Nome,
                })
              }
            />
          </Text>
        ))}
      </View>
    </View>
  );
}
