import { useMyAssignedTickets } from "@features/ticket/useMyAssignedTickets";
import TicketList from "@components/TicketList";
import TicketsStatusBars from "@components/TicketsStatusBars";
import DonutChart from "@components/DonutChart";
import RecentActivity from "@components/RecentActivity";
import StatsCards from "@components/StatsCards";

export default function SupportDashboard() {
  const { tickets } = useMyAssignedTickets();

  // Prepare data for DonutChart
  const priorities = [
    { id: 1, label: "Low", color: "#60a5fa" },
    { id: 2, label: "Medium", color: "#fbbf24" },
    { id: 3, label: "High", color: "#f87171" },
    { id: 4, label: "Critical", color: "#a21caf" },
  ];
  const slices = priorities.map(p => ({
    label: p.label,
    value: tickets.filter(t => t.priorityId === p.id).length,
    color: p.color,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 my-6">
            Monitor your assigned tickets, view stats, and take action quickly.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            Assign Next Ticket
          </button>
          <button className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
            View SLA Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards tickets={tickets} />

      {/* Graphs */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TicketsStatusBars tickets={tickets} />
        <DonutChart title="Ticket Priorities" slices={slices} />
        <RecentActivity tickets={tickets} />
      </div>

      {/* Table of assigned tickets */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">My Assigned Tickets</h2>
        <TicketList tickets={tickets} />
      </div>
    </div>
  );
}
