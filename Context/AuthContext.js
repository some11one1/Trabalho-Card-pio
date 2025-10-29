//AuthContext é um autenticador que guarda o estado do usuario (logado ou não, e se é admin ou não)
import { createContext, useState } from "react";
import { supabase } from "../Supabase";
export const AuthContext = createContext(); //cria o contexto

// cria o provider q é um coponente que envolve todo o app
export const AuthProvider = ({ children }) => { // children é todo o app
  //estado do usuario
  const [user, setUser] = useState(null); // cria um estado pro usuario, por padrão é null ou seja, ninguem logado

  // função pra loga
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

    const isAdmin = Boolean(data.is_admin); // converte em booleano (nem deve fazer diferença pq ja é booleano no SupaBase ahhhhhh (odeio esse java.lang ain ain nao pode ser string)
    setUser({
      // atualiza o estado do usuario com os dados retornados
      id: data.id, // lembra do data na linha 13? é como se fosse um array, ai tem coisinhas do data, data.username, data.senha, etc
      //e basicamente isso esta colocando esses dados no user (linha 9), tipo. o id vai ser o data.id
      username: data.username,
      role: isAdmin ? "admin" : "user", // se isAdmin for true, role é admin, se não, é user, essa informação vem do supabase
      is_admin: isAdmin, // essa linha só existe pq eu fiquei 3 horas com o erro de string nao pode ser sei la o que booleana (ela não faz nada, mas vai ficar ai mesmo, mesmo coisa com a linha 23)
    });
    return true; // retorna que é verdade, ou seja, deu certo, siginifica que o usuario foi logado com sucesso
  };

  // func pra deslogar
  const logout = () => {
    setUser(null); // uau! se voce clicar pra sair da sua conta, o app voltar a ficar sem contar, mágica! (não esquecer de colocar isso no botão de logout depois)
  };

  // funcao pro admin criar usúarios
  const CriarUsuario = async (username, senha, is_admin = false) => { //usa os parametros username, senha e is_admin pra fazer o novo usuario
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

  // retorna o user (estado do usuario), loginUser (função de logar), logout (função de deslogar) e CriarUsuario (função de criar usuario) pro resto do app
  //como por exemplo  foi usado no App.js e o Login.js
 
  return (
    <AuthContext.Provider
      value={{ user, loginUser, logout, CriarUsuario }}
    >
       
    {children}
    </AuthContext.Provider>
  );
}