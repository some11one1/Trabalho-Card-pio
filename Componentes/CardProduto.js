import { View, Text, Button, Alert, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { WalletContext } from "../Context/WalletContext";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Supabase";
import { useHistorico } from "../Context/HistoricoContext";
import { usarTheme } from "../Context/ThemeContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';

const { width } = Dimensions.get('window');

export default function CardProduto({ navigation }) {
  const route = useRoute();
  const { produtoId, produtoPreco, produtoNome, produtoImg } = route.params;
  const { ColocarNoHistorico } = useHistorico();
  const { saldo, setSaldo } = useContext(WalletContext);
  const { user } = useContext(AuthContext);
  const [carrinho, setCarrinho] = useState([]);
   const { tema } = usarTheme();
  const comprar = async () => {
    if (produtoPreco > saldo) {
      Alert.alert("Saldo insuficiente");
      return;
    }
    const novoSaldo = saldo - produtoPreco;
    setSaldo(novoSaldo);

    ColocarNoHistorico(produtoId, produtoNome, produtoPreco);

    await supabase
      .from("usuarios")
      .update({ saldo: novoSaldo })
      .eq("username", user.username);
  };
  const AdicionarCarrinho = async () => {
    const novoItem = { nome: produtoNome, preco: produtoPreco };
    setCarrinho((prev) => [...prev, novoItem]);
  };

  return (
    <SafeAreaView style={{ flex: 1,  alignItems: "center", backgroundColor: tema.background }}>
      <View style={{width: '100%', height: 60, backgroundColor: tema.background, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        
      >
        <Icon name="chevron-left" color={tema.texto} size={34} />
      </TouchableOpacity>

      <View style={styles.container_img}>
        <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 22 }}>
            FEED
            <Text style={{ color: "#2D7BFF" }}>HUB</Text>
        </Text>
        <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode='contain'
        />

      </View>

      </View>

      <Image 
        style={styles.img} 
        source={{ uri: produtoImg }}
        resizeMode='cover' // Garante que a imagem se ajuste bem
      />
      <Text style={{color: tema.texto, fontWeight: 'bold', fontSize: 30}}>{produtoNome}</Text>
      <Text style={[{ color: tema.textoAtivo, fontSize: 34 }, styles.texto]}>R$ {produtoPreco.toFixed(2).replace('.', ',')}</Text>
      <View style={styles.saldoContainer}>
        <Text style={[styles.saldoLabel, { color: tema.texto }]}>Seu saldo:</Text>
        <Text style={[styles.saldoValor, { color: produtoPreco > saldo ? 'red' : tema.textoAtivo }]}>
            R$ {saldo.toFixed(2).replace('.', ',')}
        </Text>
        </View>
      <Text style={[{color: tema.texto, top: "85%", position: 'absolute', fontSize: 10, fontWeight: '100'}, styles.texto]}>ID do produto: {produtoId}</Text>

      <View style={[styles.footerAcoes, { backgroundColor: tema.background }]}>
        {/* Botão Carrinho */}
        <TouchableOpacity 
            onPress={AdicionarCarrinho} 
            style={[styles.btnAcao, styles.btnCarrinho, { borderColor: tema.textoAtivo }]}
        >
            <Icon name="shopping-basket" color={tema.textoAtivo} size={25} />
            <Text style={[styles.btnTexto, { color: tema.textoAtivo }]}>Adicionar</Text>
        </TouchableOpacity>

        {/* Botão Comprar (Navega para Pagamento) */}
        <TouchableOpacity 
            onPress={() =>
                navigation.navigate("Pagamento", { produtoId, produtoNome, produtoPreco, produtoImg })} 
            style={[styles.btnAcao, styles.btnComprar]}
        >
            <Icon name="credit-card" color="#FFFFFF" size={25} />
            <Text style={[styles.btnTexto, { color: '#FFFFFF' }]}>Comprar Agora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    btn: {
      width: 'auto',
      height: '15',
      padding: 5,
      backgroundColor: '#0096D4',
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: "center"
    },

    texto: {
      fontWeight: 'bold',
    },

    container_img: {
      flexDirection: 'row',
      alignItems: "center",
      width: 150,
      marginRight: 20
  },

  logo: {
    width: '30%',
    height: 30,
  },

  img: {
    width: width * 0.8, // 80% da largura da tela
    height: width * 0.6, // Altura ajustada
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  saldoContainer: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  saldoLabel: {
      fontSize: 16,
      marginRight: 8,
  },
  saldoValor: {
      fontSize: 16,
      fontWeight: 'bold',
  },

  footerAcoes: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#33333333',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto'
  },
  btnAcao: {
    height: 55,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  btnCarrinho: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  btnComprar: {
    flex: 1.5,
    backgroundColor: '#2D7BFF', // Cor primária forte
    shadowColor: '#2D7BFF',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  btnTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

