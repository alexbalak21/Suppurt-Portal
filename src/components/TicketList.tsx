
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Ticket } from "../features/ticket/useTickets";
import { usePriorities } from "../features/ticket/usePriorities";
import { useStatuses } from "../features/ticket/useStatuses";
import StatusBadge from "./StatusBadge";
import UserBadge from "./UserBadge";
import type { BadgeColor } from "../features/theme/badgeColors";
import { priorityDotColors } from "../utils/priorityDotColors";

interface TicketListProps {
  tickets: Ticket[];
  showAdminColumns?: boolean;
  statusFilter?: string; // status name to filter by (e.g., "Resolved", "Open")
}


function getPriorityColor(priorityId?: number) {
  if (!priorityId || !priorityDotColors[priorityId as keyof typeof priorityDotColors]) {
    return priorityDotColors[1];
  }
  return priorityDotColors[priorityId as keyof typeof priorityDotColors];
}

export default function TicketList({ tickets, showAdminColumns = false, statusFilter }: TicketListProps) {

  const { priorities } = usePriorities();
  const { statuses } = useStatuses();

  const [sortKey, setSortKey] = useState<string>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  // Removed internal search state; search is handled by parent

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

  // Filter by status if statusFilter is provided
  let filteredTickets = tickets;
  if (typeof statusFilter === 'string' && statusFilter.length > 0) {
    const statusObj = statuses.find(s => s.name.toLowerCase() === statusFilter.toLowerCase());
    if (statusObj) {
      filteredTickets = tickets.filter(t => t.statusId === statusObj.id);
    } else {
      filteredTickets = [];
    }
  }

  // Sort tickets (parent should filter by search)
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    switch (sortKey) {
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'createdBy':
        aValue = a.createdBy;
        bValue = b.createdBy;
        break;
      case 'priority':
        aValue = a.priorityId;
        bValue = b.priorityId;
        break;
      case 'status':
        aValue = getStatusName(a.statusId);
        bValue = getStatusName(b.statusId);
        break;
      case 'assignedTo':
        aValue = a.assignedTo || 0;
        bValue = b.assignedTo || 0;
        break;
      case 'created':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'updated':
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      default:
        aValue = a.id;
        bValue = b.id;
    }
    if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIndicator = (key: string) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  return (
    <div className="overflow-x-auto dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:shadow-lg w-full h-full transition-colors duration-300">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {/* Show ID for support/admin/manager */}
            {showAdminColumns && (
              <th
                className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer select-none transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleSort('id')}
              >
                ID{sortIndicator('id')}
              </th>
            )}

            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
              Title
            </th>

            {/* Show Created By for support/admin/manager */}
            {showAdminColumns && (
              <th
                className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer select-none transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleSort('createdBy')}
              >
                Created By{sortIndicator('createdBy')}
              </th>
            )}


            <th
              className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer select-none transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('priority')}
            >
              Priority{sortIndicator('priority')}
            </th>

            <th
              className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer select-none transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('status')}
            >
              Status{sortIndicator('status')}
            </th>

            {/* Show Assigned To */}
            <th
              className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer select-none transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('assignedTo')}
            >
              Assigned To{sortIndicator('assignedTo')}
            </th>

            <th
              className="px-4 py-2 text-end text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer select-none transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('created')}
            >
              Created{sortIndicator('created')}
            </th>

            {/* Show Updated for support/admin/manager */}
            {showAdminColumns && (
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer select-none transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleSort('updated')}
              >
                Updated{sortIndicator('updated')}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedTickets.map(ticket => (
            <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              {/* ID Column */}
              {showAdminColumns && (
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  #{ticket.id}
                </td>
              )}

              {/* Title Column */}
              <td className="px-4 py-2">
                <Link
                  to={`/ticket/${ticket.id}`}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {ticket.title}
                </Link>
              </td>

              {/* Created By Column */}
              {showAdminColumns && (
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                   <UserBadge userId={ticket.createdBy} />
                </td>
              )}


              {/* Priority Column */}
              <td className="px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-sm border border-gray-300 dark:border-gray-700 ${getPriorityColor(ticket.priorityId).bg}`}
                  ></span>
                  <span className="text-gray-900 dark:text-gray-100">{getPriorityName(ticket.priorityId)}</span>
                </span>
              </td>

              {/* Status Column */}
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <StatusBadge text={getStatusName(ticket.statusId)} color={getStatusColor(ticket.statusId)} />
              </td>

              {/* Assigned To Column */}
              <td className="py-2 whitespace-nowrap text-center">
                {ticket.assignedTo ? (
                  <UserBadge userId={ticket.assignedTo} />
                ) : (
                  <UserBadge userId={null} />
                )}
              </td>

              {/* Created At Column */}
              <td className="px-4 py-2 whitespace-nowrap text-end text-sm text-gray-500 dark:text-gray-400">
                {new Date(ticket.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
                })}
              </td>

              {/* Updated At Column */}
              {showAdminColumns && (
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(ticket.updatedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
