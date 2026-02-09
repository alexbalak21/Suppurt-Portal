import { useTickets } from "@features/ticket/useTickets";
import { useUsers } from "@features/user/useUsers";
import { usePriorities } from "@features/ticket/usePriorities";
import { useStatuses } from "@features/ticket/useStatuses";
import ManagerStatsCards from "@components/ManagerStatsCards";
import PriorityHeatmap from "@components/PriorityHeatmap";
import TeamRecentActivity from "@components/TeamRecentActivity";
import TeamWorkloadChart from "@components/TeamWorkloadChart";

export default function ManagerDashboard() {
  const { tickets, loading: ticketsLoading, error: ticketsError } = useTickets();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { priorities, loading: prioritiesLoading, error: prioritiesError } = usePriorities();
  const { statuses, loading: statusesLoading, error: statusesError } = useStatuses();

  const loading = ticketsLoading || usersLoading || prioritiesLoading || statusesLoading;
  const error = ticketsError || usersError || prioritiesError || statusesError;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-3">Manager Dashboard</h1>
      <p className="text-gray-700 mb-2">Welcome, Manager! Here you can oversee all tickets, assign them to support users, and review all messages and notes.</p>
      <p className="text-gray-700 mb-6">Use the navigation to access ticket management and reporting features.</p>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading data...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          <ManagerStatsCards tickets={tickets} users={users} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <PriorityHeatmap tickets={tickets} users={users} />
            <TeamWorkloadChart tickets={tickets} users={users} />
          </div>
          <TeamRecentActivity tickets={tickets} users={users} />
        </>
      )}
    </div>
  );
}
