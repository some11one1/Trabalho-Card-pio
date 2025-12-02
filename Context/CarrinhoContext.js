import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const STORAGE_KEY = "@carrinho";

  const salvarCarrinho = async (novo) => {
    try {
      setCarrinho(novo);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
    } catch (e) {
      console.log("Erro salvando carrinho:", e);
    }
  };

  const carregarCarrinho = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setCarrinho(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.log("Erro carregando carrinho:", e);
    }
  };

  useEffect(() => {
    carregarCarrinho();
  }, []);

  // aceita chamada em duas formas:
  // AdicionarAoCarrinho(obj)  OR  AdicionarAoCarrinho(id, nome, preco, produtoImg, descricao)
  const AdicionarAoCarrinho = (p1, p2, p3, p4, p5) => {
    let novoItem;
    if (typeof p1 === "object" && p1 !== null) {
      novoItem = {
        id: p1.id,
        nome: p1.nome,
        preco: Number(p1.preco || 0),
        produtoImg: p1.produtoImg || p1.image || null,
        descricao: p1.descricao || "",
      };
    } else {
      novoItem = {
        id: p1,
        nome: p2,
        preco: Number(p3 || 0),
        produtoImg: p4 || null,
        descricao: p5 || "",
      };
    }

    if (novoItem.id === undefined) return;

    const existsIndex = carrinho.findIndex((it) => String(it.id) === String(novoItem.id));
    const atualizado = [...carrinho];

    if (existsIndex >= 0) {
      // incrementa quantidade
      const existente = { ...atualizado[existsIndex] };
      existente.quantidade = Number(existente.quantidade || 0) + 1;
      existente.total = Number(existente.quantidade) * Number(existente.preco || 0);
      atualizado[existsIndex] = existente;
    } else {
      const itemParaAdicionar = {
        id: novoItem.id,
        nome: novoItem.nome,
        preco: Number(novoItem.preco || 0),
        produtoImg: novoItem.produtoImg || null,
        descricao: novoItem.descricao || "",
        quantidade: 1,
        total: Number(novoItem.preco || 0),
      };
      atualizado.push(itemParaAdicionar);
    }

    salvarCarrinho(atualizado);
  };

  const removerItem = (id) => {
    const atualizado = carrinho.filter((it) => String(it.id) !== String(id));
    salvarCarrinho(atualizado);
  };

  const aumentarQuantidade = (id, step = 1) => {
    const atualizado = carrinho.map((it) => {
      if (String(it.id) !== String(id)) return it;
      const quantidade = Number(it.quantidade || 0) + step;
      return {
        ...it,
        quantidade,
        total: Number(it.preco || 0) * quantidade,
      };
    });
    salvarCarrinho(atualizado);
  };

  const diminuirQuantidade = (id, step = 1) => {
    const atualizado = carrinho
      .map((it) => {
        if (String(it.id) !== String(id)) return it;
        const quantidade = Math.max(0, Number(it.quantidade || 0) - step);
        return {
          ...it,
          quantidade,
          total: Number(it.preco || 0) * quantidade,
        };
      })
      .filter((it) => it.quantidade > 0); // remove itens com 0
    salvarCarrinho(atualizado);
  };

  const limparCarrinho = () => {
    salvarCarrinho([]);
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        setCarrinho,
        carregarCarrinho,
        AdicionarAoCarrinho,
        removerItem,
        aumentarQuantidade,
        diminuirQuantidade,
        limparCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};