import { usePriorities } from "@features/ticket/usePriorities";
import type { Ticket } from "@features/ticket/useTickets";

interface Props {
  tickets: Ticket[];
}

export default function PriorityChart({ tickets }: Props) {
  const { priorities } = usePriorities();

  // Map priority color to Tailwind and hex for chart
  const colorHexMap: Record<string, string> = {
    green: "#22c55e",
    yellow: "#eab308",
    orange: "#f97316",  
    red: "#ef4444",
  };
  const colorBgMap: Record<string, string> = {
    green: "bg-green-500 dark:bg-green-600",
    yellow: "bg-yellow-500 dark:bg-yellow-600",
    orange: "bg-orange-500 dark:bg-orange-600",
    red: "bg-red-500 dark:bg-red-600",
  };
  const counts = priorities.map((p) => ({
    id: p.id,
    name: p.name,
    count: tickets.filter((t) => t.priorityId === p.id).length,
    color: colorBgMap[p.color] || "bg-gray-400",
    hex: colorHexMap[p.color] || "#999999",
  }));

  const total = counts.reduce((sum, p) => sum + p.count, 0) || 1;

  // Build conic gradient segments
  let currentAngle = 0;
  const segments: string[] = [];

  counts.forEach((p) => {
    const sliceAngle = (p.count / total) * 360;
    const start = currentAngle;
    const end = currentAngle + sliceAngle;

    segments.push(`${p.hex} ${start}deg ${end}deg`);
    currentAngle = end;
  });

  const gradient = `conic-gradient(${segments.join(", ")})`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 mb-6">
      <div className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-200">
        Tickets by Priority
      </div>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full shadow-inner"
            style={{ background: gradient }}
          ></div>
          <div
            className="absolute rounded-full bg-white dark:bg-gray-900"
            style={{ width: '60%', height: '60%' }}
          ></div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {counts.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm ${p.color}`}></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {p.name} ({p.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
