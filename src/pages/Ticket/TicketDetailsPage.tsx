import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePriorities } from '@features/ticket/usePriorities';
import { useStatuses } from '@features/ticket/useStatuses';
import { useAuth } from '@features/auth';
import { useRole } from '@features/auth/useRole';
import { useUser } from '@features/user';
import { useAssignTicket } from '@features/ticket/useAssignTicket';
import { can } from '@features/auth/permissions';
import StatusBadge from '@components/StatusBadge';
import type { Colors } from '@features/theme/colors';
import { StatusSelector } from '@components/StatusSelector';
import Tooltip from '@components/Tooltip';
import { PrioritySelector } from '@components/PrioritySelector';
import { PriorityDisplay } from '@components/PriorityDisplay';
import AssignedTo from '@components/AssignedTo';
import Conversation from '@components/Conversation';
import AddMessage from '@components/AddMessage';
import Editor from '@components/Editor';

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
  const { activeRole, isManager } = useRole();
  const { priorities } = usePriorities();
  const { statuses } = useStatuses();
  const { loading: assigning, error: assignError, assignTicket } = useAssignTicket();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState(false);
  const [editedBody, setEditedBody] = useState('');
  const [savingBody, setSavingBody] = useState(false);
  const [bodyError, setBodyError] = useState<string | null>(null);
  const canAssignSelf = activeRole && can('assignSelf', activeRole as any);
  const canAssignOthers = (activeRole && can('assignOthers', activeRole as any)) || isManager;
  const isAssignedToMe = user?.id && ticket?.assignedTo === user.id;

  const handleMessageAdded = (newMessage: MessageData) => {
    setMessages((prevMessages: MessageData[]) => [...prevMessages, newMessage]);
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

  const handleUnassign = async () => {
    if (!id) return;
    try {
      await assignTicket({ ticketId: id, userId: null });
      setTicket((prev: any) => prev ? { ...prev, assignedTo: null } : null);
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

  const priority = priorities.find((p: any) => p.id === ticket.priorityId);
  const status = statuses.find((s: any) => s.id === ticket.statusId);

  const handleEditBody = () => {
    setEditedBody(ticket.body || '');
    setEditingBody(true);
    setBodyError(null);
  };

  const handleCancelEditBody = () => {
    setEditingBody(false);
    setBodyError(null);
  };

  const handleSaveBody = async () => {
    setSavingBody(true);
    setBodyError(null);
    try {
      const res = await apiClient(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: editedBody }),
      });
      if (!res.ok) throw new Error('Failed to update ticket body');
      setTicket((prev: any) => prev ? { ...prev, body: editedBody } : prev);
      setEditingBody(false);
    } catch (err: any) {
      setBodyError(err.message || 'Failed to update body');
    } finally {
      setSavingBody(false);
    }
  };

  return (
    <div className="min-h-[60vh] max-w-7xl mx-auto mt-6 dark:bg-gray-900">
      <div className="border border-gray-300 dark:border-gray-700 w-full rounded-lg p-6 min-w-87.5 bg-white dark:bg-gray-800 shadow-sm">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {ticket.title}
            </h1>

            <div className="text-sm text-gray-600 dark:text-gray-300">
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
              onAssignToSelf={() => {}}
              onUnassign={handleUnassign}
              assigning={assigning}
              assignError={assignError}
              canAssignOthers={!!canAssignOthers}
              ticketId={id!}
              onAssignOther={(userId) => {
                setTicket((prev: any) => prev ? { ...prev, assignedTo: userId } : null);
              }}
            />

            <div className="flex items-center gap-2">
              <span className="font-extralight pb-1">Status:</span>
                <div>
                  {activeRole && !can('changeStatus', activeRole as any) ? (
                    <StatusBadge text={status?.name} color={status?.color as Colors} />
                  ) : (
                    <StatusSelector
                      statusId={ticket.statusId}
                      ticketId={id}
                        // onSave removed (was undefined)
                    />
                  )}
                </div>
            </div>
          </div>
        </div>

        <div className="my-4 text-gray-700 min-h-[200px] dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 bg-white dark:bg-gray-800 relative">
          {editingBody ? (
            <>
              <Editor
                content={editedBody}
                setContent={setEditedBody}
                placeholder="Edit ticket body..."
              />
              <div className="flex gap-2 mt-5 mb-2 justify-end">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                  onClick={handleSaveBody}
                  disabled={savingBody}
                >
                  {savingBody ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={handleCancelEditBody}
                  disabled={savingBody}
                >
                  Cancel
                </button>
              </div>
              {bodyError && <div className="text-red-500 mt-1">{bodyError}</div>}
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: ticket.body }} />
          )}
        </div>

        <div className="mb-2 text-right text-sm text-gray-600 dark:text-gray-300">
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
           {/* Edit Ticket Body Button - bottom left */}
        </div>
        <div className="flex">
           {!editingBody && (
        <button
          className="px-4 py-2 ml-auto mt-5 mb-2 bg-yellow-500 text-white rounded shadow-lg hover:bg-yellow-600 transition-colors"
          onClick={handleEditBody}
        >
          Edit Ticket
        </button>
      )}
        </div>
        

        {ticket.resolvedAt && (
          <div className="mb-2">
            <span className="font-semibold dark:text-gray-300">Resolved at:</span>{' '}
            <span className="dark:text-gray-200">{new Date(ticket.resolvedAt).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* MANAGER has access to all messages and notes */}

     
      <div className="mt-6">
        <Conversation messages={messages} />
      </div>

      <div className="mt-6">
        <AddMessage ticketId={id!} onMessageAdded={handleMessageAdded} />
      </div>
    </div>
  );
};

export default TicketDetailsPage;
