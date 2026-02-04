import React, { useMemo, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useStatuses } from "../features/ticket/useStatuses";
import { usePatchTicketStatus } from "../features/ticket/usePatchTicketStatus";
import StatusBadge from "@components/StatusBadge";
import type { BadgeColor } from "../features/theme/badgeColors";

type StatusSelectorProps = {
  statusId?: number;
  ticketId?: string | number;
  onSave?: (newStatusId: number) => void;
  onChange?: (statusId: number) => void;
};

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  statusId,
  ticketId,
  onSave,
  onChange,
}) => {
  const { statuses } = useStatuses();
  const { loading, error, patchStatus } = usePatchTicketStatus();

  const options = useMemo(
    () =>
      statuses.map((s) => ({
        id: s.id,
        name: s.name,
        color: s.color as BadgeColor,
      })),
    [statuses]
  );

  const selected = useMemo(
    () => options.find((o) => o.id === statusId) ?? options[0],
    [options, statusId]
  );

  const handleChange = async (newStatus: { id: number }) => {
    try {
      const updatedId = await patchStatus({
        ticketId: ticketId!,
        statusId: newStatus.id,
      });

      onSave?.(updatedId);
      onChange?.(updatedId);
    } catch {
      /* error already handled in hook */
    }
  };

  if (!selected) {
    return <div className="text-sm text-gray-500">Loading statuses...</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      <Listbox value={selected} onChange={handleChange} disabled={loading}>
        <div className="relative w-35">
          <ListboxButton
            className={clsx(
              "relative block w-full ps-4 py-1.5 rounded-lg bg-white text-gray-900 outline outline-gray-300 text-left whitespace-nowrap",
              "dark:bg-gray-800 dark:text-white dark:outline-gray-700",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            <StatusBadge text={selected.name} color={selected.color} />

            <ChevronDownIcon
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-2.5 size-4 text-gray-500 dark:fill-white/60"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className={clsx(
              "absolute left-0 top-full mt-1 min-w-full rounded-xl border border-gray-200 bg-white p-1 shadow-md focus:outline-none z-10",
              "dark:border-white/5 dark:bg-gray-800",
              "transition duration-100 ease-in data-leave:data-closed:opacity-0"
            )}
          >
            {options.map((opt) => (
              <ListboxOption
                key={opt.id}
                value={opt}
                className={clsx(
                  "group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none",
                  "data-focus:bg-gray-100 dark:data-focus:bg-white/10"
                )}
              >
                <StatusBadge text={opt.name} color={opt.color} />
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default StatusSelector;
