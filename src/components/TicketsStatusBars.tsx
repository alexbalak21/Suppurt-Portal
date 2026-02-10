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
    <div className="bg-white dark:bg-gray-900 py-4 px-6 rounded shadow w-1/2 h-68">
      <h3 className="font-semibold mb-1 text-center text-gray-900 dark:text-gray-100">
        Tickets Status
      </h3>

      {/* Chart takes all remaining height */}
      <div className="h-[calc(100%-28px)] w-full">
        <VerticalBars data={data} maxY={maxY} />
      </div>
    </div>
  );
}
