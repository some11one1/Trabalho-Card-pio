import { View, Text, Button, TextInput } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import { usarTheme } from "../Context/ThemeContext";
import { SafeAreaView } from 'react-native-safe-area-context';

import  Nav_Menu from '../Componentes/nav_menu';

export default function Sobre() {
  const { tema } = usarTheme();
  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", backgroundColor: tema.background }}>
      <Nav_Menu/>
      <Text style={{color: tema.texto}}>Sobre</Text>

    </SafeAreaView>
  );
}
