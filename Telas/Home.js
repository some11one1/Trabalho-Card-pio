import { View, Text,  } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import { usarTheme } from "../Context/ThemeContext";
export default function Home() {
  const { tema } = usarTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: tema.background }}>
      <Text style={{color: tema.texto}}>HOME</Text>
    </View>
  );
}
