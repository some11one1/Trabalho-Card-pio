import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isModoEscuro, setIsModoEscuro] = useState(false);

  useEffect(() => {
    const carregarTema = async () => {
      try {
        const temaSalvo = await AsyncStorage.getItem("tema");
        if (temaSalvo !== null) {
          setIsModoEscuro(temaSalvo === "escuro");
        }
      } catch (error) {
        console.log("Erro ao carregar tema:", error);
      }
    };

    carregarTema();
  }, []);
  const TrocarTheme = () => {
    setIsModoEscuro((prevState) => !prevState);
    AsyncStorage.setItem("tema", !isModoEscuro ? "escuro" : "claro");
  };
 
  const tema = useMemo(() => {
    return {
      background: isModoEscuro ? "#121212" : "#EDEDED",
      texto: isModoEscuro ? "#EDEDED" : "#121212",
      textoReverse: isModoEscuro ? "#FFFFFF" : "#EDEDED",
      textoAtivo: isModoEscuro ? "#869cfcff" : "#314096ff",
      cardBackground: isModoEscuro ? "#000000" : "#FFFFFF",
      borda: isModoEscuro ? "#ccc4" : "#080808",
      iconEstoque: isModoEscuro ? "#FF9400" : "#19619C",
    };
  }, [isModoEscuro]);
  return (
    <ThemeContext.Provider value={{ isModoEscuro, TrocarTheme, tema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const usarTheme = () => useContext(ThemeContext);
