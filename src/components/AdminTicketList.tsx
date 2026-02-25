import { Link } from "react-router-dom";
import type { Ticket } from "@features/ticket/useTickets";
import { usePriorities } from "@features/ticket/usePriorities";
import { useStatuses } from "@features/ticket/useStatuses";
import StatusChip from "./StatusChip";
import { priorityDotColors } from "../utils/priorityDotColors";
import UserBadge from "./UserBadge";

interface AdminTicketListProps {
  tickets: Ticket[];
}

function getPriorityColor(priorityId?: number) {
  if (!priorityId || !priorityDotColors[priorityId as keyof typeof priorityDotColors]) {
    return priorityDotColors[1];
  }
  return priorityDotColors[priorityId as keyof typeof priorityDotColors];
}

export default function AdminTicketList({ tickets }: AdminTicketListProps) {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Title</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created By</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Assigned To</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Priority</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Updated</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {tickets.map(ticket => (
            <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                #{ticket.id}
              </td>
              <td className="px-4 py-2">
                <Link 
                  to={`/ticket/${ticket.id}`} 
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {ticket.title}
                </Link>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                User #{ticket.createdBy}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {ticket.assignedTo ? (
                  <UserBadge userId={ticket.assignedTo} />
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500">Unassigned</span>
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className="inline-flex items-center gap-2 text-sm">
                  <span
                    className={`w-3 h-3 rounded-sm ${
                      getPriorityColor(ticket.priorityId).bg
                    }`}
                  ></span>
                  {getPriorityName(ticket.priorityId)}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <StatusChip statusId={ticket.statusId} statusName={getStatusName(ticket.statusId)} />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(ticket.createdAt).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: '2-digit' 
                })}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(ticket.updatedAt).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: '2-digit' 
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
