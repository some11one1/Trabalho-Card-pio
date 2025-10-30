import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

// só ta importando todos os bagulhos necessários

import { AuthProvider, AuthContext } from "./Context/AuthContext";
import { ThemeProvider, usarTheme } from "./Context/ThemeContext";

import ConfigUsuarios from "./Telas/ConfigUsuarios";
import AdminHome from "./Telas/AdminHome";
import Home from "./Telas/Home";
import Login from "./Telas/Login";
import Perfil from "./Telas/Perfil";
import Historico from "./Telas/Historico";
import Sobre from "./Telas/Sobre";
import Configuracoes from "./Telas/Configuracoes";

import React, { useContext } from "react";
import { Alert, Platform } from "react-native";
import { ProdutosProvider } from "./Context/produtoContext";

// Tabs

//cada Tab.Screen é uma aba, com nome e componente, componente é o que foi importando lá em cima, tem que ser mesmo nome, já o name tanto faz

const Tab = createBottomTabNavigator(); // o const Tab cria o navegador de abas (tabs) é a coisa que fica la em baixo do app pra alterar entre si quando aperta, tipo home, historico, etc
// função que retorna as tabs pro usuario normal]
//cria o navegador de abas}

export const UserTabs = () => {
  const { tema } = usarTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tema.background },
        headerTintColor: tema.texto,
        tabBarStyle: { backgroundColor: tema.background },
        tabBarActiveTintColor: tema.textoAtivo,
        tabBarInactiveTintColor: tema.texto,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Histórico" component={Historico} />
      <Tab.Screen name="Configurações" component={Configuracoes} />
    </Tab.Navigator>
  );
};

// mesma coisa só que pro admin
export const AdminTabs = () => {
  const { isModoEscuro } = usarTheme();
  const temaAdaptativo = isModoEscuro ? "#121212" : "#EDEDED";
  const temaAdaptativoTexto = isModoEscuro ? "#EDEDED" : "#121212";

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: temaAdaptativo }, // muda a cor do header conforme o tema
        headerTintColor: temaAdaptativoTexto, // muda a cor do texto do header conforme o tema
        tabBarStyle: { backgroundColor: temaAdaptativo }, // muda a cor da tab bar conforme o tema
        tabBarActiveTintColor: isModoEscuro ? "#869cfcff" : "#314096ff", // muda a cor do texto ativo (ativo = quando selecionado) da tab conforme o tema
        tabBarInactiveTintColor: temaAdaptativoTexto, // muda a cor do texto inativo (inativo = quando nao selecionado) da tab conforme o tema
      }}
    >
      <Tab.Screen name="Gerenciar Cardápio" component={AdminHome} />
      <Tab.Screen name="Configurar Usuários" component={ConfigUsuarios} />
      <Tab.Screen name="Configurações" component={Configuracoes} />
    </Tab.Navigator>
  );
};

const Drawer = createDrawerNavigator(); // mesmo que o tab, só que pro drawer (menu lateral)
// função que retorna o drawer, que vai ter as tabs dentro e diferente se for admin ou user
// pega o estado do usuario do AuthContext para saber se é adz  min ou user
// define quais serão as TABS (linha 28) baseado se o usuario é admin ou não | o user? vê se o user existe, server pra nao dar erro caso ele naoe exista
const HomeDrawer = () => {
  const { tema } = usarTheme();
  const { user, logout } = useContext(AuthContext);

  const confirmarLogout = () => {
    if (Platform.OS === "web") {
      // se estiver rodando na web vai só mandar o prompt básico pra deslogar
      const confirmar = window.confirm("Você tem certeza que quer DesLogar?");
      if (confirmar) {
        logout();
      }
      return;
    } else {
      // função que confirma se o usuario quer deslogar
      Alert.alert("Deslogar", "Você tem certeza que quer DesLogar?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: () => logout() },
      ]);
    }
  };
  return (
    <Drawer.Navigator
      screenOptions={() => ({
        headerStyle: { backgroundColor: tema.background }, // muda a cor do header conforme o tema
        headerTintColor: tema.texto, // muda a cor do texto do header conforme o tema
        drawerStyle: {
          // muda a cor do drawer conforme o tema
          backgroundColor: tema.background,
        },
        drawerActiveTintColor: tema.textoAtivo, // muda a cor do texto ativo (ativo = quando selecionado) do drawer conforme o tema
        drawerInactiveTintColor: tema.texto, // muda a cor do texto inativo (inativo = quando nao selecionado) do drawer conforme o tema
      })}
    >
      <Drawer.Screen
        name="Home"
        component={user?.role === "admin" ? AdminTabs : UserTabs}
      />
      <Drawer.Screen name="Perfil" component={Perfil} />
      <Drawer.Screen name="Sobre" component={Sobre} />

      <Drawer.Screen
        name="sair"
        component={() => null} //componente nulo pq n tem tela pro logout
        options={{
          drawerLabel: "Sair", //nome que aparece no drawer
        }}
        listeners={{
          drawerItemPress: (e) => {
            //quando clicar no item do drawer
            e.preventDefault(); //impede a navegação padrão
            confirmarLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
};

// Stack
const Stack = createNativeStackNavigator();
const AppStack = () => {
  const { user } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/*SE tiver um usuario, vai pra HOME direto, se não tiver, vai  pro Login */}
      {!user ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
      )}
    </Stack.Navigator>
  );
};

// App principal
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProdutosProvider>
          <NavigationContainer>
            <AppStack />
          </NavigationContainer>
        </ProdutosProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
