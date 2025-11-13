import { SegredoContext } from "../indexx";
import { AuthContext } from "../Context/AuthContext";
import { View, Text, Button, TextInput, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useContext, useEffect } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { useAnuncio } from "../Context/AnuncioContext";
export default function Configuracoes() {
  const { chanceMostrarAnuncio} = useAnuncio()
  const [segredo, setSegredo] = useState(false);
  const { user } = useContext(AuthContext);
  const LLL = async () => {
    setSegredo(true);
  };
  useEffect(() => {
    if (user && user.id === 15) {
      LLL();
    }
  }, [user]);

  const { tema, TrocarTheme } = usarTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tema.background,
      }}
    >
      <Text style={{ color: tema.texto }}>Tela de Configurações</Text>
      <Button title="Modo escuro/claro" onPress={async () => {
        await chanceMostrarAnuncio()
        TrocarTheme()}} />
      <Button title="limpar todo o AsyncStorage" onPress={ async () => 
      { try { await  AsyncStorage.clear() 
      }catch (error) {
        console.log('erro clear asyncstorage', error)
    }
      }} /> 
      {segredo ? (
        <TextInput
          style={{ width: 100, height: 40, borderWidth: 1 }}
          placeholder="insira."
        ></TextInput>
      ) : null}
    </View>
  );
}
