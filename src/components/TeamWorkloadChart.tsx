import type { BasicUser } from "@features/user/useUsers";
import type { Ticket } from "@features/ticket/useTickets";

function getColor(idx: number) {
  const palette = [
    "#6366f1", // indigo
    "#f59e42", // orange
    "#10b981", // green
    "#ef4444", // red
    "#fbbf24", // yellow
    "#3b82f6", // blue
    "#a21caf", // purple
    "#14b8a6", // teal
    "#eab308", // amber
    "#64748b", // slate
  ];
  return palette[idx % palette.length];
}

export default function TeamWorkloadChart({ tickets, users }: { tickets: Ticket[]; users: BasicUser[] }) {
  const agentIds = users.map(u => u.id);
  const agentCounts = agentIds.map(id => tickets.filter(t => t.assignedTo === id).length);
  const unassigned = tickets.filter(t => !t.assignedTo).length;
  const total = agentCounts.reduce((a, b) => a + b, 0) + unassigned;
  const slices = [...agentCounts, unassigned];
  const slicePercents = slices.map(count => (total ? (count / total) * 100 : 0));
  let start = 0;
  const conic = slicePercents.map((p, i) => {
    const end = start + p;
    const color = i === slices.length - 1 ? "#d1d5db" : getColor(i);
    const seg = `${color} ${start}% ${end}%`;
    start = end;
    return seg;
  }).join(", ");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
      <div className="font-semibold mb-2">Assignment Workload</div>
      <div className="w-32 h-32 rounded-full mb-2" style={{ background: `conic-gradient(${conic})` }} />
      <div className="flex flex-wrap justify-center gap-2 text-xs mt-2">
        {users.map((u, i) => (
          <span key={u.id} className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: getColor(i) }} />{u.name}</span>
        ))}
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-gray-300" />Unassigned</span>
      </div>
    </div>
  );
}
import type { Ticket } from "@features/ticket/useTickets";
import { useUsers } from "@features/user/useUsers";

interface Props {
  tickets: Ticket[];
  users: any;
}

export default function TeamWorkloadChart({ props }: { props: Props }) {
  const { tickets, users } = props;
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
