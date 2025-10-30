import { createContext, useContext, useMemo, useState, } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isModoEscuro, setIsModoEscuro] = useState(false);

  const TrocarTheme = () => {
    setIsModoEscuro((prevState) => !prevState);
  }

  const tema = useMemo(() => {
    return {
      background: isModoEscuro ? "#121212" : "#EDEDED",
      texto: isModoEscuro ? "#EDEDED" : "#121212",
      textoAtivo: isModoEscuro ? "#869cfcff" : "#314096ff",

    };
  }, [isModoEscuro]);
  return (
    <ThemeContext.Provider value={{ isModoEscuro, TrocarTheme, tema }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const usarTheme = () => useContext(ThemeContext);