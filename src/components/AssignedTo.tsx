import React from 'react';
import Tooltip from './Tooltip';
import UserBadge from './UserBadge';
import Button from './Button';
import AssignTicketSelector from './AssignTicketSelector';

interface AssignedToProps {
  assignedUserId?: number | null;
  canAssignSelf: boolean;
  isAssignedToMe: boolean;
  onAssignToSelf: () => void;
  onUnassign: () => void;
  assigning: boolean;
  assignError?: string | null;
  canAssignOthers: boolean;
  ticketId: string | number;
  onAssignOther: (userId: number) => void;
}

const AssignedTo: React.FC<AssignedToProps> = ({
  assignedUserId,
  canAssignSelf,
  isAssignedToMe,
  onAssignToSelf,
  onUnassign,
  assigning,
  assignError,
  canAssignOthers,
  ticketId,
  onAssignOther,
}) => {
  return (
    <div className="flex flex-col items-start sm:items-end gap-2">
      <div className="flex items-center gap-2">
        <span className="font-extralight pb-1">Assigned to:</span>
        <Tooltip content="Assigned To">
          <div>
            <UserBadge userId={assignedUserId} />
          </div>
        </Tooltip>
      </div>

      {/* Hide 'Assign to Me' for managers */}
      {canAssignSelf && !isAssignedToMe && !canAssignOthers && (
        <div className="flex flex-col items-end gap-1">
          <Button
            onClick={onAssignToSelf}
            disabled={assigning}
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {assigning ? 'Assigning...' : 'Assign to Me'}
          </Button>
          {assignError && (
            <span className="text-xs text-red-500">{assignError}</span>
          )}
        </div>
      )}

      {canAssignSelf && isAssignedToMe && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-600 font-medium">✓ Assigned to you</span>
          <Button
            onClick={onUnassign}
            disabled={assigning}
            size="sm"
            variant="danger"
            className="px-2"
            aria-label="Unassign from me"
            title="Unassign"
          >
            X
          </Button>
        </div>
      )}

      {canAssignOthers && (
        <div className="flex flex-col items-end gap-1">
          <AssignTicketSelector
            ticketId={ticketId}
            currentAssignedUserId={assignedUserId}
            onAssignSuccess={onAssignOther}
          />
        </div>
      )}
    </div>
  );
};

export default AssignedTo;
