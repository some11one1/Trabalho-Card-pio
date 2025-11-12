import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usarTheme } from "../Context/ThemeContext";
export const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    const carregarCarrinho = async () => {
      try {
        const carrinhoSalvo = await AsyncStorage.getItem("carrinho");
        if (carrinhoSalvo) {
          setCarrinho(JSON.parse(carrinhoSalvo));
        }
      } catch (error) {
        console.log("Erro ao carregar carrinho:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarCarrinho();
  }, []);

  async function AdicionarAoCarrinho(id, nome, preco) {
    try {
      // Verifica se o produto já está no carrinho
      const itemExistente = carrinho.find((item) => item.id === id);

      let novoCarrinho;

      if (itemExistente) {
        // Se ja existe, atualiza a quantidade e o total
        novoCarrinho = carrinho.map((item) =>
          item.id === id
            ? {
                ...item,
                quantidade: item.quantidade + 1,
                total: (item.quantidade + 1) * item.preco,
              }
            : item
        );
      } else {
        // Se nao existe, adiciona o item com quantidade 1
        const novoItem = { id, nome, preco, quantidade: 1, total: preco };
        novoCarrinho = [...carrinho, novoItem];
      }

      // Atualiza estado e salva no AsyncStorage
      setCarrinho(novoCarrinho);
      await AsyncStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    } catch (error) {
      console.log("Erro ao salvar no Carrinho:", error);
    }
  }

  // ? Limpa o carrinho
  const limparCarrinho = async () => {
    setCarrinho([]);
    await AsyncStorage.removeItem("carrinho");
  };

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, AdicionarAoCarrinho, limparCarrinho, carregando }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};
