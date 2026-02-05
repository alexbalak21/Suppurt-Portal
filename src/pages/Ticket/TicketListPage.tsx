import { useState } from "react";
import { useTickets } from "../../features/ticket/useTickets";
import { useRole } from "../../features/auth/useRole";
import { can } from "../../features/auth/permissions";
import type { PermissionRole } from "../../features/auth/permissions";
import TicketList from "../../components/TicketList";

export default function TicketListPage() {
  const { tickets, loading, error } = useTickets();
  const { activeRole, isManager } = useRole();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tickets based on search query
  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <input
        type="text"
        placeholder="Search tickets..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded-lg w-full max-w-md"
      />
      {/* MANAGER sees all tickets, like SUPPORT/ADMIN */}
      <TicketList tickets={filteredTickets} showAdminColumns={canSeeAllColumns} />
      {loading && <div className="mt-4 text-gray-500">Loading tickets...</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
}
