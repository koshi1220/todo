// src/private/views/TicketCardView.tsx

import React from "react";
import { Ticket } from "@models/Ticket.js";

type Props = {
  ticket: Ticket;
  left: number;
  top: number;
  width: number;
  height: number;
  isDragging?: boolean;
  onClick: () => void;
  refCallback?: (el: HTMLDivElement | null) => void;
};

const TicketCardView: React.FC<Props> = ({
  ticket,
  left,
  top,
  width,
  height,
  isDragging = false,
  onClick,
  refCallback
}) => {
  return (
    <div
      ref={refCallback}
      onClick={onClick}
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        zIndex: 10,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <strong
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontSize: '0.8rem',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          padding: '0.3rem',
          backgroundColor: '#d3f9d8',
          height: '100%',
          borderRadius: '4px',
          boxSizing: 'border-box',
        }}
      >
        <div>{ticket.title}</div>
        <div style={{ fontSize: '0.7rem', color: '#666' }}>{ticket.deadline}</div>
      </strong>
    </div>
  );
};

export default TicketCardView;
