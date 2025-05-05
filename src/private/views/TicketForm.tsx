// src/private/views/TicketForm.tsx

import React, { useState, useEffect } from "react";
import { Ticket } from "../models/Ticket.js";

interface TicketFormProps {
  ticket: Partial<Ticket> | null;
  onSave: (updated: Omit<Ticket, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean; // ← ✅ 追加
}

const TicketForm: React.FC<TicketFormProps> = ({
  ticket,
  onSave,
  onCancel,
  isLoading = false, // ← ✅ デフォルト false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title || '');
      setDescription(ticket.description || '');
      setDeadline(ticket.deadline || new Date().toISOString().slice(0, 10));
    }
  }, [ticket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      deadline,
      x: ticket?.x ?? 0,
      y: ticket?.y ?? 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={isLoading}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        disabled={isLoading}
      />
      <div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : '保存'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading}>
          キャンセル
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
