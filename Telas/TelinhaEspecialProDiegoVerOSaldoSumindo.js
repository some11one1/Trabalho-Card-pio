import { View, Text, Button } from "react-native"; //TELA TEMPORARIA, DEPOIS COLOCA ELE NO HOME E REMOVE ELA
import  { useContext } from "react";
import { ProdutosContext } from "../Context/produtoContext";

export default function NvouEscreverTdDnv({ navigation}) {
const {produtos} = useContext(ProdutosContext)

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          {produtos.map((p) => (
            <Text key={p.id}>
              {p.Nome} - R$ {p.Valor}
              <Button
                title="ir pra detalhes"
                onPress={() =>
                  navigation.navigate("CardProduto", { produtoId: p.id, produtoPreco: p.Valor, produtoNome: p.Nome}) 
                }
              />
            </Text>
          ))}
        </View>
      </View>
    );
    
}