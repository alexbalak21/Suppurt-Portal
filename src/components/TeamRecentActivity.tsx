import type { BasicUser } from "@features/user/useUsers";
import type { Ticket } from "@features/ticket/useTickets";
import StatusBadge from "@components/StatusBadge";

function getUser(users: BasicUser[], id: number | null) {
  return users.find(u => u.id === id);
}

export default function TeamRecentActivity({ tickets, users }: { tickets: Ticket[]; users: BasicUser[] }) {
  const recent = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 mt-8">
      <div className="font-semibold mb-2">Recent Team Activity</div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {recent.map(ticket => {
          const updater = getUser(users, ticket.assignedTo) || { name: "Unassigned" };
          return (
            <li key={ticket.id} className="py-2 flex items-center gap-4">
              <span className="font-medium text-indigo-600">{ticket.title}</span>
              <StatusBadge text={ticket.statusId + ""} color="gray" />
              <span className="text-xs text-gray-500">{updater.name}</span>
              <span className="text-xs text-gray-400 ml-auto">{new Date(ticket.updatedAt).toLocaleString()}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
