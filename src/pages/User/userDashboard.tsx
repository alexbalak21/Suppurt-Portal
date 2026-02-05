import { useRole } from "@features/auth/useRole";
import { useTickets } from "@features/ticket/useTickets";
import TicketList from "@components/TicketList";

import StatsCards from "@components/StatsCards";
import PriorityChart from "@components/PriorityChart";
import RecentActivity from "@components/RecentActivity";

export default function UserDashboard() {
  const { isUser } = useRole();
  const { tickets, loading, error } = useTickets();

  if (!isUser) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 py-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>

      <div className="mb-8 text-gray-600 dark:text-gray-300">
        Overview of your support tickets and recent activity.
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          <StatsCards tickets={tickets} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <PriorityChart tickets={tickets} />
            <RecentActivity tickets={tickets} />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
            <div className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Your Tickets
            </div>

            <TicketList tickets={tickets} showAdminColumns={false} />
          </div>
        </>
      )}
    </div>
  );
}
