import { useState } from "react";
import { useTickets } from "../../features/ticket/useTickets";
import { useRole } from "../../features/auth/useRole";
import { can } from "../../features/auth/permissions";
import type { PermissionRole } from "../../features/auth/permissions";
import TicketList from "../../components/TicketList";

export default function TicketListPage() {
  const { tickets, loading, error } = useTickets();
  const { activeRole } = useRole();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tickets based on search query
  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine page title and description based on role
  const getPageHeader = () => {
    if (activeRole === "SUPPORT" || activeRole === "MANAGER" || activeRole === "ADMIN") {
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

      {loading && <div>Loading tickets...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search tickets by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <TicketList tickets={filteredTickets} showAdminColumns={canSeeAllColumns} />
        </>
      )}
    </div>
  );
}
