import { useMyAssignedTickets } from "@features/ticket/useMyAssignedTickets";
import { usePriorities } from "@features/ticket/usePriorities";
import { useStatuses } from "@features/ticket/useStatuses";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";
import TicketList from "@components/TicketList";
import TicketsStatusBars from "@components/TicketsStatusBars";
import DonutChart from "@components/DonutChart";
import RecentActivity from "@components/RecentActivity";
import StatsCards from "@components/StatsCards";
import { useState } from "react";
import TicketFilterBar from "@/components/TicketFilterBar";
import HorizontalBarChart from "@components/HorizontalBarChart";

export default function SupportDashboard() {
  const { tickets } = useMyAssignedTickets();
  // Use real priority/status data (cached from previous fetches — staleTime: Infinity)
  const { priorities } = usePriorities();
  const { statuses } = useStatuses();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  // Filter tickets
  let filteredTickets = tickets;
  if (debouncedSearch) {
    filteredTickets = filteredTickets.filter(ticket =>
      ticket.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }
  if (priorityFilter) {
    const priorityObj = priorities.find(p => p.name === priorityFilter);
    if (priorityObj) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priorityId === priorityObj.id);
    }
  }
  if (statusFilter) {
    const statusObj = statuses.find(s => s.name === statusFilter);
    if (statusObj) {
      filteredTickets = filteredTickets.filter(ticket => ticket.statusId === statusObj.id);
    }
  }

  // Prepare data for DonutChart
  const slices = priorities.map(p => ({
    label: p.name,
    value: tickets.filter(t => t.priorityId === p.id).length,
    color: p.color,
  }));

  // Prepare data for HorizontalBarChart (Tickets by Priority)
  const ticketsByPriority = priorities.map(p => ({
    label: p.name,
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
        
      </div>

      {/* Stats Cards */}
      <StatsCards tickets={tickets} />

      {/* Graphs */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TicketsStatusBars tickets={tickets} />
        <DonutChart title="Ticket Priorities" slices={slices} />
        <HorizontalBarChart title="Tickets by Priority" bars={ticketsByPriority} />
        <RecentActivity tickets={tickets} />
      </div>

      {/* Table of assigned tickets */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">My Tickets</h2>
        <TicketFilterBar
          search={search}
          setSearch={setSearch}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorities={priorities}
          statuses={statuses}
        />
        <TicketList tickets={filteredTickets} showAdminColumns={true} />
      </div>
    </div>
  );
}
