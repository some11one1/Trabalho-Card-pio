import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  useWindowDimensions,
  TextInput,
  ScrollView,
} from "react-native";

import { useAnuncio } from "../Context/AnuncioContext";
import { usarTheme } from "../Context/ThemeContext";
import { ProdutosContext } from "../Context/produtoContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav_Menu from "../Componentes/nav_menu";
import { supabase } from "../Supabase";

export default function Home({ navigation }) {
  const { width, height } = useWindowDimensions();
  const numColumns = width < 380 ? 2 : 3;
  const margin = width * 0.02;
  const itemWidth = width / numColumns - margin * 2;

  const { chanceMostrarAnuncio } = useAnuncio();
  const { produtos, listarProdutos } = useContext(ProdutosContext);
  const { tema } = usarTheme();

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  const categorias = ["Todos", "comida", "Liquido", "Doce"];

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
        () => {
          listarProdutos();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, []);

  /** ✅ FILTRO OTIMIZADO */
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      if (!p.disponivel) return false;

      const nomeOk = p.Nome
        ?.toLowerCase()
        .includes(busca.toLowerCase());

      const categoriaOk =
        categoriaSelecionada === "Todos"
          ? true
          : p.categorias === categoriaSelecionada;

      return nomeOk && categoriaOk;
    });
  }, [produtos, busca, categoriaSelecionada]);

  const renderProduto = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.produtoItem,
        {
          backgroundColor: tema.cardBackground,
          width: itemWidth,
          margin,
          borderColor: tema.borda,
          height: height * 0.25,
        },
      ]}
      onPress={async () => {
        await chanceMostrarAnuncio();
        navigation.navigate("CardProduto", {
          produtoId: item.id,
          produtoPreco: item.Valor,
          produtoNome: item.Nome,
          produtoImg: item.img,
          produtoEstoque: item.Estoque,
        });
      }}
    >
      <Image
        source={{ uri: item.img }}
        resizeMode="contain"
        style={[
          styles.produtoImage,
          {
            height: height * 0.1,
          },
        ]}
      />

      <View style={styles.produtoInfo}>
        <Text
          numberOfLines={2}
          style={[
            styles.produtoNome,
            { color: tema.texto, fontSize: width * 0.032 },
          ]}
        >
          {item.Nome}
        </Text>

        <Text
          style={[
            styles.produtoValor,
            { color: tema.textoAtivo },
          ]}
        >
          R$ {item.Valor.toFixed(2).replace(".", ",")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.containerPrincipal,
        { backgroundColor: tema.background },
      ]}
    >
      <Nav_Menu />


      <View style={styles.buscaContainer}>
        <TextInput
          placeholder="Buscar produtos..."
          placeholderTextColor={`${tema.texto}99`}
          value={busca}
          onChangeText={setBusca}
          style={[
            styles.inputBusca,
            {
              backgroundColor: tema.cardBackground,
              color: tema.texto,
            },
          ]}
        />


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriasContainer}
        >
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategoriaSelecionada(cat)}
              style={[
                styles.categoriaChip,
                {
                  backgroundColor:
                    categoriaSelecionada === cat
                      ? tema.textoAtivo
                      : tema.cardBackground,
                },
              ]}
            >
              <Text
                style={{
                  color:
                    categoriaSelecionada === cat
                      ? "#fff"
                      : tema.texto,
                  fontWeight: "600",
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduto}
        numColumns={numColumns}
        contentContainerStyle={styles.listaContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.vazioContainer}>
            <Text style={{ color: tema.texto }}>
              Nenhum produto encontrado.
            </Text>
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

  buscaContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },

  inputBusca: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },

  categoriasContainer: {
    marginTop: 10,
  },

  categoriaChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },

  listaContainer: {
    alignItems: "center",
    paddingVertical: 10,
    flexGrow: 1,
  },

  produtoItem: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
  },

  produtoImage: {
    width: "90%",
    marginBottom: 6,
  },

  produtoInfo: {
    alignItems: "center",
  },

  produtoNome: {
    fontWeight: "bold",
    textAlign: "center",
    height: 36,
  },

  produtoValor: {
    fontWeight: "700",
    marginTop: 4,
  },

  vazioContainer: {
    alignItems: "center",
    padding: 20,
  },
});
