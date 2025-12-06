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
import Ticket from "./Telas/Ticket";

import { FontAwesome } from "@expo/vector-icons";
import { useContext, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { ProdutosProvider } from "./Context/produtoContext";
import { WalletProvider } from "./Context/WalletContext";
import { TicketProvider } from "./Context/TicketContext";
import { HistoricoProvider } from "./Context/HistoricoContext";
import { CarrinhoProvider } from "./Context/CarrinhoContext";
import { AnuncioProvider } from "./Context/AnuncioContext";
import { ChatProvider } from "./Context/ChatContext";

import CardProduto from "./Componentes/CardProduto";
import Pagamento from "./Componentes/Pagamento";


const Tab = createBottomTabNavigator();

export const UserTabs = () => {
  const { tema } = usarTheme();
  const insets = useSafeAreaInsets();

  const renderIcon =
    (name) =>
      ({ color }) =>
        <FontAwesome name={name} size={20} color={color} />;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tema.background,
          borderTopWidth: 0,
          paddingBottom: insets.bottom + 6,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: tema.textoAtivo,
        tabBarInactiveTintColor: tema.texto,
      }}
    >
      <Tab.Screen name="HomeTab" component={Home} options={{ tabBarIcon: renderIcon("home") }} />
      <Tab.Screen name="Histórico" component={Historico} options={{ tabBarIcon: renderIcon("history") }} />
      <Tab.Screen name="Carrinho" component={Carrinho} options={{ tabBarIcon: renderIcon("shopping-cart") }} />
      <Tab.Screen name="Configurações" component={Configuracoes} options={{ tabBarIcon: renderIcon("cog") }} />
    </Tab.Navigator>
  );
};

export const AdminTabs = () => {
  const renderIcon =
    (name) =>
      ({ color }) =>
        <FontAwesome name={name} size={20} color={color} />;

  const { tema } = usarTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tema.background,
          borderTopWidth: 0,
          paddingBottom: insets.bottom + 6,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: tema.textoAtivo,
        tabBarInactiveTintColor: tema.texto,
      }}>
      <Tab.Screen name="Gerenciar Cardápio" component={AdminHome} options={{ tabBarIcon: renderIcon("tasks") }} />
      <Tab.Screen name="Usuários" component={ConfigUsuarios} options={{ tabBarIcon: renderIcon("users") }} />
      <Tab.Screen name="Configurações" component={Configuracoes} options={{ tabBarIcon: renderIcon("cog") }} />
    </Tab.Navigator>
  );
};



const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  const { tema } = usarTheme();
  const { user, logout } = useContext(AuthContext);
  const [modalLogoutVisivel, setModalLogoutVisivel] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: tema.background },
          headerTintColor: tema.texto,
          drawerStyle: { backgroundColor: tema.background, },
          drawerActiveTintColor: tema.textoAtivo,
          drawerInactiveTintColor: tema.texto,
        }}>
        <Drawer.Screen name="Home" component={user?.role === "admin" ? AdminTabs : UserTabs} />
        {user?.role !== "admin" && <Drawer.Screen name="Ticket" component={Ticket} />}
        <Drawer.Screen name="Perfil" component={Perfil} />
        <Drawer.Screen name="Chat" component={Chat} />
        <Drawer.Screen name="Sobre" component={Sobre} />

        <Drawer.Screen
          name="Sair"
          component={() => null}
          listeners={{
            drawerItemPress: (e) => {
              e.preventDefault();
              setModalLogoutVisivel(true);
            },
          }}
        />
      </Drawer.Navigator>


      <Modal
        transparent
        animationType="fade"
        visible={modalLogoutVisivel}
        onRequestClose={() => setModalLogoutVisivel(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: width * 0.8,
              backgroundColor: tema.background,
              borderRadius: 15,
              padding: 30,
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
              borderWidth: 2,
              borderColor: tema.textoAtivo,
            }}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: width * 0.06,
                marginBottom: 10,
                color: tema.texto,
                fontWeight: "bold",
                maxWidth: width * 0.8,
              }}
            >
              Deslogar
            </Text>

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: width * 0.03,
                marginBottom: 10,
                color: tema.texto,
                fontWeight: "bold",
                maxWidth: width * 0.8,
              }}
            >
              Você tem certeza que quer Deslogar?
            </Text>

            <View
              style={[
                styles.buttonContainer,
                { width: width * 0.5 },
              ]}
            >
              <TouchableOpacity
                style={{
                  width: width * 0.2,
                  backgroundColor: tema.cardBackground,
                  borderColor: tema.textoAtivo,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: width * 0.03,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setModalLogoutVisivel(false)}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: width * 0.09,
                    color: tema.texto,
                    fontWeight: "bold",
                    maxWidth: width * 0.15,
                  }}
                >
                  Não
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: width * 0.2,
                  backgroundColor: tema.cardBackground,
                  borderColor: tema.textoAtivo,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: width * 0.03,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={logout}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: width * 0.09,
                    color: tema.texto,
                    fontWeight: "bold",
                    maxWidth: width * 0.15,
                  }}
                >
                  Sim
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};



const Stack = createNativeStackNavigator();

const AppStack = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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



const SessaoEncerradaModal = () => {
  const { modalSessaoEncerrada, setModalSessaoEncerrada, mensagemSessao } = useContext(AuthContext);
  const { width } = useWindowDimensions();
  const { tema } = usarTheme();

  return (
    <Modal transparent animationType="fade" visible={modalSessaoEncerrada}>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { width: width * 0.8, backgroundColor: tema.background, borderWidth: 2, borderColor: tema.textoAtivo }]}>
          <Text
            umberOfLines={1}
            adjustsFontSizeToFit
            style={{ fontSize: width * 0.05, marginBottom: 10, color: tema.texto, fontWeight: "bold", maxWidth: width * 0.6 }}>Sessão encerrada</Text>
          <Text
            umberOfLines={1}
            adjustsFontSizeToFit
            style={{ fontSize: width * 0.02, marginBottom: 10, color: tema.texto, fontWeight: "bold", maxWidth: width * 1 }}>{mensagemSessao}</Text>

          <TouchableOpacity
            onPress={() => setModalSessaoEncerrada(false)}
            style={{
              backgroundColor: tema.cardBackground,
              borderColor: tema.textoAtivo,
              borderWidth: 1,
              borderRadius: 10,
              paddingVertical: width * 0.03,
              alignItems: "center",
            }}>
            <Text
              umberOfLines={1}
              adjustsFontSizeToFit
              style={{ fontSize: width * 0.05, color: tema.texto, fontWeight: "600", maxWidth: width * 0.2 }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal >
  );
};

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
                          <SessaoEncerradaModal />
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



const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: 30,
  },
  btn: {
    fontSize: 16,
    fontWeight: "bold",
  },

   buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
