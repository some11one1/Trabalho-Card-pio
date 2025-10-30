// vai puxar do Supabase as listas dos produtos
import { supabase } from "../Supabase";
import { createContext, useState, useEffect } from "react";

export const ProdutosContext = createContext();

export const ProdutosProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);

  const listarProdutos = async () => {
    const { data, error } = await supabase.from("produtos").select("*");
    if (error) {
      console.log("Erro ao listar produtos:", error);
      return [];
    }
    setProdutos(data);
    return data;
  };
  useEffect(() => {
    listarProdutos();
  }, []);

  return (
    <ProdutosContext.Provider value={{ produtos, setProdutos, listarProdutos }}>
      {children}
    </ProdutosContext.Provider>
  );
};
