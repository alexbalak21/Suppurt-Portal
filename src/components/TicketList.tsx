import { Link } from "react-router-dom";
import type { Ticket } from "../features/ticket/useTickets";
import { usePriorities } from "../features/ticket/usePriorities";
import { useStatuses } from "../features/ticket/useStatuses";
import StatusBadge from "./StatusBadge";
import type { BadgeColor } from "../features/theme/badgeColors";
import { priorityDotColors } from "../utils/priorityDotColors";

interface TicketListProps {
  tickets: Ticket[];
}

function getPriorityColor(priorityId?: number) {
  if (!priorityId || !priorityDotColors[priorityId as keyof typeof priorityDotColors]) {
    return priorityDotColors[1];
  }
  return priorityDotColors[priorityId as keyof typeof priorityDotColors];
}

export default function TicketList({ tickets }: TicketListProps) {
  const { priorities } = usePriorities();
  const { statuses } = useStatuses();

  const getPriorityName = (priorityId: number) => {
    const priority = priorities.find(p => p.id === priorityId);
    return priority?.name || 'Unknown';
  };

  const getStatusName = (statusId: number) => {
    const status = statuses.find(s => s.id === statusId);
    return status?.name || 'Unknown';
  };

  const getStatusColor = (statusId: number): BadgeColor => {
    const status = statuses.find(s => s.id === statusId);
    return (status?.color as BadgeColor) || 'gray';
  };

    return (
    <div className="overflow-x-auto">
      <h1>TICKETS</h1>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Title</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Priority</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created At</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td className="px-4 py-2 whitespace-nowrap"><Link to={`/ticket/${ticket.id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">{ticket.title}</Link></td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-sm ${
                      getPriorityColor(ticket.priorityId).bg
                    }`}
                  ></span>
                  {getPriorityName(ticket.priorityId)}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <StatusBadge text={getStatusName(ticket.statusId)} color={getStatusColor(ticket.statusId)} />
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
