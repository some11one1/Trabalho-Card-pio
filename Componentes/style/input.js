import { View, TextInput, Animated, TouchableOpacity } from "react-native";
import { useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { usarTheme } from "../../Context/ThemeContext";


export function InputModerno({ value, onChangeText, placeholder, secure }) {
  const { tema } = usarTheme();
  const [visivel, setVisivel] = useState(false);

  // animação da borda
  const borderAnim = useRef(new Animated.Value(0)).current;

  function onFocus() {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function onBlur() {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [tema.borda, tema.textoAtivo],
  });

  return (
    <Animated.View
      style={{
        borderWidth: 2,
        borderColor,
        borderRadius: 12,
        marginVertical: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: tema.background,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tema.texto + "80"}
        secureTextEntry={secure ? !visivel : false}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ 
          color: tema.texto, 
          fontSize: 16, 
          flex: 1 
        }}
      />

      {/* MOSTRAR ÍCONE APENAS SE FOR SENHA */}
      {secure && (
        <TouchableOpacity onPress={() => setVisivel(!visivel)}>
          <Feather
            name={visivel ? "eye" : "eye-off"}
            size={22}
            color={tema.texto}
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}