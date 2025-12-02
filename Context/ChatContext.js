import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../Supabase";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");

  async function buscaUsuario(id) {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
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

          setMensagens((prev) => [...prev, { ...novaMsg, usuario }]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, [user]);

  const enviarMensagem = async () => {
    if (!user) return;
    if (!texto.trim()) return;

    const foiComando = await Comandos(texto);
    if (foiComando) {
      setTexto("");
      return;
    }

    await supabase.from("mensagens").insert({
      usuario_id: user.id,
      conteudo: texto,
    });

    setTexto("");
  };

  async function Comandos(texto) {
    if (!texto.startsWith("/")) return false;

    if (user?.is_admin !== true) return true;

    const cmd = texto.slice(1).trim().toLowerCase();

   if (cmd.startsWith("clear")) {
    
     const partes = cmd.split(" ");
     let quantidade = parseInt(partes[1]);

     if (isNaN(quantidade) || quantidade <= 0) {
       quantidade = 200;
     }

     const { data: msgs, error } = await supabase
       .from("mensagens")
       .select("id")
       .order("criado_em", { ascending: false })
       .limit(quantidade);

     if (error) {
       console.error("Erro ao buscar mensagens:", error);
       return true;
     }

     if (!msgs || msgs.length === 0) {
       console.warn("Nenhuma mensagem encontrada para apagar.");
       return true;
     }

     const ids = msgs.map((m) => m.id);

     const { error: deleteError } = await supabase
       .from("mensagens")
       .delete()
       .in("id", ids);

     if (deleteError) {
       console.error("Erro ao deletar mensagens:", deleteError);
       return true;
     }

     // Remove da tela também
     setMensagens((prev) => prev.filter((msg) => !ids.includes(msg.id)));

     return true;
   }

    return true;
  }

  return (
    <ChatContext.Provider
      value={{
        mensagens,
        texto,
        setTexto,
        enviarMensagem,
        Comandos,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
