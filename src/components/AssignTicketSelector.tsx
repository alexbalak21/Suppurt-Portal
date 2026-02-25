import React, { useState } from 'react';
import Button from './Button';
import AssignTicketModal from './AssignTicketModal';
import { useAssignTicket } from '../features/ticket/useAssignTicket';

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
  const { error, assignTicket } = useAssignTicket();
  const [modalOpen, setModalOpen] = useState(false);

  // Always use a number for ticketId
  const numericTicketId = typeof ticketId === 'string' ? parseInt(ticketId, 10) : ticketId;

  const handleAssign = async (_ticketId: number, userId: number) => {
    try {
      await assignTicket({ ticketId: numericTicketId, userId });
      onAssignSuccess?.(userId);
      setModalOpen(false);
    } catch (err) {
      // Error is handled in the hook
      console.error('Failed to assign ticket:', err);
    }
  };

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Assign Ticket
      </Button>
      <AssignTicketModal
        open={modalOpen}
        ticketId={numericTicketId}
        onClose={() => setModalOpen(false)}
        onAssign={handleAssign}
        currentAssignedUserId={currentAssignedUserId}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </>
  );
};

export default AssignTicketSelector;
