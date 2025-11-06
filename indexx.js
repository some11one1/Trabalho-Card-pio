import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./Context/AuthContext";

const supabaseUrl = "https://hszlasqgdgkyxnybgyog.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzemxhc3FnZGdreXhueWJneW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODkzMDQsImV4cCI6MjA3NzI2NTMwNH0.YAJqeVxpApOnLkVFo5ORODNw1PJfmZkdNTy9EjGa25c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SegredoContext = createContext();

export const SegredoProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [segredos, setSegredos] = useState([]);
  const [ativos, setAtivos] = useState([]);

  const buscar = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("admin_secrets").select("*");
    if (error) console.log("Erro ao buscar segredos:", error);
    else setSegredos(data);
  };

  const ativar = async (codigo) => {
    const segredo = segredos.find(
      (s) => s.segredo_code.toLowerCase() === codigo.toLowerCase()
    );

    if (segredo) {
      setAtivos((prev) => [...prev, segredo.segredo_code]);
      await supabase
        .from("admin_secrets")
        .update({ ativo: true })
        .eq("id", segredo.id);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    buscar();
  }, [user]);

  // Aqui definimos os efeitos e estilos de cada segredo ativo
  const SecretAtivo = useMemo(() => {
    const ativosConfig = {};

    if (ativos.includes("weathergirl")) {
      ativosConfig["weathergirl"] = {
        backgroundColor: "#3cbfe7ff",
        textColor: "#a9b9bbff",
      };
    }

    return ativosConfig;
  }, [ativos]);

  return (
    <SegredoContext.Provider value={{ segredos, ativos, ativar, SecretAtivo }}>
      {children}
    </SegredoContext.Provider>
  );
};

export const useSegredo = () => useContext(SegredoContext);
