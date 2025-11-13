import React, { createContext, useState, useContext, useRef } from "react";
import Anuncio from "../Componentes/Anuncio";

const AnuncioContext = createContext();

export function AnuncioProvider({ children }) {
  const [visivel, setVisivel] = useState(false);
  const resolverRef = useRef(null);

  const chanceMostrarAnuncio = () => {
    return new Promise((resolve) => {
      const chance = Math.random();

      if (chance < 0.9) {
        resolverRef.current = resolve;
        setVisivel(true);
      } else {
        resolve();
      }
    });
  };

  const fecharAnuncio = () => {
    setVisivel(false);
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }
  };

  return (
    <AnuncioContext.Provider value={{ chanceMostrarAnuncio }}>
      {children}
      <Anuncio visivel={visivel} onFechar={fecharAnuncio} />
    </AnuncioContext.Provider>
  );
}

export const useAnuncio = () => useContext(AnuncioContext);
