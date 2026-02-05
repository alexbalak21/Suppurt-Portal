import { useRole } from "@features/auth/useRole";
import { useTickets } from "@features/ticket/useTickets";
import { useUsers } from "@features/user/useUsers";
import ManagerStatsCards from "../managerDashboard/components/ManagerStatsCards";
import TeamWorkloadChart from "../managerDashboard/components/TeamWorkloadChart";
import PriorityHeatmap from "../managerDashboard/components/PriorityHeatmap";
import TeamRecentActivity from "../managerDashboard/components/TeamRecentActivity";
import AssignTicketModal from "../managerDashboard/components/AssignTicketModal";
import TicketList from "@components/TicketList";
import { useState } from "react";

export default function ManagerDashboard() {
  const { isManager } = useRole();
  const { tickets, loading, error } = useTickets();
  const { users } = useUsers();
  const [assignModal, setAssignModal] = useState<{ open: boolean; ticketId: number | null }>({ open: false, ticketId: null });

  if (!isManager) return <div className="p-8 text-red-600">Access denied.</div>;

  if (loading) return <div className="p-8 text-gray-500">Loading tickets...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  // Handler stub for assignment
  const handleAssign = (ticketId: number, agentId: number) => {
    // TODO: Wire backend
    setAssignModal({ open: false, ticketId: null });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
      <ManagerStatsCards tickets={tickets} users={users} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TeamWorkloadChart tickets={tickets} users={users} />
        <PriorityHeatmap tickets={tickets} users={users} />
      </div>
      <TeamRecentActivity tickets={tickets} users={users} />
      <div className="mt-8">
        <TicketList tickets={tickets} showAdminColumns={true} />
      </div>
      <AssignTicketModal
        open={assignModal.open}
        ticketId={assignModal.ticketId}
        users={users}
        onClose={() => setAssignModal({ open: false, ticketId: null })}
        onAssign={handleAssign}
      />
    </div>
  );
}
