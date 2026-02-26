import { useState } from "react";
import { useTickets } from "@features/ticket/useTickets";
import { useRole } from "@features/auth/useRole";
import { can } from "@features/auth/permissions";
import type { PermissionRole } from "@features/auth/permissions";
import TicketList from "@components/TicketList";
import TicketFilterBar from "@components/TicketFilterBar";
import { usePriorities } from "@features/ticket/usePriorities";
import { useStatuses } from "@features/ticket/useStatuses";

export default function TicketListPage() {
  const { tickets, loading, error } = useTickets();
  const { activeRole, isManager } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // Get priorities and statuses for filter bar
  const { priorities } = usePriorities();
  const { statuses } = useStatuses();

  // Filter tickets based on search query
  let filteredTickets = tickets;
  if (searchQuery) {
    filteredTickets = filteredTickets.filter(ticket =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Determine page title and description based on role
  const getPageHeader = () => {
    if (activeRole === "SUPPORT" || isManager || activeRole === "ADMIN") {
      return {
        title: "Support Tickets",
        description: "View and manage all tickets in the queue"
      };
    }
    return {
      title: "My Tickets",
      description: ""
    };
  };

  const header = getPageHeader();
  const canSeeAllColumns = can("changeStatus", (activeRole as PermissionRole) || "VISITOR");

  return (
    <div className={`mx-auto px-4 py-6 ${canSeeAllColumns ? "max-w-7xl" : "max-w-4xl"}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{header.title}</h1>
        {header.description && (
          <p className="text-gray-600 dark:text-gray-300">{header.description}</p>
        )}
      </div>
      {/* Show TicketFilterBar for MANAGER, SUPPORT, ADMIN */}
      {(activeRole === "SUPPORT" || isManager || activeRole === "ADMIN") && (
        <TicketFilterBar
          search={searchQuery}
          setSearch={setSearchQuery}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorities={priorities}
          statuses={statuses}
        />
      )}
      {/* MANAGER sees all tickets, like SUPPORT/ADMIN */}
      <TicketList
        tickets={filteredTickets}
        showAdminColumns={activeRole === "SUPPORT" ? false : canSeeAllColumns}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />
      {loading && <div className="mt-4 text-gray-500">Loading tickets...</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
}
