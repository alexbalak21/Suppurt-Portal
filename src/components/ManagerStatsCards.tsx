import type { Ticket } from "@features/ticket/useTickets";
import { useStatuses } from "@features/ticket/useStatuses";

interface Props {
  tickets: Ticket[];
}

export default function ManagerStatsCards({ tickets }: Props) {
  const { statuses } = useStatuses();

  const total = tickets.length;
  const unassigned = tickets.filter(t => !t.assignedTo).length;
  const waiting = tickets.filter(t => t.statusId === 3).length; // Waiting
  const inProgress = tickets.filter(t => t.statusId === 2).length; // In Progress

  const today = new Date().toDateString();
  const resolvedToday = tickets.filter(t => {
    if (!t.resolvedAt) return false;
    return new Date(t.resolvedAt).toDateString() === today;
  }).length;

  const cards = [
    { label: "Total Tickets", value: total },
    { label: "Unassigned", value: unassigned },
    { label: "Waiting on User", value: waiting },
    { label: "In Progress", value: inProgress },
    { label: "Resolved Today", value: resolvedToday },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 text-center"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">{c.label}</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}
