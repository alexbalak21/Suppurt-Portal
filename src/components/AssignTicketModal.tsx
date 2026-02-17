
import { useState, useEffect } from "react";
import Button from "./Button";
import { useUsers } from "@features/user/useUsers";

interface Props {
  open: boolean;
  ticketId: number | null;
  onClose: () => void;
  onAssign: (ticketId: number, agentId: number) => void;
  currentAssignedUserId?: number | null;
}

export default function AssignTicketModal({ open, ticketId, onClose, onAssign, currentAssignedUserId }: Props) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Reset selectedUserId when modal opens
  useEffect(() => {
    if (open) {
      setSelectedUserId(null);
    }
  }, [open]);

  // Fetch only SUPPORT users (role=3)
  const { users } = useUsers({ role: 3 });
  const agents = users;

  if (!open || ticketId === null) return null;

  const handleAssignClick = () => {
    if (selectedUserId) {
      onAssign(ticketId, selectedUserId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">Assign Ticket #{ticketId}</h2>
        <div className="mb-4">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedUserId ?? ''}
            onChange={e => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select support user...</option>
            {agents.map(agent => (
              <option
                key={agent.id}
                value={agent.id}
                disabled={currentAssignedUserId != null && agent.id === currentAssignedUserId}
              >
                {agent.name} {currentAssignedUserId != null && agent.id === currentAssignedUserId ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAssignClick}
            disabled={!selectedUserId}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Assign
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
