import { useRole } from "@features/auth/useRole";
import { useTickets } from "@features/ticket/useTickets";
import { useUsers } from "@features/user/useUsers";
import TicketsStatusBars from "@components/TicketsStatusBars";
import DonutChart from "@components/DonutChart";
import HorizontalBarChart from "@components/HorizontalBarChart";
import { ManagerPriorityMatrix } from "@components/ManagerPriorityMatrix";
import AssignTicketModal from "@components/AssignTicketModal";
import TicketList from "@components/TicketList";
import { useState, useEffect } from "react";
import { usePriorities } from "@features/ticket/usePriorities";
import { priorityDotColors } from "@features/theme/priorityDotColors";
import ManagerStatsCards from "@components/ManagerStatsCards";
import TicketFilterBar from "@components/TicketFilterBar";
import { useStatuses } from "@features/ticket/useStatuses";
import {Spinner} from "@components/Spinner";


export default function ManagerDashboard() {
	// All hooks must be called unconditionally and in the same order
	const { isManager } = useRole();
	const { tickets, loading, error } = useTickets();
	const { users } = useUsers({ role: 3 });
	const { priorities } = usePriorities();
	const { statuses } = useStatuses();
	const [assignModal, setAssignModal] = useState<{ open: boolean; ticketId: number | null }>({ open: false, ticketId: null });
	const [search, setSearch] = useState("");
	// Priority filter state
	const [priorityFilter, setPriorityFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [unassignedFilter, setUnassignedFilter] = useState(false);
	// Filter tickets by search and priority
	const filteredTickets = tickets
		.filter(ticket => ticket.title.toLowerCase().includes(search.toLowerCase()))
		.filter(ticket => {
			if (!priorityFilter) return true;
			const priorityObj = priorities.find(p => p.name.toLowerCase() === priorityFilter.toLowerCase());
			return priorityObj ? ticket.priorityId === priorityObj.id : true;
		})
		.filter(ticket => {
			if (!statusFilter) return true;
			const statusObj = statuses.find(s => s.name.toLowerCase() === statusFilter.toLowerCase());
			return statusObj ? ticket.statusId === statusObj.id : true;
		})
		.filter(ticket => {
			if (!unassignedFilter) return true;
			return !ticket.assignedTo;
		});

	useEffect(() => {
		console.log('ManagerDashboardLegacy mounted');
		console.log('Users:', users);
	}, [users]);

	if (!isManager) return <div className="p-8 text-red-600">Access denied.</div>;
		if (loading) return (
				<div className="p-8 flex justify-center items-center">
					<Spinner size="md" color="primary" />
				</div>
			);
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
		{ label: "Unassigned", value: unassignedCount, color: "#99A1AF" },
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
			<h1 className="text-3xl font-bold my-4">Manager Dashboard</h1>
			<ManagerStatsCards tickets={tickets} />
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
					<HorizontalBarChart title="Assignment Workload" bars={slices} />
				</div>
				<div className="md:col-span-2">
					<ManagerPriorityMatrix tickets={tickets} users={users} priorities={priorities} />
				</div>
			</div>
			<div className="mt-8">
				<TicketFilterBar
					search={search}
					setSearch={setSearch}
					priorityFilter={priorityFilter}
					setPriorityFilter={setPriorityFilter}
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
					priorities={priorities}
					statuses={statuses}
					unassignedFilter={unassignedFilter}
					setUnassignedFilter={setUnassignedFilter}
				/>
				<TicketList tickets={filteredTickets} showAdminColumns={true} showAssignedTo={true} priorityFilter={priorityFilter} statusFilter={statusFilter} />
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


