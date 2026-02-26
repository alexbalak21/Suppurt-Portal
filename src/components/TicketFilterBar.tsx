

import { XCircleIcon } from "@heroicons/react/24/outline";


interface TicketFilterBarProps {
	search: string;
	setSearch: (v: string) => void;
	priorityFilter: string;
	setPriorityFilter: (v: string) => void;
	statusFilter: string;
	setStatusFilter: (v: string) => void;
	priorities: Array<{ id: number; name: string }>;
	statuses: Array<{ id: number; name: string }>;
	unassignedFilter?: boolean;
	setUnassignedFilter?: (v: boolean) => void;
	myTicketsFilter?: boolean;
	setMyTicketsFilter?: (v: boolean) => void;
}

export default function TicketFilterBar({
	search,
	setSearch,
	priorityFilter,
	setPriorityFilter,
	statusFilter,
	setStatusFilter,
	priorities,
	statuses,
	unassignedFilter = false,
	setUnassignedFilter,
	myTicketsFilter = false,
	setMyTicketsFilter,
}: TicketFilterBarProps) {
	return (
		<div className="mb-4 flex flex-wrap gap-2 justify-start items-center">
			<input
				type="text"
				className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-100"
				placeholder="Search by title..."
				value={search}
				onChange={e => setSearch(e.target.value)}
			/>
			<div className="flex items-center ml-4">
				{priorityFilter && (
					<button
						type="button"
						className="w-7 ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
						onClick={() => setPriorityFilter("")}
						title="Clear priority filter"
					>
						<XCircleIcon className="h-6 w-6 mr-1" />
					</button>
				)}
				<select
					className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
					value={priorityFilter}
					onChange={e => {
						setPriorityFilter(e.target.value);
					}}
				>
					<option value="">Priority</option>
					{priorities.map(p => (
						<option key={p.id} value={p.name}>{p.name}</option>
					))}
				</select>
			</div>
			{/* STATUS SELECTOR */}
			<div className="flex items-center ml-4">
				{statusFilter && (
					<button
						type="button"
						className="w-7 ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
						onClick={() => setStatusFilter("")}
						title="Clear status filter"
					>
						<XCircleIcon className="h-6 w-6 mr-1" />
					</button>
				)}
				<select
					className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
					value={statusFilter}
					onChange={e => {
						setStatusFilter(e.target.value);
					}}
				>
					<option value="">Status</option>
					{statuses && statuses.map(s => (
						<option key={s.id} value={s.name}>{s.name}</option>
					))}
				</select>
			</div>
			
			{/* Unassigned filter button */}
			{setUnassignedFilter && (
				<div className="flex items-center ml-4">
					{unassignedFilter && (
						<button
							type="button"
							className="w-7 ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
							onClick={() => setUnassignedFilter(false)}
							title="Clear unassigned filter"
						>
							<XCircleIcon className="h-6 w-6 mr-1" />
						</button>
					)}
					<button
						type="button"
						className={`px-3 py-2 rounded transition-colors ${myTicketsFilter ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100' : unassignedFilter ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-indigo-400 hover:text-white'}`}
						onClick={() => !myTicketsFilter && setUnassignedFilter(!unassignedFilter)}
						disabled={myTicketsFilter}
						title={myTicketsFilter ? 'Disable "My Tickets" first' : 'Show only unassigned tickets'}
					>
						Unassigned
					</button>
				</div>
			)}
			{/* My Tickets filter button */}
			{setMyTicketsFilter && (
				<div className="flex items-center ml-4">
					{myTicketsFilter && (
						<button
							type="button"
							className="w-7 ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
							onClick={() => setMyTicketsFilter(false)}
							title="Clear my tickets filter"
						>
							<XCircleIcon className="h-6 w-6 mr-1" />
						</button>
					)}
					<button
						type="button"
						className={`px-3 py-2 rounded transition-colors ${unassignedFilter ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100' : myTicketsFilter ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-green-400 hover:text-white'}`}
						onClick={() => !unassignedFilter && setMyTicketsFilter(!myTicketsFilter)}
						disabled={unassignedFilter}
						title={unassignedFilter ? 'Disable "Unassigned" first' : 'Show only tickets assigned to me'}
					>
						My Tickets
					</button>
				</div>
			)}
		</div>
	);
}
