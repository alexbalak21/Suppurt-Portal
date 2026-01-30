import { useTickets } from "../features/ticket/useTickets";
import TicketList from "../components/TicketList";

export default function TicketListPage() {
  const { tickets, loading, error } = useTickets();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">My Tickets</h1>
      {loading && <div>Loading tickets...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && <TicketList tickets={tickets} />}
    </div>
  );
}
