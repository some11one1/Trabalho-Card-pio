import { View, Text, Button, TextInput } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import React, { useContext, useEffect } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
export default function Perfil() {

  const { saldo, carregarSaldo } = useContext(WalletContext);
  useEffect(() => {
    carregarSaldo();
  }, []);
  const { tema } = usarTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tema.background,
      }}
    >
      <Text style={{ color: tema.texto }}>Perfil</Text>
      <Text style={{ color: tema.texto }}>saldo: {saldo}</Text>
    </View>
  );
}
