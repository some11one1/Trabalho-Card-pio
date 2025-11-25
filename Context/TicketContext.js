import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../Supabase";
import { AuthContext } from "./AuthContext";
export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [ticket, setTicket] = useState(false);
  const { user } = useContext(AuthContext); // pega o usuario do AuthContext

  useEffect(() => {
    const carregarTicket = async () => {
      if (!user || !user.username) return;
      const { data, error } = await supabase
        .from("usuarios")
        .select("Ticket")
        .eq("username", user.username)
        .single();
      if (error) {
        console.log(
          "naum deu pra pegar o ticket, erro do supabase ai mn, arruma ai po",
          error
        );
        return;
      }
      setTicket(data.Ticket);
      return data.Ticket;
    };
    carregarTicket();
  }, [user]);

  return (
    <TicketContext.Provider value={{ ticket }}>
      {children}
    </TicketContext.Provider>
  );
};
