import { createContext, useContext } from "react";
import { useTicketsModel } from "../private/controllers/useTickets.js"; // ✅
import { Ticket } from "../private/models/Ticket.js";

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (t: Omit<Ticket, 'id'>) => void;
  updateTicket: (id: string, u: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);


export const TicketProvider: React.FC<{ children: React.ReactNode, userId: string | null }> = ({ children, userId }) => {
  const value = useTicketsModel(userId); // ✅ userId渡す
  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};


export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

