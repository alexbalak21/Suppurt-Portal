import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Ticket } from '../../features/ticket/useTickets';
import { usePriorities } from '../../features/ticket/usePriorities';
import { useStatuses } from '../../features/ticket/useStatuses';
import { useUser } from '../../features/user';
import { useAuth } from '../../features/auth';
import StatusChip from '../../components/StatusChip';
import Tooltip from '../../components/Tooltip';
import { PrioritySelector } from '../../components/PrioritySelector';
import AssignedChip from '../../components/AssignedChip';
import Conversation from '../../components/Conversation';
import AddMessage from '../../components/AddMessage';


interface MessageData {
  id: number;
  senderId: number;
  body: string;
  createdAt: string;
  updatedAt: string;
}

const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { apiClient } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { priorities } = usePriorities();
  const { statuses } = useStatuses();
  const { user } = useUser();

  const fetchTicketData = () => {
    setLoading(true);
    apiClient(`/api/tickets/${id}`)
      .then(async (res: Response) => {
        if (!res.ok) throw new Error("Failed to fetch ticket");
        const data = await res.json();
        setTicket(data.ticket);
        setMessages(data.messages || []);
      })
      .catch((err: any) => {
        setError(err.message || "Error fetching ticket");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient(`/api/tickets/${id}`)
      .then(async (res: Response) => {
        if (!res.ok) throw new Error("Failed to fetch ticket");
        const data = await res.json();
        if (isMounted) {
          setTicket(data.ticket);
          setMessages(data.messages || []);
        }
      })
      .catch((err: any) => {
        if (isMounted) setError(err.message || "Error fetching ticket");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id, apiClient]);

  const handlePrioritySaved = (newPriorityId: number) => {
    if (ticket) {
      setTicket({ ...ticket, priorityId: newPriorityId });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!ticket) {
    return <div>Ticket not found.</div>;
  }

  const priority = priorities.find((p) => p.id === ticket.priorityId);
  const status = statuses.find((s) => s.id === ticket.statusId);

  // If you want to show user info, you may need to fetch user by id. For now, just show the id.

  return (
    <div className="min-h-[60vh] max-w-7xl mx-auto mt-6">
      <div className="border border-gray-300 w-full rounded-lg p-6 min-w-87.5 bg-white shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              {ticket.title}
            </h1>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Created at:</span>{' '}
              <Tooltip
                content={new Date(ticket.createdAt).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              >
                <span className="inline-block">
                  {new Date(ticket.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                </span>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extralight pb-1">Priority:</span>

              <span className="inline-block">
                <PrioritySelector
                  priorityId={ticket.priorityId}
                  priorityName={priority?.name}
                  ticketId={id}
                  onSave={handlePrioritySaved}
                />
              </span>

            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="font-extralight pb-1">Assigned to:</span>
              <Tooltip content={`Assigned To`}>
                <div>
                  <AssignedChip userId={ticket.assignedTo} />
                </div>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extralight pb-1">Status:</span>
              <Tooltip content={`Status`}>
                <div>
                  <StatusChip statusId={ticket.statusId} statusName={status?.name} />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="my-4 text-gray-700 border border-gray-300 rounded-lg py-2 px-3 h-[50vh]">{ticket.body}</div>
        <div className="mb-2"></div>
        <div className="mb-2 text-right text-sm text-gray-600">
          <span className="font-semibold">Updated at:</span>{' '}
          <Tooltip
            content={new Date(ticket.updatedAt).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          >
            <span className="inline-block">
              {new Date(ticket.updatedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })}
            </span>
          </Tooltip>
        </div>
        {ticket.resolvedAt && (
          <div className="mb-2"><span className="font-semibold">Resolved at:</span> {new Date(ticket.resolvedAt).toLocaleString()}</div>
        )}
      </div>



      {/* Conversation Section */}
      <div className="mt-6">
        <Conversation messages={messages} />
      </div>

      {/* Add Message Section */}
      <div className="mt-6">
        <AddMessage ticketId={id!} onMessageAdded={fetchTicketData} />
      </div>
    </div>


  );
};

export default TicketDetailsPage;
