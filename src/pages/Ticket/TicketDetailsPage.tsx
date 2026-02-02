import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Ticket } from '../../features/ticket/useTickets';
import { usePriorities } from '../../features/ticket/usePriorities';
import { useStatuses } from '../../features/ticket/useStatuses';
import { useUser } from '../../features/user';
import { useAuth } from '../../features/auth';


const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { apiClient } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { priorities } = usePriorities();
  const { statuses } = useStatuses();
  const { user } = useUser();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient(`/api/tickets/${id}`)
      .then(async (res: Response) => {
        if (!res.ok) throw new Error("Failed to fetch ticket");
        const data = await res.json();
        if (isMounted) setTicket(data.ticket);
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 24, minWidth: 350, background: '#fff' }}>
        <h2 style={{ marginBottom: 12 }}>{ticket.title}</h2>
        <div style={{ marginBottom: 16 }}>{ticket.body}</div>
        <div style={{ marginBottom: 8 }}><b>Status:</b> {status ? status.name : ticket.statusId}</div>
        <div style={{ marginBottom: 8 }}><b>Priority:</b> {priority ? priority.name : ticket.priorityId}</div>
        <div style={{ marginBottom: 8 }}><b>Created by (user id):</b> {ticket.createdBy}</div>
        <div style={{ marginBottom: 8 }}><b>Assigned to (user id):</b> {ticket.assignedTo ?? 'Unassigned'}</div>
        <div style={{ marginBottom: 8 }}><b>Created at:</b> {new Date(ticket.createdAt).toLocaleString()}</div>
        <div style={{ marginBottom: 8 }}><b>Updated at:</b> {new Date(ticket.updatedAt).toLocaleString()}</div>
        {ticket.resolvedAt && (
          <div style={{ marginBottom: 8 }}><b>Resolved at:</b> {new Date(ticket.resolvedAt).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsPage;
