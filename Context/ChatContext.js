import { createContext, useEffect, useState } from "react";
import { supabase } from "../Supabase"; 
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");

async function buscaUsuario(params) {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", params)
      .single();

    if (error) {
      console.log("Erro ao buscar usuario:", error);
      return null;
    }
    return data;
}
useEffect(() => {
  if (!user) return;

  const carregar = async () => {
    const { data } = await supabase
      .from("mensagens")
      .select("id, usuario_id, conteudo, criado_em")
      .order("criado_em", { ascending: true });
    const mensagensComUsuario = await Promise.all(
      data.map(async (msg) => {
        const usuario = await buscaUsuario(msg.usuario_id);
        return { ...msg, usuario };
      })
    );

    setMensagens(mensagensComUsuario);
  };

  carregar();
}, [user]);

  useEffect(() => {
     if (!user) return;

    const canal = supabase
      .channel("mensagens-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensagens" },
        async (payload) => {
            const novaMsg = payload.new;
            const usuario = await buscaUsuario(novaMsg.usuario_id);
                
          setMensagens((prev) => [...prev, { ...novaMsg, usuario },]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, [user]);

  const enviarMensagem = async () => {
    if (!user) return;
    if (!texto.trim()) return;

    await supabase.from("mensagens").insert({
      usuario_id: user?.id ?? 0,
      conteudo: texto,
    });

    setTexto("");
  };

  return (
    <ChatContext.Provider
      value={{
        mensagens,
        texto,
        setTexto,
        enviarMensagem,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
