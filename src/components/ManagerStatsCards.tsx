
import type { Ticket } from "@features/ticket/useTickets";

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export default function ManagerStatsCards({ tickets }: { tickets: Ticket[] }) {
  const total = tickets.length;
  const unassigned = tickets.filter(t => !t.assignedTo).length;
  const waiting = tickets.filter(t => t.statusId === 3).length;
  const inProgress = tickets.filter(t => t.statusId === 2).length;
  const resolvedToday = tickets.filter(t => t.statusId === 5 && isToday(t.updatedAt)).length;

  const stats = [
    { label: "Total Tickets", value: total, color: "bg-blue-500 dark:bg-blue-600" },
    { label: "Unassigned", value: unassigned, color: "bg-gray-400 dark:bg-gray-700" },
    { label: "Waiting on User", value: waiting, color: "bg-yellow-400 dark:bg-yellow-600" },
    { label: "In Progress", value: inProgress, color: "bg-indigo-500 dark:bg-indigo-600" },
    { label: "Resolved Today", value: resolvedToday, color: "bg-green-500 dark:bg-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
      {stats.map(stat => (
        <div key={stat.label} className={`rounded-lg p-4 text-center shadow ${stat.color} text-white`}>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
