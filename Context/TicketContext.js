import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../Supabase";
import { AuthContext } from "./AuthContext";

export const TicketContext = createContext();

export function TicketProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    if (user?.id) {
      verificarTicket(user.id.toString().trim());
    }
  }, [user]);

  const verificarTicket = async (userId) => {
    const hoje = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("usuarios")
      .select("ticket, ultima_data_ticket")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("Erro ao carregar ticket:", error);
      setCarregado(true);
      return;
    }


    if (!data.ultima_data_ticket) {
      await supabase
        .from("usuarios")
        .update({
          ticket: true,
          ultima_data_ticket: hoje,
        })
        .eq("id", userId);

      setTicket(true);
      setCarregado(true);
      return;
    }

    if (data.ultima_data_ticket !== hoje) {
      await supabase
        .from("usuarios")
        .update({
          ticket: true,
          ultima_data_ticket: hoje,
        })
        .eq("id", userId);

      setTicket(true);
      setCarregado(true);
      return;
    }


    setTicket(data.ticket);
    setCarregado(true);
  };

  const usarTicket = async (userId) => {
    await supabase.from("usuarios").update({ ticket: false }).eq("id", userId);

    setTicket(false);
  };

  return (
    <TicketContext.Provider value={{ ticket, usarTicket, carregado }}>
      {children}
    </TicketContext.Provider>
  );
}

export const useTicket = () => useContext(TicketContext);
