import { useRole } from "@features/auth/useRole";
import { useTickets } from "@features/ticket/useTickets";
import { useUsers } from "@features/user/useUsers";
import ManagerStatsCards from "@components/ManagerStatsCards";
import TeamWorkloadChart from "@components/TeamWorkloadChart";
import PriorityHeatmap from "@components/PriorityHeatmap";
import TeamRecentActivity from "@components/TeamRecentActivity";
import AssignTicketModal from "@components/AssignTicketModal";
import TicketList from "@components/TicketList";
import { useState, useEffect } from "react";

export default function ManagerDashboard() {
		const { isManager } = useRole();
		const { tickets, loading, error } = useTickets();
		const { users } = useUsers({role : 3});
		const [assignModal, setAssignModal] = useState<{ open: boolean; ticketId: number | null }>({ open: false, ticketId: null });

		useEffect(() => {
			console.log('ManagerDashboardLegacy mounted');
			console.log('Users:', users);
		}, [users]);

		if (!isManager) return <div className="p-8 text-red-600">Access denied.</div>;
		if (loading) return <div className="p-8 text-gray-500">Loading tickets...</div>;
		if (error) return <div className="p-8 text-red-600">{error}</div>;

		// Handler stub for assignment
		const handleAssign = (_ticketId: number, _agentId: number) => {
			// TODO: Wire backend
			setAssignModal({ open: false, ticketId: null });
		};

		return (
			<div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
				<h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
				<ManagerStatsCards tickets={tickets} />
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
					onClose={() => setAssignModal({ open: false, ticketId: null })}
					onAssign={handleAssign}
				/>
			</div>
		);
}
