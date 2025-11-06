import { View, Text, StyleSheet, TouchableOpacity } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import { usarTheme } from "../Context/ThemeContext";
import Icon from "react-native-vector-icons/Entypo";
export default function AdminHome({ navigation, route }) {
  const navigate = navigation;
  const nomeDaTela = route.name;
  const { tema } = usarTheme();
  return (
    <View style={[{ backgroundColor: tema.background }, styles.container]}>
      <View style={styles.menu_nav}>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={styles.btn_menu}
        >
          <Icon name="menu" color="#FFFF" size={24} />
        </TouchableOpacity>
        <Text style={{ color: tema.texto }}>{route.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  text_white: {},

  menu_nav: {
    width: "100%",
    height: 60,
    backgroundColor: "black",
    alignItems: "center",
    flexDirection: "row",
  },

  btn_menu: {
    width: 24,
    marginLeft: 20,
  },
});
