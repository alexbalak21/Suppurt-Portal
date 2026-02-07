import type { Ticket } from "@features/ticket/useTickets";
import { useUsers } from "@features/user/useUsers";
import { usePriorities } from "@features/ticket/usePriorities";

interface Props {
  tickets: Ticket[];
}

export default function PriorityHeatmap({ tickets }: Props) {
  const { users } = useUsers();
  const { priorities } = usePriorities();

  const agents = users.filter(u => u.roles.includes("SUPPORT"));

  const getCount = (agentId: number, priorityId: number) =>
    tickets.filter(t => t.assignedTo === agentId && t.priorityId === priorityId).length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <div className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-200">
        Priority Heatmap
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left">Agent</th>
            {priorities.map(p => (
              <th key={p.id} className="px-2 py-1 text-center">{p.name}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {agents.map(agent => (
            <tr key={agent.id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-2 py-1">{agent.name}</td>
              {priorities.map(p => (
                <td key={p.id} className="px-2 py-1 text-center">
                  {getCount(agent.id, p.id)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
