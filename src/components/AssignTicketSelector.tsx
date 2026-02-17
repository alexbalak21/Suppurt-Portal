import React, { useState } from 'react';
import { useUsers } from '../features/user/useUsers';
import { useAssignTicket } from '../features/ticket/useAssignTicket';
import Button from './Button';

interface AssignTicketSelectorProps {
  ticketId: string | number;
  currentAssignedUserId?: number | null;
  onAssignSuccess?: (userId: number) => void;
}

const AssignTicketSelector: React.FC<AssignTicketSelectorProps> = ({
  ticketId,
  currentAssignedUserId,
  onAssignSuccess,
}) => {
  // Only fetch users with SUPPORT role (role=3)
  const { users, loading: loadingUsers } = useUsers({ role: 3 });
  const { loading: assigning, error, assignTicket } = useAssignTicket();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleAssign = async () => {
    if (!selectedUserId) return;

    try {
      await assignTicket({ ticketId, userId: selectedUserId });
      onAssignSuccess?.(selectedUserId);
      setSelectedUserId(null);
    } catch (err) {
      // Error is handled in the hook
      console.error('Failed to assign ticket:', err);
    }
  };

  if (loadingUsers) {
    return <div className="text-sm text-gray-500">Loading users...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <select
          value={selectedUserId ?? ''}
          onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={assigning}
        >
          <option value="">Select user to assign...</option>
          {users.map((user) => (
            <option 
              key={user.id} 
              value={user.id}
              disabled={user.id === currentAssignedUserId}
            >
              {user.name} {user.id === currentAssignedUserId ? '(Current)' : ''}
            </option>
          ))}
        </select>

        <Button
          onClick={handleAssign}
          disabled={!selectedUserId || assigning}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {assigning ? 'Assigning...' : 'Assign'}
        </Button>
      </div>

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default AssignTicketSelector;
