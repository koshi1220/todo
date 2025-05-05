import { useNavigate } from "react-router-dom";
import TicketForm from "../views/TicketForm.js";
import { Ticket as TicketModel } from "../models/Ticket.js";
import { useAuth } from "../../public/controller/useAuth.js"; // ← 追加
import { saveTicketToFirestore } from "../controllers/useTickets.js";

const CreatePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSave = async (ticketData: Omit<TicketModel, 'id'>) => {
    if (!user) return;
    await saveTicketToFirestore(user.uid, ticketData);
    navigate('/matrix'); // 保存後にマトリクス画面へ遷移
  };

  return (
    <TicketForm
      ticket={{ title: '', description: '', deadline: '', x: 0, y: 0 }}
      onSave={handleSave}
      onCancel={() => navigate('/')}
    />
  );
};

export default CreatePage;
