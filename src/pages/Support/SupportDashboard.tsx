import { useMyAssignedTickets } from "@features/ticket/useMyAssignedTickets";
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
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [unassignedFilter] = useState(false);
  // priorities and statuses for filter bar
  const prioritiesFilter = [
    { id: 1, label: "Low", color: "#00C950" },
    { id: 2, label: "Medium", color: "#fbbf24" },
    { id: 3, label: "High", color: "#FF6900" },
    { id: 4, label: "Critical", color: "#FB2C36" },
  ];
  const statuses = [
    { id: 1, name: "Open" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "Waiting" },
    { id: 4, name: "On Hold" },
    { id: 5, name: "Resolved" },
    { id: 6, name: "Closed" },
    { id: 7, name: "Canceled" },
  ];
  // Filter tickets
  let filteredTickets = tickets;
  if (search) {
    filteredTickets = filteredTickets.filter(ticket =>
      ticket.title.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (priorityFilter) {
    const priorityObj = prioritiesFilter.find(p => p.label === priorityFilter);
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
  if (unassignedFilter) {
    filteredTickets = filteredTickets.filter(ticket => !ticket.assignedTo);
  }

  // Prepare data for DonutChart
  const slices = prioritiesFilter.map(p => ({
    label: p.label,
    value: tickets.filter(t => t.priorityId === p.id).length,
    color: p.color,
  }));

    // Prepare data for HorizontalBarChart (Tickets by Priority)
    const ticketsByPriority = prioritiesFilter.map(p => ({
      label: p.label,
      value: tickets.filter(t => t.priorityId === p.id).length,
      color : p.color,
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
          priorities={prioritiesFilter.map(p => ({ id: p.id, name: p.label }))}
          statuses={statuses}
        />
        <TicketList tickets={filteredTickets} showAdminColumns={true} />
      </div>
    </div>
  );
}
