import { useState } from "react";
import { useTickets } from "@features/ticket/useTickets";
import { useRole } from "@features/auth/useRole";
import { useUser } from "@features/user";
import { can } from "@features/auth/permissions";
import type { PermissionRole } from "@features/auth/permissions";
import TicketList from "@components/TicketList";
import TicketFilterBar from "@components/TicketFilterBar";
import { usePriorities } from "@features/ticket/usePriorities";
import { useStatuses } from "@features/ticket/useStatuses";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

export default function TicketListPage() {
  const { tickets, loading, error } = useTickets();
  const { activeRole, isManager } = useRole();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [unassignedFilter, setUnassignedFilter] = useState(false);
  const [myTicketsFilter, setMyTicketsFilter] = useState(false);
  // Get priorities and statuses for filter bar — served from cache (staleTime: Infinity)
  const { priorities } = usePriorities();
  const { statuses } = useStatuses();

  // Debounce the text search so filtering doesn't run on every keystroke
  const debouncedSearch = useDebouncedValue(searchQuery, 250);

  // Filter tickets based on search query
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
  if (unassignedFilter) {
    filteredTickets = filteredTickets.filter(ticket => !ticket.assignedTo);
  }
  if (myTicketsFilter && user?.id) {
    filteredTickets = filteredTickets.filter(ticket => ticket.assignedTo === user.id);
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
          unassignedFilter={unassignedFilter}
          setUnassignedFilter={setUnassignedFilter}
          {...(activeRole === "SUPPORT" ? { myTicketsFilter, setMyTicketsFilter } : {})}
        />
      )}
      {/* Search bar for USER role */}
      {activeRole === "USER" && (
        <div className="mb-4">
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      {/* MANAGER sees all tickets, like SUPPORT/ADMIN */}
      <TicketList
        tickets={filteredTickets}
        showAdminColumns={activeRole === "SUPPORT" ? false : canSeeAllColumns}
        showAssignedTo={isManager || undefined}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />
      {loading && <div className="mt-4 text-gray-500">Loading tickets...</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
}
