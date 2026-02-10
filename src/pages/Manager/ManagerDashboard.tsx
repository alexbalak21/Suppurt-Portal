import { useRole } from "@features/auth/useRole";
import { useTickets } from "@features/ticket/useTickets";
import { useUsers } from "@features/user/useUsers";
import TicketsStatusBars from "@components/TicketsStatusBars";
import DonutChart from "@components/DonutChart";
import { ManagerPriorityMatrix } from "@components/ManagerPriorityMatrix";
import AssignTicketModal from "@components/AssignTicketModal";
import TicketList from "@components/TicketList";
import { useState, useEffect } from "react";
import { usePriorities } from "@features/ticket/usePriorities";
import { priorityDotColors } from "@features/theme/priorityDotColors";


export default function ManagerDashboard() {
	// All hooks must be called unconditionally and in the same order
	const { isManager } = useRole();
	const { tickets, loading, error } = useTickets();
	const { users } = useUsers({ role: 3 });
	const { priorities } = usePriorities();
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

	// Prepare slices for DonutChart
	const palette = [
		"#6366f1", // indigo
		"#f59e42", // orange
		"#10b981", // green
		"#ef4444", // red
		"#fbbf24", // yellow
		"#3b82f6", // blue
		"#a21caf", // purple
		"#14b8a6", // teal
		"#eab308", // amber
		"#64748b", // slate
	];

	
	const agentSlices = users.map((u, i) => ({
		label: u.name,
		value: tickets.filter(t => t.assignedTo === u.id).length,
		color: palette[i % palette.length],
	}));
	const unassignedCount = tickets.filter(t => !t.assignedTo).length;
	const slices = [
		...agentSlices,
		{ label: "Unassigned", value: unassignedCount, color: "#d1d5db" },
	];

	// Use hex values from priorityDotColors for priorities
	const prioritySlices = priorities.map(priority => {
		const colorEntry = priorityDotColors[priority.id as keyof typeof priorityDotColors];
		return {
			label: priority.name,
			value: tickets.filter(t => t.priorityId === priority.id).length,
			color: colorEntry?.hex || '#6b7280',
		};
	});

		return (
			<div className="mx-auto max-w-7xl space-y-8">
				<h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
				   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					   {/* First row */}
					   <div className="md:col-span-2">
						   <TicketsStatusBars tickets={tickets} />
					   </div>
					   <div className="md:col-span-2">
						   <DonutChart title="Tickets by Priority" slices={prioritySlices} />
					   </div>
					   {/* Second row */}
					   <div className="md:col-span-2">
						   <DonutChart title="Assignment Workload" slices={slices} />
					   </div>
					   <div className="md:col-span-2">
						   <ManagerPriorityMatrix tickets={tickets} users={users} priorities={priorities} />
					   </div>
				   </div>
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

// Wrapper component to use MatrixTable for ticket counts by user and priority
// The following duplicate function definition is removed
}


