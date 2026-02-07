import { useTickets } from "@features/ticket/useTickets";
import ManagerStatsCards from "@components/ManagerStatsCards";
import PriorityHeatmap from "@components/PriorityHeatmap";
import TeamRecentActivity from "@components/TeamRecentActivity";
import TeamWorkloadChart from "@components/TeamWorkloadChart";

export default function ManagerDashboard() {
  const { tickets, loading, error } = useTickets();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-3">Manager Dashboard</h1>
      <p className="text-gray-700 mb-2">Welcome, Manager! Here you can oversee all tickets, assign them to support users, and review all messages and notes.</p>
      <p className="text-gray-700 mb-6">Use the navigation to access ticket management and reporting features.</p>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading tickets...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          <ManagerStatsCards tickets={tickets} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <PriorityHeatmap tickets={tickets} />
            <TeamWorkloadChart tickets={tickets} />
          </div>
          <TeamRecentActivity tickets={tickets} />
        </>
      )}
    </div>
  );
}
