import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider, AuthContext } from "./Context/AuthContext";
import { ThemeProvider, usarTheme } from "./Context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Chat from "./Telas/FeedChat";
import ConfigUsuarios from "./Telas/ConfigUsuarios";
import AdminHome from "./Telas/AdminHome";
import Home from "./Telas/Home";
import Login from "./Telas/Login";
import Perfil from "./Telas/Perfil";
import Historico from "./Telas/Historico";
import Carrinho from "./Telas/Carrinho";
import Sobre from "./Telas/Sobre";
import Configuracoes from "./Telas/Configuracoes";
import { FontAwesome } from "@expo/vector-icons";
import Ticket from "./Telas/Ticket";
import { useContext } from "react";
import { Alert, Platform } from "react-native";
import { ProdutosProvider } from "./Context/produtoContext";
import { Button } from "react-native-web";
import { WalletContext, WalletProvider } from "./Context/WalletContext";
import CardProduto from "./Componentes/CardProduto";
import Pagamento from "./Componentes/Pagamento";
import { TicketProvider } from "./Context/TicketContext";
import { SegredoProvider } from "./indexx";
import { HistoricoProvider } from "./Context/HistoricoContext";
import { CarrinhoProvider } from "./Context/CarrinhoContext";
import { AnuncioProvider } from "./Context/AnuncioContext";
import { ChatProvider } from "./Context/ChatContext";

// Tabs
//cada Tab.Screen é uma aba, com nome e componente, componente é o que foi importando lá em cima, tem que ser mesmo nome, já o name tanto faz

const Tab = createBottomTabNavigator(); // o const Tab cria o navegador de abas (tabs) é a coisa que fica la em baixo do app pra alterar entre si quando aperta, tipo home, historico, etc
// função que retorna as tabs pro usuario normal]
//cria o navegador de abas}

export const UserTabs = () => {
  const { tema } = usarTheme();

  const tamanhoIcone = 20;

  const insets = useSafeAreaInsets();

  const renderIcon =
    (name) =>
    ({ focused, color, size }) => {
      // Aqui usamos o nome do ícone e as propriedades fornecidas pelo React Navigation
      return <FontAwesome name={name} size={tamanhoIcone} color={color} />;
    };

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tema.background },
        headerTintColor: tema.texto,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tema.background,
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: insets.bottom + 6,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: tema.textoAtivo,
        tabBarInactiveTintColor: tema.texto,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: renderIcon("home"),
        })}
      />
      <Tab.Screen
        name="Histórico"
        component={Historico}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: renderIcon("history"),
        })}
      />
      <Tab.Screen
        name="Carrinho"
        component={Carrinho}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: renderIcon("shopping-cart"),
        })}
      />
      <Tab.Screen
        name="Configurações"
        component={Configuracoes}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: renderIcon("cog"),
        })}
      />
    </Tab.Navigator>
  );
};

// mesma coisa só que pro admin
export const AdminTabs = () => {
  const { isModoEscuro } = usarTheme();
  const temaAdaptativo = isModoEscuro ? "#121212" : "#EDEDED";
  const temaAdaptativoTexto = isModoEscuro ? "#EDEDED" : "#121212";

  const tamanhoIcone = 20;

  const renderIcon =
    (name) =>
    ({ focused, color, size }) => {
      // Aqui usamos o nome do ícone e as propriedades fornecidas pelo React Navigation
      return <FontAwesome name={name} size={tamanhoIcone} color={color} />;
    };

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
      <Tab.Screen
        name="Gerenciar Cardápio"
        component={AdminHome}
        options={{
          headerShown: false,
          tabBarIcon: renderIcon("tasks"),
        }}
      />
      <Tab.Screen
        name="Configurar Usuários"
        component={ConfigUsuarios}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: renderIcon("users"),
        })}
      />
      <Tab.Screen
        name="Configurações"
        component={Configuracoes}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: renderIcon("cog"),
        })}
      />
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
  function FuncaoInutilSoPraResolverUmErroDaTelaDeSair() {
    return null;
  }
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
        options={() => ({
          headerShown: false,
        })}
      />
      {user?.role !== "admin" && (
        <Drawer.Screen
          name="Ticket"
          component={Ticket}
          options={{ headerShown: false }}
        />
      )}
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
        options={() => ({
          headerShown: false,
        })}
      />
      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: true,
          title: "Chat Global",
        }}
      />
      <Drawer.Screen
        name="Sobre"
        component={Sobre}
        options={() => ({
          headerShown: false,
        })}
      />

      <Drawer.Screen
        name="sair"
        component={FuncaoInutilSoPraResolverUmErroDaTelaDeSair} //componente nulo pq n tem tela pro logout
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
      <Stack.Screen name="CardProduto" component={CardProduto} />
      <Stack.Screen name="Pagamento" component={Pagamento} />
    </Stack.Navigator>
  );
};

// App principal
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AnuncioProvider>
          <AuthProvider>
            <TicketProvider>
              <WalletProvider>
                <ProdutosProvider>
                  <CarrinhoProvider>
                    <HistoricoProvider>
                      <ChatProvider>
                        <NavigationContainer>
                          <AppStack />
                        </NavigationContainer>
                      </ChatProvider>
                    </HistoricoProvider>
                  </CarrinhoProvider>
                </ProdutosProvider>
              </WalletProvider>
            </TicketProvider>
          </AuthProvider>
        </AnuncioProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
