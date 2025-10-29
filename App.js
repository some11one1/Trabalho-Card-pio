
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

// só ta importando todos os bagulhos necessários

import { AuthProvider, AuthContext } from "./Context/AuthContext";


import ConfigUsuarios from "./Telas/ConfigUsuarios";
import AdminHome from "./Telas/AdminHome";
import Home from "./Telas/Home";
import Login from "./Telas/Login";
import Perfil from "./Telas/Perfil";
import Historico from "./Telas/Historico";
import Sobre from "./Telas/Sobre";
import Configuracoes from "./Telas/Configuracoes";

import React, { useContext } from "react";

// Tabs
const Tab = createBottomTabNavigator(); // o const Tab cria o navegador de abas (tabs) é a coisa que fica la em baixo do app pra alterar entre si quando aperta, tipo home, historico, etc
const UserTabs = () => ( // função que retorna as tabs pro usuario normal
  <Tab.Navigator> {/*cria o navegador de abas*/}
    <Tab.Screen name="HomeTab" component={Home} /> {/*cada Tab.Screen é uma aba, com nome e componente, componente é o que foi importando lá em cima, tem que ser mesmo nome, já o name tanto faz*/}
    <Tab.Screen name="HistoricoTab" component={Historico} />
    <Tab.Screen name="ConfiguracoesTab" component={Configuracoes} />
  </Tab.Navigator>
);
const AdminTabs = () => ( // mesma coisa só que pro admin
  <Tab.Navigator>
    <Tab.Screen name="Gerenciar Cardápio" component={AdminHome} />
    <Tab.Screen name="Configurar Usúarios" component={ConfigUsuarios} />
  </Tab.Navigator>
);


const Drawer = createDrawerNavigator(); // mesmo que o tab, só que pro drawer (menu lateral)
const HomeDrawer = () => { // função que retorna o drawer, que vai ter as tabs dentro e diferente se for admin ou user
  const { user } = useContext(AuthContext); // pega o estado do usuario do AuthContext para saber se é admin ou user
  return (
    <Drawer.Navigator> {/*nao precisa explicar de novo */}
      <Drawer.Screen
        name="Home"
        component={user?.role === "admin" ? AdminTabs : UserTabs} // define quais serão as TABS (linha 24) baseado se o usuario é admin ou não | o user? vê se o user existe, server pra nao dar erro caso ele naoe exista
      />
      <Drawer.Screen name="Perfil" component={Perfil} />
      <Drawer.Screen name="Sobre" component={Sobre} />
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
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AuthProvider>
  );
}
