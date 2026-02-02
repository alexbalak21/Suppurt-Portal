import React, { useEffect, useMemo, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { usePriorities } from "../features/ticket/usePriorities";
import { usePatchTicketPriority } from "../features/ticket/usePatchTicketPriority";
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { priorityDotColors } from "../utils/priorityDotColors";
import type { ReactNode } from 'react'

export type SelectOption = {
  id: 1 | 2 | 3 | 4
  label: ReactNode
}

type PrioritySelectorProps = {
  priorityId?: number;
  priorityName?: string;
  ticketId?: string | number;
  onSave?: (newPriorityId: number) => void;
};

type SelectorUIProps = {
  options: SelectOption[]
  value?: SelectOption
  onChange?: (opt: SelectOption) => void
  className?: string
}

function getPriorityColor(priorityId?: number) {
  if (!priorityId || !priorityDotColors[priorityId as keyof typeof priorityDotColors]) {
    return priorityDotColors[1];
  }
  return priorityDotColors[priorityId as keyof typeof priorityDotColors];
}

function PrioritySelectorUI({
  options,
  value,
  onChange,
  className,
}: SelectorUIProps) {

  // Fully controlled: if parent gives a value, use it.
  // Otherwise fallback to first option.
  const selected = value ?? options[0]

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative w-full">
        <ListboxButton
          className={clsx(
            "relative block ps-4 rounded-lg bg-white text-gray-900 outline outline-gray-300 text-left whitespace-nowrap",
            "dark:bg-gray-800 dark:text-white dark:outline-gray-700",
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

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  priorityId,
  priorityName,
  ticketId,
  onSave,
}) => {
  const { priorities, loading } = usePriorities();
  const { patchPriority, loading: patchLoading, error: patchError } = usePatchTicketPriority();

  const options = useMemo<SelectOption[]>(
    () =>
      priorities.map((priority) => ({
        id: priority.id as SelectOption["id"],
        label: (
          <span className="inline-flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-sm ${
                getPriorityColor(priority.id).bg
              }`}
            ></span>
            {priority.name}
          </span>
        ),
      })),
    [priorities]
  );

  const [selected, setSelected] = useState<SelectOption | undefined>(undefined);
  const [hasChanged, setHasChanged] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!options.length) return;

    if (priorityId) {
      const match = options.find((opt) => opt.id === priorityId);
      if (match) {
        setSelected(match);
        setHasChanged(false);
        return;
      }
    }

    if (priorityName) {
      const matchPriority = priorities.find(
        (priority) => priority.name.toLowerCase() === priorityName.toLowerCase()
      );
      if (matchPriority) {
        const match = options.find((opt) => opt.id === matchPriority.id);
        if (match) {
          setSelected(match);
          setHasChanged(false);
          return;
        }
      }
    }

    setSelected(options[0]);
    setHasChanged(false);
  }, [options, priorities, priorityId, priorityName]);

  const handleChange = (opt: SelectOption) => {
    setSelected(opt);
    setHasChanged(opt.id !== priorityId);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!selected || !ticketId) return;

    try {
      setSaveError(null);
      const newPriorityId = await patchPriority({ ticketId, priorityId: selected.id });
      setHasChanged(false);
      onSave?.(newPriorityId);
    } catch (err) {
      setSaveError(patchError || 'Failed to save priority');
    }
  };

  if (loading || options.length === 0) {
    return (
      <span className="inline-flex items-center gap-2 px-2 py-1 rounded border border-gray-300 text-sm text-gray-500">
        Loading...
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <PrioritySelectorUI
        options={options}
        value={selected ?? options[0]}
        onChange={handleChange}
        className="w-full py-1.5 pr-8 pl-3 text-sm"
      />
      {hasChanged && ticketId && (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={patchLoading}
            className={clsx(
              "px-3 py-1.5 rounded text-sm font-medium transition-colors",
              "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed"
            )}
          >
            {patchLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => {
              const originalOpt = options.find((opt) => opt.id === priorityId) || options[0];
              setSelected(originalOpt);
              setHasChanged(false);
              setSaveError(null);
            }}
            disabled={patchLoading}
            className={clsx(
              "px-3 py-1.5 rounded text-sm font-medium transition-colors",
              "bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            )}
          >
            Cancel
          </button>
        </div>
      )}
      {saveError && (
        <div className="text-sm text-red-600 mt-1">
          {saveError}
        </div>
      )}
    </div>
  );
};

export default PrioritySelectorUI;
