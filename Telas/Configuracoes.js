import { SegredoContext } from "../indexx";
import { AuthContext } from "../Context/AuthContext";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useContext, useEffect } from "react";
import { usarTheme } from "../Context/ThemeContext";
import { useAnuncio } from "../Context/AnuncioContext";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Configuracoes() {
  const { chanceMostrarAnuncio } = useAnuncio();
  const { user } = useContext(AuthContext);

  const { tema, TrocarTheme, isModoEscuro } = usarTheme();

  const [segredo, setSegredo] = useState(false);

  useEffect(() => {
    if (Number(user?.id) === 15) setSegredo(true);
  }, [user]);

  const limparAsync = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Sucesso", "Todo o AsyncStorage foi limpo.");
    } catch (error) {
      console.log("Erro ao limpar asyncstorage", error);
    }
  };

  const corBotaoDanger = isModoEscuro ? "#FFFFFF" : tema.perigo;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.background }]}>

      
      <Text style={[styles.title, { color: tema.texto }]}>
        Configurações
      </Text>

     
      <View style={[styles.card, { backgroundColor: tema.cardBackground }]}>
        <Text style={[styles.cardTitle, { color: tema.texto }]}>
          Aparência
        </Text>

        
        <TouchableOpacity
          style={[styles.option, { borderColor: tema.borda }]}
          onPress={() => {
            chanceMostrarAnuncio();
            TrocarTheme();
          }}
        >
          <Text style={[styles.optionText, { color: tema.texto }]}>
            Tema: {isModoEscuro ? "Escuro" : "Claro"}
          </Text>

          <Feather
            name={isModoEscuro ? "sun" : "moon"}
            size={22}
            color={tema.texto}
          />
        </TouchableOpacity>
      </View>

      
      <TouchableOpacity
        style={[
          styles.bigDangerButton,
          { borderColor: corBotaoDanger }
        ]}
        onPress={limparAsync}
      >
        <Feather name="trash-2" size={24} color={corBotaoDanger} />
        <Text style={[styles.bigDangerButtonText, { color: corBotaoDanger }]}>
        Limpar AsyncStorage
        </Text>
      </TouchableOpacity>

    
      {segredo && (
        <View style={[styles.secretBox, { borderColor: tema.borda }]}>
          <TextInput
            style={[
              styles.secretInput,
              { color: tema.texto, borderColor: tema.borda }
            ]}
            placeholder="Insira..."
            placeholderTextColor={tema.textoSecundario}
          />
        </View>   
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
  },

  card: {
    padding: 18,
    borderRadius: 14,
    marginBottom: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  option: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },

  bigDangerButton: {
    marginTop: 5,
    borderWidth: 2,
    paddingVertical: 15,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  bigDangerButtonText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1,
  },

  secretBox: {
    marginTop: 20,
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
  },

  secretInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
});
