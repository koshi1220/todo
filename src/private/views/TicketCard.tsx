import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { Ticket as TicketModel } from "../models/Ticket.js";

interface TicketProps {
  ticket: TicketModel;
  onClick: () => void;
  onDelete: (id: string) => void;
}

const Ticket: React.FC<TicketProps> = ({ ticket, onClick, onDelete }) => {
  const { id, title, x, y } = ticket;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TICKET',
    item: { id, x, y },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }), [id, x, y]);

  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#d6f5d6',
    border: '1px solid #aaa',
    borderRadius: '6px',
    padding: '0.5em',
    boxSizing: 'border-box',
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };
  

  return (
    <div ref={ref} style={style} onClick={onClick}>
      <span>{title}</span>
      <button onClick={(e) => {
        e.stopPropagation();
        onDelete(id);
      }}>🗑️</button>
    </div>
  );
};

export default Ticket;
