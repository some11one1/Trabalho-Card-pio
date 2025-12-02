import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Dimensions,
  Button,
  Alert,
  TextInput,
} from "react-native";
import { supabase } from "../Supabase"; 
import { AuthContext } from "../Context/AuthContext";
import { useAnuncio } from "../Context/AnuncioContext";
import React, { useContext, useState, useEffect } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { ProdutosContext } from "../Context/produtoContext";
import Icon from "react-native-vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav_Menu from "../Componentes/nav_menu";

import { useHistorico } from "../Context/HistoricoContext";
const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const margin = 8;

const itemWidth = screenWidth / numColumns - margin * 2;

export default function AdminHome({ navigation, route }) {
  const [novoDisponivel, setNovoDisponivel] = useState(true);
const { user } = useContext(AuthContext);
  const [produtoSelect, setProdutoSelect] = useState(null);
  const { ColocarNoHistorico } = useHistorico();
  const [modalVisivel, setModalVisivel] = useState(false);
  const { chanceMostrarAnuncio } = useAnuncio();
  const { produtos, listarProdutos } = useContext(ProdutosContext);
  const [novoValor, setNovoValor] = useState("");
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
      onPress={() => {
        setProdutoSelect(item);
        setNovoValor(item.Valor.toString());
        setNovoDisponivel(item.disponivel); 
        setModalVisivel(true);
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
          Editar Produto
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.containerPrincipal, { backgroundColor: tema.background }]}
    >
      <Nav_Menu />
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 270,
              backgroundColor: tema.cardBackground,
              borderRadius: 15,
              padding: 20,
              alignItems: "center",
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginBottom: 15,
                color: tema.texto,
                fontWeight: "700",
              }}
            >
              Editar produto
            </Text>

     
            <TextInput
              value={novoValor}
              onChangeText={setNovoValor}
              placeholder="Preço (ex: 12.50)"
              placeholderTextColor={tema.texto + "70"}
              keyboardType="numeric"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: tema.borda,
                backgroundColor: tema.background,
                color: tema.texto,
                marginBottom: 15,
              }}
            />

            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: novoDisponivel ? "#22C55E" : "#DC2626",
                alignItems: "center",
                marginBottom: 12,
              }}
              onPress={() => {
                setNovoDisponivel(!novoDisponivel);
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                {novoDisponivel ? "Disponível ✓" : "Indisponível ✗"}
              </Text>
            </TouchableOpacity>

      
            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: "#3B82F6",
                alignItems: "center",
                marginBottom: 12,
              }}
              onPress={async () => {
                if (!produtoSelect) return;

                const { error } = await supabase
                  .from("produtos")
                  .update({
                    Valor: parseFloat(novoValor),
                    disponivel: novoDisponivel,
                  })
                  .eq("id", produtoSelect.id);

                if (error) {
                  Alert.alert("Erro", "Não foi possível salvar.");
                  console.log(error);
                } else {
                  listarProdutos(); 
                  setModalVisivel(false);
                }
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                Salvar Alterações
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: "#6B7280",
                alignItems: "center",
              }}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={produtos}
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
