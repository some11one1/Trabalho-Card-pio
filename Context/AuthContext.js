// AuthContext é um autenticador que guarda o estado do usuario
import { createContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import { supabase } from "../Supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [NovoAtivo, setNovoAtivo] = useState(true);

  // 🔴 ESTADOS DO MODAL
  const [modalSessaoEncerrada, setModalSessaoEncerrada] = useState(false);
  const [mensagemSessao, setMensagemSessao] = useState("");

  // ✅ CARREGAR USUÁRIO SALVO
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("usuario");

        if (usuarioSalvo) {
          const usuario = JSON.parse(usuarioSalvo);

          const { data, error } = await supabase
            .from("usuarios")
            .select("ativo")
            .eq("id", usuario.id)
            .single();

          if (error || !data || data.ativo === false) {
            await AsyncStorage.removeItem("usuario");
            setUser(null);

            setMensagemSessao(
              "Seu usuário foi desativado por um administrador."
            );
            setModalSessaoEncerrada(true);
          } else {
            setUser(usuario);
          }
        }
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarUsuario();
  }, []);

  // ✅ MONITORAR DESATIVAÇÃO EM TEMPO REAL
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("monitorar-usuario")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "usuarios",
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          if (payload.new?.ativo === false) {
            await AsyncStorage.removeItem("usuario");
            setUser(null);

            setMensagemSessao(
              "Seu usuário foi desativado por um administrador."
            );
            setModalSessaoEncerrada(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // ✅ LOGIN
  const loginUser = async (username, senha) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("username", username)
      .eq("senha", senha)
      .single();

    if (error || !data) return false;

    if (data.ativo === false) {
      return { error: "Este usuário está desativado" };
    }

    const usuarioAtualizado = {
      id: data.id,
      username: data.username,
      role: data.is_admin ? "admin" : "user",
      is_admin: !!data.is_admin,
      foto_url: data.foto_url || null,
    };

    setUser(usuarioAtualizado);
    await AsyncStorage.setItem(
      "usuario",
      JSON.stringify(usuarioAtualizado)
    );

    return true;
  };

  // ✅ LOGOUT
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("usuario");
  };

  // ✅ ATUALIZAR PERFIL
  const atualizarUsuario = async (dadosNovos) => {
    if (!user) return false;

    const { error } = await supabase
      .from("usuarios")
      .update(dadosNovos)
      .eq("id", user.id);

    if (error) {
      console.log("Erro ao atualizar usuário:", error);
      return false;
    }

    const usuarioAtualizado = { ...user, ...dadosNovos };

    setUser(usuarioAtualizado);
    await AsyncStorage.setItem(
      "usuario",
      JSON.stringify(usuarioAtualizado)
    );

    return true;
  };

  // ✅ CRIAR USUÁRIO (ADMIN)
  const CriarUsuario = async (username, senha, is_admin = false) => {
    const { error } = await supabase.from("usuarios").insert([
      {
        username,
        senha,
        is_admin: !!is_admin,
        ativo: true,
      },
    ]);

    if (error) {
      console.log("Erro ao criar usuário:", error);
      return false;
    }

    return true;
  };

  // ✅ ATIVAR / DESATIVAR USUÁRIO
  const TrocarEstadoUser = async (userId) => {
    if (user?.id === userId) {
      if (Platform.OS === "web") {
        alert("Você não pode se desativar.");
      } else {
        alert("Você não pode se desativar.");
      }
      return false;
    }

    setNovoAtivo(!NovoAtivo);

    const { error } = await supabase
      .from("usuarios")
      .update({ ativo: !NovoAtivo })
      .eq("id", userId);

    if (error) {
      console.log("Erro ao alterar estado do usuário:", error);
      return false;
    }

    return true;
  };

  // ✅ LISTAR USUÁRIOS
  const ListarUsuarios = async () => {
    const { data, error } = await supabase.from("usuarios").select("*");

    if (error) {
      console.log("Erro ao listar usuários:", error);
      return [];
    }

    setUsuarios(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        carregando,
        usuarios,

        loginUser,
        logout,
        atualizarUsuario,
        CriarUsuario,
        TrocarEstadoUser,
        ListarUsuarios,

        // 🔴 MODAL
        modalSessaoEncerrada,
        setModalSessaoEncerrada,
        mensagemSessao,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
