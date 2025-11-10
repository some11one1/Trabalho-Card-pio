import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from "react-native";
import React, { useContext, useEffect } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { ProdutosContext } from "../Context/produtoContext";
import Icon from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';

import Nav_Menu from '../Componentes/nav_menu';

// Pega a largura da tela para cálculo dinâmico da largura do item
const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const margin = 8; // Margem desejada entre os itens (8px)

// Calcula a largura de cada item para caber 3 por linha, considerando a margem
const itemWidth = (screenWidth / numColumns) - (margin * 2); 


export default function Home({ navigation, route }) {
    const { produtos, listarProdutos } = useContext(ProdutosContext);
    const { tema } = usarTheme();

    useEffect(() => {
        listarProdutos();
    }, []);

    // Função que renderiza cada item na FlatList
    const renderProduto = ({ item }) => (
        // 🚨 Aplicamos a largura calculada e a margem aqui
        <TouchableOpacity
            style={[styles.produtoItem, { 
                backgroundColor: tema.cardBackground, 
                margin: margin,
                width: itemWidth, 
            }]}
            onPress={() =>
                navigation.navigate("CardProduto", {
                    produtoId: item.id,
                    produtoPreco: item.Valor,
                    produtoNome: item.Nome,
                    produtoImg: item.img,
                })
            }
        >
            {/* 1. Imagem */}
            <Image 
                style={styles.produtoImage} 
                source={{ uri: item.img }}
                resizeMode="cover" // Garante que a imagem se ajuste bem
            />
            
            {/* 2. Informações (Nome e Preço) */}
            <View style={styles.produtoInfo}>
                <Text numberOfLines={2} style={[styles.produtoNome, { color: tema.texto }]}>
                    {item.Nome}
                </Text>
                <Text style={[styles.produtoValor, { color: tema.textoAtivo }]}>
                    R$ {item.Valor.toFixed(2).replace('.', ',')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView
            style={[
                styles.containerPrincipal,
                { backgroundColor: tema.background }
            ]}
        >
            <Nav_Menu />
            
            <FlatList
                data={produtos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProduto}
                
                // 🚨 Centralizamos o contêiner para alinhar a última linha
                contentContainerStyle={styles.listaContainer}
                numColumns={numColumns} // 3 Colunas
                
                ListEmptyComponent={() => (
                    <View style={styles.vazioContainer}>
                        <Text style={{ color: tema.texto }}>Nenhum produto encontrado.</Text>
                        <TouchableOpacity onPress={listarProdutos}>
                            <Text style={{ color: tema.textoAtivo, marginTop: 10 }}>Tentar Recarregar</Text>
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
    // Estilo para o CONTEÚDO da FlatList (garante centralização das linhas)
    listaContainer: {
        // Remove 'width: 100%' e usa padding/margin para controle
        paddingHorizontal: margin, // Espaço nas laterais da lista
        alignItems: 'center', // 🚨 Centraliza o grupo de colunas na horizontal
        flexGrow: 1, // Permite que a FlatList ocupe o espaço vazio em listas pequenas
    },
    // Estilo para CADA ITEM (TouchableOpacity)
    produtoItem: {
        // Altura fixa para padronizar o grid
        height: 180, 
        
        borderRadius: 8, // Borda arredondada para visual moderno
        borderWidth: 1,
        borderColor: '#ccc4', // Borda sutil
        
        padding: 5,
        alignItems: 'center',
        
        // Remove 'justifyContent: center' para forçar a imagem para cima
    },
    produtoImage: {
        width: '90%', // Imagem ocupa quase toda a largura do card
        height: 80, // Altura fixa para a imagem
        borderRadius: 6,
        marginBottom: 5,
    },
    // Estilo para o Text (Nome e Valor)
    produtoInfo: {
        width: '100%',
        paddingHorizontal: 3,
        paddingBottom: 5,
        justifyContent: 'flex-start',
    },
    produtoNome: {
        fontSize: 12, // Tamanho menor para caber 2 linhas
        fontWeight: 'bold',
        textAlign: 'center',
        height: 30, // Reserva espaço para 2 linhas
    },
    produtoValor: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 4,
    },
    vazioContainer: {
        alignItems: 'center',
        padding: 20,
    }
});