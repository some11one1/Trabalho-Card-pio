import { View, Text, } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import { usarTheme } from "../Context/ThemeContext";
export default function AdminHome() {
  const { tema } = usarTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: tema.background }}>
      <Text style={{color: tema.texto}}>Admin home</Text>
    </View>
  );
}
