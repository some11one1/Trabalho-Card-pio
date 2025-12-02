import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { useAnuncio } from "../Context/AnuncioContext";
import React, { useContext, useEffect } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { ProdutosContext } from "../Context/produtoContext";
import Icon from "react-native-vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav_Menu from "../Componentes/nav_menu";
import { supabase } from "../Supabase";
const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const margin = 8;

const itemWidth = screenWidth / numColumns - margin * 2;

export default function Home({ navigation, route }) {
  const { chanceMostrarAnuncio } = useAnuncio();
  const { produtos, listarProdutos } = useContext(ProdutosContext);
  const { tema } = usarTheme();

 useEffect(() => {
   listarProdutos();

  
   const canal = supabase
     .channel("produtos-changes")
     .on(
       "postgres_changes",
       {
         event: "*", 
         schema: "public",
         table: "produtos",
       },
       (payload) => {
         console.log( payload);
         listarProdutos(); 
       }
     )
     .subscribe();
   return () => {
     supabase.removeChannel(canal);
   };
 }, []);
  const renderProduto = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.produtoItem,
        {
          backgroundColor: tema.cardBackground,
          margin: margin,
          width: itemWidth,
          borderColor: tema.borda,
        },
      ]}
      onPress={async () => {
        await chanceMostrarAnuncio();
        navigation.navigate("CardProduto", {
          produtoId: item.id,
          produtoPreco: item.Valor,
          produtoNome: item.Nome,
          produtoImg: item.img,
        });
      }}
    >
      <Image
        style={styles.produtoImage}
        source={{ uri: item.img }}
        resizeMode="cover"
      />

      <View style={styles.produtoInfo}>
        <Text
          numberOfLines={2}
          style={[styles.produtoNome, { color: tema.texto }]}
        >
          {item.Nome}
        </Text>
        <Text style={[styles.produtoValor, { color: tema.textoAtivo }]}>
          R$ {item.Valor.toFixed(2).replace(".", ",")}
        </Text>
      </View>
    </TouchableOpacity>
  );
const filtroProdutoDisponivel = produtos.filter((produto) => produto.disponivel);
  return (
    <SafeAreaView
      style={[styles.containerPrincipal, { backgroundColor: tema.background }]}
    >
      <Nav_Menu />

      <FlatList
        data={filtroProdutoDisponivel}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduto}
        contentContainerStyle={styles.listaContainer}
        numColumns={numColumns}
        ListEmptyComponent={() => (
          <View style={styles.vazioContainer}>
            <Text style={{ color: tema.texto }}>
              Nenhum produto encontrado.
            </Text>
            <TouchableOpacity onPress={listarProdutos}>
              <Text style={{ color: tema.textoAtivo, marginTop: 10 }}>
                Tentar Recarregar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
  },

  listaContainer: {
    paddingHorizontal: margin,
    alignItems: "center",
    flexGrow: 1,
  },

  produtoItem: {
    height: 180,

    borderRadius: 8,
    borderWidth: 1,

    padding: 5,
    alignItems: "center",
  },
  produtoImage: {
    width: "90%",
    height: 80,
    borderRadius: 6,
    marginBottom: 5,
  },

  produtoInfo: {
    width: "100%",
    paddingHorizontal: 3,
    paddingBottom: 5,
    justifyContent: "flex-start",
  },
  produtoNome: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    height: 30,
  },
  produtoValor: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  vazioContainer: {
    alignItems: "center",
    padding: 20,
  },
});
