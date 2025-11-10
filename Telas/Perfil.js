import { View, Text, Button, TextInput } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import React, { useContext, useEffect } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
import { SafeAreaView } from 'react-native-safe-area-context';

import  Nav_Menu from '../Componentes/nav_menu';

export default function Perfil() {

  const { saldo, carregarSaldo } = useContext(WalletContext);
  useEffect(() => {
    carregarSaldo();
  }, []);
  const { tema } = usarTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: tema.background,
      }}
    >
      <Nav_Menu/>
      <Text style={{ color: tema.texto }}>Perfil</Text>
      <Text style={{ color: tema.texto }}>saldo: {saldo}</Text>
    </SafeAreaView>
  );
}
