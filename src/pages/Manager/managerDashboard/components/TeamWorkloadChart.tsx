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
