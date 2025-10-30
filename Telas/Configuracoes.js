import { View, Text, Button, TextInput } from "react-native";
import { useState, useContext} from "react";
 import { usarTheme,} from "../Context/ThemeContext";

export default function Configuracoes() {
  const { tema, TrocarTheme } = usarTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: tema.background }}>
      <Text style={{ color: tema.texto}}>Tela de Configurações</Text>
     <Button title="Modo escuro/claro"  onPress={TrocarTheme} /> 
    
    </View>
  );
}
