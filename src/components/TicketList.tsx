import { Link } from "react-router-dom";
import type { Ticket } from "../features/ticket/useTickets";
import { usePriorities } from "../features/ticket/usePriorities";
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

  const getPriorityName = (priorityId: number) => {
    const priority = priorities.find(p => p.id === priorityId);
    return priority?.name || 'Unknown';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Title</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Priority</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created At</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td className="px-4 py-2 whitespace-nowrap">{ticket.id}</td>
              <td className="px-4 py-2 whitespace-nowrap"><Link to={`/ticket/${ticket.id}`}>{ticket.title}</Link></td>
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
              <td className="px-4 py-2 whitespace-nowrap">{ticket.statusId}</td>
              <td className="px-4 py-2 whitespace-nowrap">{new Date(ticket.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
