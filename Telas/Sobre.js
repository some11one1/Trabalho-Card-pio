import { View, Text, Button, TextInput } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import { usarTheme } from "../Context/ThemeContext";
export default function Sobre() {
  const { tema } = usarTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: tema.background }}>
      <Text style={{color: tema.texto}}>Sobre</Text>

    </View>
  );
}
