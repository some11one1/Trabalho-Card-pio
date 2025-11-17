import { SegredoContext } from "../indexx";
import { AuthContext } from "../Context/AuthContext";
import { View, Text, Button, TextInput, TouchableOpacity, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useContext, useEffect } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { useAnuncio } from "../Context/AnuncioContext";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Configuracoes() {
  const { chanceMostrarAnuncio} = useAnuncio()
  const [segredo, setSegredo] = useState(false);
  const { user } = useContext(AuthContext);
  const { isModoEscuro } = usarTheme();


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
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: tema.background,
      }}
    >
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{ color: tema.texto, fontSize: 24, fontWeight: "bold", marginBottom: 10, }}>Tela de Configurações</Text>
        <TouchableOpacity style={{backgroundColor: tema.background, width: 30, height: "auto", marginLeft: 'auto', borderWidth: 2, padding: 2, borderRadius: 15, borderColor: tema.textoAtivo, shadowColor: tema.textoAtivo, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 5,}}
        onPress={async () => {
          await chanceMostrarAnuncio()
          TrocarTheme()}}>
          <Feather
            name={isModoEscuro ? 'sun' : 'moon'} 
            size={22}
            color= {tema.texto}
            
          />
        </TouchableOpacity>

      </View>
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
    </SafeAreaView>
  );
}
