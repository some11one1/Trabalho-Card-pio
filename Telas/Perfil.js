import { View, Text, Button, TextInput, Modal, TouchableOpacity } from "react-native"; //  >>>>> não esquece de importar aqui se for colocar coisas tipo TouchableOpacity
import React, { useContext, useEffect, useState } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { WalletContext } from "../Context/WalletContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from "../Supabase";
import  Nav_Menu from '../Componentes/nav_menu';
import { AuthContext } from "../Context/AuthContext";
import { useAnuncio } from "../Context/AnuncioContext";

export default function Perfil() {
  const { chanceMostrarAnuncio} = useAnuncio()
  const [modalVisivel, setModalVisivel] = useState(false)
  const { saldo, setSaldo, carregarSaldo, saldoBanco, setSaldoBanco, carregarSaldoBanco} = useContext(WalletContext);
  const { user } = useContext(AuthContext);


  const confirmarRecarga = async (valor) => {
    chanceMostrarAnuncio()
    if (saldoBanco >= valor) {
    const novoSaldo = saldo + valor
    const novoSaldoBanco = saldoBanco - valor
    setSaldo(novoSaldo)
    setSaldoBanco(novoSaldoBanco)
    const { error } = await supabase
      .from("usuarios")
      .update({ saldo: novoSaldo, saldoBanco: novoSaldoBanco })
      .eq("id", user.id);
   if (error) {
    console.log("erro ao atualizar saldo");
    setSaldo(saldo)
    setSaldoBanco(saldoBanco)
  }
  }else {
    alert("ta sem dinheiro pobre")
      console.log(saldoBanco)
    }
}
  useEffect(() => {
    carregarSaldo();
    carregarSaldoBanco()
  
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
          <Text style={{ color: tema.texto, fontSize: 34, fontWeight: "bold" }}>Olá, {user.username}</Text>
          <Text style={{ color: tema.texto, fontSize: 25, }}>saldo: R$:{saldo}</Text>


        </View>

        <TouchableOpacity
          onPress={() => setModalVisivel(!modalVisivel)}
          style={{
            position: "absolute",
            bottom: 30,
            backgroundColor: tema.cardBackground,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderWidth: 2,
            borderRadius: 10,
            borderColor: tema.textoAtivo,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: tema.texto, fontSize: 22 }}>Recarregar</Text>
        </TouchableOpacity>

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
                  elevation: 5,
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
                        onPress={() => confirmarRecarga(Number(v))} //converte em numero
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