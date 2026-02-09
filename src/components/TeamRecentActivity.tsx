import type { BasicUser } from "../../../features/user/useUsers";
import type { Ticket } from "../../../features/ticket/useTickets";
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
import type { Ticket } from "@features/ticket/useTickets";
import { useStatuses } from "@features/ticket/useStatuses";
import StatusBadge from "@components/StatusBadge";
import { Link } from "react-router-dom";

interface Props {
  tickets: Ticket[];
  users: any;
}

export default function TeamRecentActivity({ props }: { props: Props }) {
  const { tickets, users } = props;
  const { statuses } = useStatuses();

  const getStatus = (id: number) =>
    statuses.find(s => s.id === id)?.name || "Unknown";

  const getColor = (id: number) =>
    statuses.find(s => s.id === id)?.color || "gray";

  const recent = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 mb-6">
      <div className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-200">
        Recent Team Activity
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {recent.map(t => (
          <li key={t.id} className="flex items-center py-2">
            <Link
              to={`/ticket/${t.id}`}
              className="flex-1 truncate font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t.title}
            </Link>

            <StatusBadge text={getStatus(t.statusId)} color={getColor(t.statusId)} />

            <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
              {new Date(t.updatedAt).toLocaleDateString("en-GB")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
