import React, { useMemo, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { useStatuses } from "../features/ticket/useStatuses";
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { getStatusColor } from "../utils/statusColors";
import type { ReactNode } from 'react'
import { useAuth } from "../features/auth";

export type StatusSelectOption = {
  id: number
  label: ReactNode
}

type StatusSelectorProps = {
  statusId?: number;
  statusName?: string;
  ticketId?: string | number;
  onSave?: (newStatusId: number) => void;
  onChange?: (statusId: number) => void;
};

type SelectorUIProps = {
  options: StatusSelectOption[]
  value?: StatusSelectOption
  onChange?: (opt: StatusSelectOption) => void
  className?: string
  isLoading?: boolean
}

function StatusSelectorUI({
  options,
  value,
  onChange,
  className,
  isLoading,
}: SelectorUIProps) {
  const selected = value ?? options[0]

  if (!selected) {
    return <div className="text-sm text-gray-500">Loading statuses...</div>
  }

  return (
    <Listbox value={selected} onChange={onChange} disabled={isLoading}>
      <div className="relative w-full">
        <ListboxButton
          className={clsx(
            "relative block w-33 ps-4 rounded-lg bg-white text-gray-900 outline outline-gray-300 text-left whitespace-nowrap",
            "dark:bg-gray-800 dark:text-white dark:outline-gray-700",
            isLoading && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {selected.label}

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
          {options.map(opt => (
            <ListboxOption
              key={opt.id}
              value={opt}
              className={clsx(
                "group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none",
                "data-focus:bg-gray-100 dark:data-focus:bg-white/10"
              )}
            >
              {opt.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  statusId,
  ticketId,
  onSave,
  onChange,
}) => {
  const { statuses } = useStatuses();
  const { apiClient } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options: StatusSelectOption[] = useMemo(
    () =>
      statuses.map((s) => ({
        id: s.id,
        label: (
          <div className="flex items-center gap-2">
            <div
              className={`size-2 rounded-full ${getStatusColor(s.id).bg}`}
            />
            <span>{s.name}</span>
          </div>
        ),
      })),
    [statuses]
  );

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id === statusId),
    [options, statusId]
  );

  const handleStatusChange = async (newOption: StatusSelectOption) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_id: newOption.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update ticket status');
      }

      if (onSave) {
        onSave(newOption.id);
      }

      if (onChange) {
        onChange(newOption.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <StatusSelectorUI
        options={options}
        value={selectedOption}
        onChange={handleStatusChange}
        className="py-1 px-3"
        isLoading={loading}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default StatusSelector;
