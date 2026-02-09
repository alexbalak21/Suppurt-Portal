import type { BasicUser } from "@features/user/useUsers";

export default function AssignTicketModal({ open, ticketId, users, onClose, onAssign }: {
  open: boolean;
  ticketId: number | null;
  users: BasicUser[];
  onClose: () => void;
  onAssign: (ticketId: number, agentId: number) => void;
}) {
  if (!open || ticketId == null) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[300px]">
        <h2 className="text-lg font-bold mb-4">Assign Ticket</h2>
        <ul className="mb-4">
          {users.map(agent => (
            <li key={agent.id} className="mb-2">
              <button
                className="w-full text-left px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900"
                onClick={() => onAssign(ticketId, agent.id)}
              >
                {agent.name}
              </button>
            </li>
          ))}
        </ul>
        <button className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
import { useUsers } from "@features/user/useUsers";

interface Props {
  open: boolean;
  ticketId: number | null;
  onClose: () => void;
  onAssign: (ticketId: number, agentId: number) => void;
}

export default function AssignTicketModal({ open, ticketId, onClose, onAssign }: Props) {
  const { users } = useUsers();
  const agents = users.filter(u => u.roles.includes("SUPPORT"));

  if (!open || ticketId === null) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">Assign Ticket #{ticketId}</h2>

        <div className="space-y-2">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => onAssign(ticketId, agent.id)}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {agent.name}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
