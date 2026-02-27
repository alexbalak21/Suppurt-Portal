import { useRole } from "@features/auth/useRole";
import { useTickets } from "@features/ticket/useTickets";
import { useNavigate } from "react-router-dom";
import TicketList from "@components/TicketList";
import Button from "@components/Button";

import StatsCards from "@components/StatsCards";
import PriorityChart from "@components/PriorityChart";
import RecentActivity from "@components/RecentActivity";
import { Spinner } from "@components/Spinner";

export default function UserDashboard() {
  const { isUser } = useRole();
  const { tickets, loading, error } = useTickets();
  const navigate = useNavigate();

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
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <div className="mt-1 text-gray-600 dark:text-gray-300">
            Overview of your support tickets and recent activity.
          </div>
        </div>
        <Button
          onClick={() => navigate("/create-ticket")}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Create Ticket
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spinner size="md" color="primary" />
        </div>
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
