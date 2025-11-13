import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
const HistoricoContext = createContext();

export function HistoricoProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarHistorico = async () => {
      if (!user)  {
        setHistorico([]);
        setCarregando(false);
        return;  
      } 
      
      const chave = `carrinho_${user.id || user.username}`;
      try {
        const historicoSalvo = await AsyncStorage.getItem(chave);
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
  }, [user]);

  async function ColocarNoHistorico(id, nome, preco ) {
    if (!user) {
      return;
    }
    const chave = `carrinho_${user.id || user.username}`;
    try {
      const novoItem = { id, nome, preco, data: new Date() };
      setHistorico((prevHistorico) => {
        const novoHistorico = [...prevHistorico, novoItem];
        AsyncStorage.setItem(chave, JSON.stringify(novoHistorico));
        return novoHistorico;
      })
      
    } catch (error) {
      console.log("Erro ao salvar no historico:", error);
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
