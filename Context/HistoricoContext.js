import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoricoContext = createContext();

export function HistoricoProvider({ children }) {
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const historicoSalvo = await AsyncStorage.getItem("historico");
        if (historicoSalvo) {
          setHistorico(JSON.parse(historicoSalvo));
        }
      } catch (error) {
        console.log("Erro ao carregar histórico:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarHistorico();
  }, []);

  async function ColocarNoHistorico(id, nome, preco ) {
    try {
      const novoItem = { id, nome, preco, data: new Date() };
      const novoHistorico = [...historico, novoItem];

      setHistorico(novoHistorico);

      await AsyncStorage.setItem("historico", JSON.stringify(novoHistorico));
    } catch (error) {
      console.log("Erro ao salvar no histórico:", error);
    }
  }

  return (
    <HistoricoContext.Provider
      value={{ historico, ColocarNoHistorico, carregando }}
    >
      {children}
    </HistoricoContext.Provider>
  );
}

export function useHistorico() {
  return useContext(HistoricoContext);
}
