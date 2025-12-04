import { View, Text } from "react-native";
import { usarTheme } from "../Context/ThemeContext";
import { SafeAreaView } from 'react-native-safe-area-context';

import Nav_Menu from '../Componentes/nav_menu';

export default function Sobre() {
  const { tema } = usarTheme();

  const widht_title = "55%";

  
  const estiloNome = {
    color: tema.texto,
    fontSize: 24,       
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.background }}>
      <Nav_Menu />

      <View style={{ alignItems: "center" }}>
        <Text style={{ color: tema.texto, fontSize: 25, fontWeight: 'bold' }}>
          Créditos
        </Text>
      </View>

      {/* DESIGNER */}
      <View style={{
        backgroundColor: tema.background,
        width: widht_title,
        height: 70,
        borderWidth: 5,
        borderColor: tema.borda,
        justifyContent: 'center',
        padding: 10,
      }}>
        <Text style={{ color: tema.texto, fontSize: 17, fontWeight: 'bold' }}>
          Diretor Geral De Estilização Estrutural e Arquitetura Visual
        </Text>
      </View>
      <Text style={estiloNome}>Diego</Text>

      {/* PROGRAMADOR */}
      <View style={{
        backgroundColor: tema.background,
        width: widht_title,
        height: 70,
        borderWidth: 5,
        borderColor: tema.borda,
        justifyContent: 'center',
        padding: 10,
      }}>
        <Text style={{ color: tema.texto, fontSize: 17, fontWeight: 'bold' }}>
          Engenheiro Principal de Sistemas, Estrutura de código e automoção
        </Text>
      </View>
      <Text style={estiloNome}>Gustavo</Text>

      {/* SQL DEV */}
      <View style={{
        backgroundColor: tema.background,
        width: widht_title,
        height: 70,
        borderWidth: 5,
        borderColor: tema.borda,
        justifyContent: 'center',
        padding: 10,
      }}>
        <Text style={{ color: tema.texto, fontSize: 17, fontWeight: 'bold' }}>
          Engenheiro Principal De Modelagem, Otimização e Infraestrutura De Dados
        </Text>
      </View>
      <Text style={estiloNome}>Luiz</Text>

    </SafeAreaView>
  );
}