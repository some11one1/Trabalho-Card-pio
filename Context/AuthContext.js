//AuthContext é um autenticador que guarda o estado do usuario (logado ou não, e se é admin ou não)
import { createContext, useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { supabase } from "../Supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthContext = createContext(); //cria o contexto

// cria o provider q é um coponente que envolve todo o app
export const AuthProvider = ({ children }) => {
  // children é todo o app
  //estado do usuario
  const [user, setUser] = useState(null); // cria um estado pro usuario, por padrão é null ou seja, ninguem logado
  const [carregando, setCarregando] = useState(true);
  const [NovoAtivo, setNovoAtivo] = useState(true);
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("usuario");

        if (usuarioSalvo) {
          const user = JSON.parse(usuarioSalvo);

          const { data, error } = await supabase
            .from("usuarios")
            .select("ativo")
            .eq("id", user.id)
            .single();

          if (error || !data || data.ativo === false) {
            await AsyncStorage.removeItem("usuario");
            setUser(null);
            Alert.alert(
              "Sessão encerrada",
              "Seu usuário foi desativado por um administrador."
            );
          } else {
            setUser(user);
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

            Alert.alert(
              "Sessão encerrada",
              "Seu usuário foi desativado por um dministrador."
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  // função pra logar
  const loginUser = async (username, senha) => {
    // async significa que a função é assíncrona, ou seja, pode demorar pra responder e que não trava o código enquanto espera resposta E permite usar await
    const { data, error } = await supabase // o await espera a resposta do supabase | o data é um objeto com os dados retornados
      .from("usuarios") // da tabela usuarios, pega o usuario com esse username e senha
      .select("*") // seleciona tudo
      .eq("username", username) // filtro por username
      .eq("senha", senha) // filtro por senha
      .single(); // pega só um

    if (error || !data) {
      return false; // retorna falso se der erro ou n achar usuario
    }
    if (data.ativo === false) {
      return { error: "Este usuário está desativado" };
    }
    const isAdmin = Boolean(data.is_admin); // converte em booleano (nem deve fazer diferença pq ja é booleano no SupaBase ahhhhhh (odeio esse java.lang ain ain nao pode ser string)
    const usuarioAtualizado = {
      id: data.id,
      username: data.username,
      role: isAdmin ? "admin" : "user",
      is_admin: isAdmin,
      foto_url: data.foto_url || null,
    };

    setUser(usuarioAtualizado);
    await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

    return true;
  };

  // func pra deslogar
  const logout = () => {
    setUser(null); // uau! se voce clicar pra sair da sua conta, o app voltar a ficar sem contar, mágica! (não esquecer de colocar isso no botão de logout depois)
    AsyncStorage.removeItem("usuario"); // remove o usuario salvo no AsyncStorage
  };
  const atualizarUsuario = async (dadosNovos) => {
    if (!user) return false;

    const { data, error } = await supabase
      .from("usuarios")
      .update(dadosNovos)
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("Erro ao atualizar usuário:", error);
      return false;
    }

    const usuarioAtualizado = {
      ...user,
      ...dadosNovos,
    };

    setUser(usuarioAtualizado);

    await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

    return true;
  };
  // funcao pro admin criar usúarios
  const CriarUsuario = async (username, senha, is_admin = false) => {
    //usa os parametros username, senha e is_admin pra fazer o novo usuario
    //  função que pega username, senha e is_admin (padrão é falso)
    const { data, error } = await supabase
      .from("usuarios") // da tabela usuarios
      // insere um novo usuario com username, senha e se é admin ou não (vai dar dorzinha de cabeça fazer isso depois)
      .insert([{ username, senha, is_admin: !!is_admin }]); // o !!is_admin transforma em booleano (99% de chance de nao fazer nada pq ja é booleano no SupaBase ent dava pra deixar só is_admin msm)

    if (error) {
      // meu deus???  e se der erro???? o que acontece se der erro???
      console.log("Erro ao criar usuario:", error); // absolute cinema
      return false;
    }
    return true; // retorna que deu certo, isso significa que o usuario foi criado com sucesso
  };
  const [usuarios, setUsuarios] = useState([]);
  const TrocarEstadoUser = async (userId) => {
    if (user && user.id === userId) {
      if (Platform.OS === "web") {
        alert(
          "Você não pode desativar você mesmo. seu curioso, achou que ia conseguir? achou errado ótario"
        );
      } else {
        Alert.alert(
          "Erro",
          "Você não pode desativar você mesmo. seu curioso, achou que ia conseguir? achou errado ótario"
        );
      }
      return false; // impede o usuario de se desativar
    }
    setNovoAtivo(!NovoAtivo);
    const { data, error } = await supabase

      .from("usuarios")
      .update({ ativo: !NovoAtivo })
      .eq("id", userId);
    if (error) {
      console.log("Erro ao desativar usuario:", error);
      return false;
    }
  };
  const ListarUsuarios = async () => {
    const { data, error } = await supabase.from("usuarios").select("*");
    if (error) {
      console.log("Erro ao listar usuarios:", error);
      return []; // retorna array vazio em caso de erro
    }
    setUsuarios(data); // atualiza o estado com a lista de usuarios
    return data;
  };
  // retorna o user (estado do usuario), loginUser (função de logar), logout (função de deslogar) e CriarUsuario (função de criar usuario) pro resto do app
  //como por exemplo  foi usado no App.js e o Login.js

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        logout,
        CriarUsuario,
        TrocarEstadoUser,
        ListarUsuarios,
        usuarios,
        carregando,
        atualizarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
