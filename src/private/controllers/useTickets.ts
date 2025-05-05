import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { Ticket } from "../models/Ticket.js";

/**
 * チケットをFirestoreに保存（idは自動採番）
 * @param userId - ユーザーのUID
 * @param ticket - Firestoreに保存するTicket（idを除いた構造）
 */
export const saveTicketToFirestore = async (
  userId: string,
  ticket: Omit<Ticket, 'id'>
) => {
  const ticketRef = collection(db, 'users', userId, 'tickets');
  await addDoc(ticketRef, ticket);
};

type UseTicketsModelResult = {
  tickets: Ticket[];
  isLoading: boolean;
  addTicket: (ticket: Omit<Ticket, 'id'>) => Promise<void>;
  updateTicket: (id: string, update: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
};


export const useTicketsModel = (userId: string | null): UseTicketsModelResult => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false); // ← loading状態を追加

  useEffect(() => {
    if (!userId) {
      setTickets([]);
      return;
    }

    const ticketsRef = collection(db, 'users', userId, 'tickets');
    const unsubscribe = onSnapshot(ticketsRef, (snapshot) => {
      const ticketsFromSnapshot = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Ticket, 'id'>),
        id: doc.id,
      }));
      setTickets(ticketsFromSnapshot);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTicket = async (ticket: Omit<Ticket, 'id'>) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      await addDoc(collection(db, 'users', userId, 'tickets'), ticket);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicket = async (id: string, update: Partial<Ticket>) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      await updateDoc(doc(db, 'users', userId, 'tickets', id), update);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTicket = async (id: string) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      await deleteDoc(doc(db, 'users', userId, 'tickets', id));
    } finally {
      setIsLoading(false);
    }
  };

  return { tickets, isLoading, addTicket, updateTicket, deleteTicket };
};
