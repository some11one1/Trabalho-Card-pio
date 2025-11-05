import { supabase } from "../Supabase";
import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
export const WalletContext = createContext(); //cria o contexto


export const WalletProvider = ({ children }) => {
    const [saldo, setSaldo] = useState(0); // estado do saldo, começa em 0
    const { user } = useContext(AuthContext); // pega o usuario do AuthContext

    const carregarSaldo = async () => {
        if (!user || !user.username) return;
        const { data, error } = await supabase
        .from("usuarios")
        .select("saldo")
        .eq("username", user.username)
        .single();

        if (error) {
            console.log("Erro ao carregar saldo:", error);
            return; // retorna 0 em caso de erro
            }
      setSaldo(data.saldo);
      return data.saldo;


    }
  useEffect(() => {
    if (user) {
      carregarSaldo();
    }
  }, [user]);

    return (
        <WalletContext.Provider value= {{saldo, setSaldo, carregarSaldo}}>
            {children}
        </WalletContext.Provider>
    )
} 