import { useStatuses } from "@features/ticket/useStatuses";
import type { Ticket } from "@features/ticket/useTickets";
import StatusBadge from "@components/StatusBadge";
import { Link } from "react-router-dom";
import { colorNames } from "@features/theme/colors";
import type { Colors } from "@features/theme/colors";

interface Props {
  tickets: Ticket[];
}

export default function RecentActivity({ tickets }: Props) {
  const { statuses } = useStatuses();

  const getStatus = (id: number) =>
    statuses.find((s) => s.id === id)?.name || `Status ${id}`;

  // Only allow valid BadgeColor values from colorNames
  const getStatusColor = (id: number): Colors => {
    const color = statuses.find((s) => s.id === id)?.color;
    return colorNames.includes(color as Colors) ? (color as Colors) : "gray";
  };

  const recent = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 mb-6">
      <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
        Recent Activity
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {recent.length === 0 && (
          <li className="py-2 text-gray-400 text-sm">No recent activity.</li>
        )}

        {recent.map((t) => (
          <li key={t.id} className="flex items-center py-2">
            <Link
              to={`/ticket/${t.id}`}
              className="flex-1 truncate font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t.title}
            </Link>

            <StatusBadge
              text={getStatus(t.statusId)}
              color={getStatusColor(t.statusId)}
            />

            <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
              {new Date(t.updatedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
