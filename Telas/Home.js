import { View, Text, StyleSheet, TouchableOpacity } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import React, { useContext,  } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { ProdutosContext, } from "../Context/produtoContext";
import Icon from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';

import  Nav_Menu from '../Componentes/nav_menu';


export default function Home({navigation, route}) {
  const { produtos, listarProdutos } = useContext(ProdutosContext);

  const navigate = navigation;
  const nomeDaTela = route.name;

  const { tema } = usarTheme();
  return (
    <SafeAreaView
      style={{flex: 1,
        alignItems: "center",
        backgroundColor: tema.background,}}
    >
      <Nav_Menu/>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },

  text_white: {
    
  },

  menu_nav: {
    width: '100%',
    height: 60,
    backgroundColor: 'black',
    alignItems: 'center',
    flexDirection: 'row'

  },

  btn_menu: {
    width: 24,
    marginLeft: 20,
  }
}); 