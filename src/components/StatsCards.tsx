import { useStatuses } from "@features/ticket/useStatuses";
import type { Ticket } from "@features/ticket/useTickets";
import { tailwindColors } from "@utils/tailwindColors";

interface Props {
  tickets: Ticket[];
}

export default function StatsCards({ tickets }: Props) {
  const { statuses } = useStatuses();

  const mainStatusIds = [1, 2, 3, 4, 5];

  const statusCounts = mainStatusIds.map((id) => {
    const status = statuses.find((s) => s.id === id);
    const color = status?.color;
    const colorObj = tailwindColors[color as string] || tailwindColors.gray;
    const colorClass = `${colorObj.light} ${colorObj.dark}`;
    return {
      id,
      label: status?.name || `Status ${id}`,
      colorClass,
      count: tickets.filter((t) => t.statusId === id).length,
    };
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
      {statusCounts.map((s) => (
        <div
          key={s.id}
          className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4"
        >
          <span
            className={`w-3 h-3 rounded-full mr-3 ${s.colorClass}`}
          ></span>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {s.label}
            </div>
            <div className="text-xl font-semibold">{s.count}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
