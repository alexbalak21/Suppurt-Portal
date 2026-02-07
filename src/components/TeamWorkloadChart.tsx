import type { Ticket } from "@features/ticket/useTickets";
import { useUsers } from "@features/user/useUsers";

interface Props {
  tickets: Ticket[];
}

export default function TeamWorkloadChart({ tickets }: Props) {
  const { users } = useUsers();
  const agents = users.filter(u => u.roles.includes("SUPPORT"));

  const counts = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    count: tickets.filter(t => t.assignedTo === agent.id).length,
    color: agent.id % 2 === 0 ? "#6366f1" : "#10b981", // simple alternating colors
  }));

  const unassigned = {
    name: "Unassigned",
    count: tickets.filter(t => !t.assignedTo).length,
    color: "#f59e0b",
  };

  const all = [...counts, unassigned];
  const total = all.reduce((sum, a) => sum + a.count, 0) || 1;

  let currentAngle = 0;
  const segments: string[] = [];

  all.forEach(a => {
    const slice = (a.count / total) * 360;
    segments.push(`${a.color} ${currentAngle}deg ${currentAngle + slice}deg`);
    currentAngle += slice;
  });

  const gradient = `conic-gradient(${segments.join(", ")})`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <div className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-200">
        Workload Distribution
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ background: gradient }}></div>
          <div className="absolute rounded-full bg-white dark:bg-gray-900" style={{ width: "60%", height: "60%" }}></div>
        </div>

        <div className="space-y-2">
          {all.map(a => (
            <div key={a.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: a.color }}></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {a.name} ({a.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
