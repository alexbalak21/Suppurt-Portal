import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Ticket } from '../../features/ticket/useTickets';
import { usePriorities } from '../../features/ticket/usePriorities';
import { useStatuses } from '../../features/ticket/useStatuses';
import { useAuth } from '../../features/auth';
import { useRole } from '../../features/auth/useRole';
import { useUser } from '../../features/user';
import { useAssignTicket } from '../../features/ticket/useAssignTicket';
import { can } from '../../features/auth/permissions';
import StatusChip from '../../components/StatusChip';
import { StatusSelector } from '../../components/StatusSelector';
import Tooltip from '../../components/Tooltip';
import { PrioritySelector } from '../../components/PrioritySelector';
import { PriorityDisplay } from '../../components/PriorityDisplay';
import AssignedTo from '../../components/AssignedTo';
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
  const { user } = useUser();
  const { activeRole } = useRole();
  const { loading: assigning, error: assignError, assignTicket } = useAssignTicket();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { priorities } = usePriorities();
  const { statuses } = useStatuses();
  
  const canAssignSelf = activeRole && can('assignSelf', activeRole as any);
  const canAssignOthers = activeRole && can('assignOthers', activeRole as any);
  const isAssignedToMe = user?.id && ticket?.assignedTo === user.id;

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

  const handleStatusSaved = (newStatusId: number) => {
    if (ticket) {
      setTicket({ ...ticket, statusId: newStatusId });
    }
  };

  const handleAssignToSelf = async () => {
    if (!user?.id || !id) return;
    
    try {
      await assignTicket({ ticketId: id, userId: user.id });
      setTicket(prev => prev ? { ...prev, assignedTo: user.id } : null);
    } catch (err) {
      // Error already handled in the hook
      console.error('Failed to assign ticket:', err);
    }
  };

  const handleUnassign = async () => {
    if (!id) return;

    try {
      await assignTicket({ ticketId: id, userId: null });
      setTicket(prev => prev ? { ...prev, assignedTo: null } : null);
    } catch (err) {
      // Error already handled in the hook
      console.error('Failed to unassign ticket:', err);
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

  return (
    <div className="min-h-[60vh] max-w-7xl mx-auto mt-6">
      <div className="border border-gray-300 w-full rounded-lg p-6 min-w-87.5 bg-white shadow-sm">

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
                {activeRole && !can('changePriority', activeRole as any) ? (
                  <PriorityDisplay
                    priorityId={ticket.priorityId}
                    priorityName={priority?.name ?? ""}
                    className="w-full py-1.5 pr-8 pl-3 text-sm"
                  />
                ) : (
                  <PrioritySelector
                    priorityId={ticket.priorityId}
                    priorityName={priority?.name}
                    ticketId={id}
                    onSave={handlePrioritySaved}
                  />
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <AssignedTo
              assignedUserId={ticket.assignedTo}
              canAssignSelf={!!canAssignSelf}
              isAssignedToMe={!!isAssignedToMe}
              onAssignToSelf={handleAssignToSelf}
              onUnassign={handleUnassign}
              assigning={assigning}
              assignError={assignError}
              canAssignOthers={!!canAssignOthers}
              ticketId={id!}
              onAssignOther={(userId) => {
                setTicket(prev => prev ? { ...prev, assignedTo: userId } : null);
              }}
            />

            <div className="flex items-center gap-2">
              <span className="font-extralight pb-1">Status:</span>
                <div>
                  {activeRole && !can('changeStatus', activeRole as any) ? (
                    <StatusChip statusId={ticket.statusId} statusName={status?.name} />
                  ) : (
                    <StatusSelector
                      statusId={ticket.statusId}
                      ticketId={id}
                      onSave={handleStatusSaved}
                    />
                  )}
                </div>
            </div>
          </div>
        </div>

        <div className="my-4 text-gray-700 border border-gray-300 rounded-lg py-2 px-3 h-[50vh]">
          {ticket.body}
        </div>

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
          <div className="mb-2">
            <span className="font-semibold">Resolved at:</span>{' '}
            {new Date(ticket.resolvedAt).toLocaleString()}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Conversation messages={messages} />
      </div>

      <div className="mt-6">
        <AddMessage ticketId={id!} onMessageAdded={fetchTicketData} />
      </div>
    </div>
  );
};

export default TicketDetailsPage;
