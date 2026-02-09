import type { BasicUser } from "@features/user/useUsers";
import type { Ticket } from "@features/ticket/useTickets";
import { priorityColors } from "@utils/priorityColors";

const priorities = [
  { id: 1, label: "Low" },
  { id: 2, label: "Medium" },
  { id: 3, label: "High" },
  { id: 4, label: "Critical" },
];

export default function PriorityHeatmap({ tickets, users }: { tickets: Ticket[]; users: BasicUser[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 overflow-x-auto">
      <div className="font-semibold mb-2">Priority Heatmap</div>
      <table className="min-w-full text-xs text-center">
        <thead>
          <tr>
            <th className="px-2 py-1">Agent</th>
            {priorities.map(p => (
              <th key={p.id} className="px-2 py-1" style={{ color: priorityColors[p.id as keyof typeof priorityColors]?.text }}>{p.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(agent => (
            <tr key={agent.id}>
              <td className="px-2 py-1 font-medium text-left">{agent.name}</td>
              {priorities.map(p => {
                const count = tickets.filter(t => t.assignedTo === agent.id && t.priorityId === p.id).length;
                const colorKey = p.id as keyof typeof priorityColors;
                return (
                  <td key={p.id} className="px-2 py-1" style={{ background: priorityColors[colorKey]?.bg, color: priorityColors[colorKey]?.text }}>{count}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
