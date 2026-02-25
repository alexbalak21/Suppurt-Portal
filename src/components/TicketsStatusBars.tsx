// TicketsStatusBars.tsx
import type { Ticket } from "@features/ticket/useTickets";
import { VerticalBars, type BarSlice } from "./VerticalBars";

const STATUSES = [
  { id: 1, name: "Open", color: "bg-blue-500" },
  { id: 2, name: "In Progress", color: "bg-indigo-500" },
  { id: 3, name: "Waiting", color: "bg-yellow-400" },
  { id: 4, name: "On Hold", color: "bg-orange-500" },
  { id: 5, name: "Resolved", color: "bg-green-500" },
  { id: 6, name: "Closed", color: "bg-gray-400" },
  { id: 7, name: "Canceled", color: "bg-amber-900" },
];

interface TicketsStatusBarsProps {
  tickets: Ticket[];
  maxY?: number;
}

export default function TicketsStatusBars({ tickets, maxY }: TicketsStatusBarsProps) {
  const data: BarSlice[] = STATUSES.map(s => ({
    label: s.name,
    value: tickets.filter(t => t.statusId === s.id).length,
    color: s.color,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-1 rounded shadow-md dark:shadow-lg h-68 transition-colors duration-300 overflow-hidden flex flex-col" style={{ height: '272px', minHeight: '272px', maxHeight: '272px' }}>
      <h3 className="font-semibold mb-1 text-center text-gray-800 dark:text-gray-50">
        Tickets Status
      </h3>

      {/* Chart takes all remaining height */}
      <div className="flex-1 w-full overflow-hidden">
        <VerticalBars data={data} maxY={maxY} />
      </div>
    </div>
  );
}
