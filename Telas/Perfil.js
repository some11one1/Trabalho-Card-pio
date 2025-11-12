import { View, Text, Button, TextInput, Modal } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import React, { useContext, useEffect, useState } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
import { SafeAreaView } from 'react-native-safe-area-context';

import  Nav_Menu from '../Componentes/nav_menu';

export default function Perfil() {
  const [modalVisivel, setModalVisivel] = useState(false)
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
      <Nav_Menu />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View>
          <Text style={{ color: tema.texto }}>Perfil</Text>
          <Text style={{ color: tema.texto }}>saldo: {saldo}</Text>
          <Button
            title="Recarregar"
            onPress={() => setModalVisivel(!modalVisivel)}
          />
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Modal
            transparent={true}
            animationType="fade"
            visible={modalVisivel}
            onRequestClose={() => setModalVisivel(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 250,
                  backgroundColor: "white",
                  borderRadius: 15,
                  padding: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 5, // sombra no Android
                  shadowColor: "#000", // sombra no iOS
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                }}
              >
                <Text style={{ fontSize: 18, marginBottom: 10 }}>
                  Recarregar Saldo
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {["10", "25", "50", "100"].map((v) => (
                    <View key={v} style={{ margin: 5 }}>
                      <Button
                        title={`R$${v}`}
                        onPress={() => confirmarRecarga(v)}
                      />
                    </View>
                  ))}
                </View>

                <View style={{ marginTop: 15 }}>
                  <Button
                    title="Fechar"
                    color="red"
                    onPress={() => setModalVisivel(false)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}





     