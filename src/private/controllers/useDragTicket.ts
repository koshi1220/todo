// src/private/controllers/useDragTicket.ts

import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { Ticket } from "../models/Ticket.js";

type UseDragTicketResult = {
  refCallback: (el: HTMLDivElement | null) => void;
  isDragging: boolean;
};

export const useDragTicket = (ticket: Ticket): UseDragTicketResult => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TICKET',
    item: () => {
      console.log('[DND] Drag start:', ticket);
      return ticket;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      console.log('[DND] Drag end: item =', item, 'dropResult =', dropResult);
    },
  }));

  useEffect(() => {
    if (elementRef.current) {
      drag(elementRef);
    }
  }, [drag]);

  const refCallback = (el: HTMLDivElement | null) => {
    elementRef.current = el;
  };
  
  return { refCallback, isDragging };
  
};
