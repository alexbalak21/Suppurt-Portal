import React, { useEffect, useMemo, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { usePriorities } from "@features/ticket/usePriorities";
import { usePatchTicketPriority } from "@features/ticket/usePatchTicketPriority";
import { ChevronDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
  onChange?: (priorityId: number) => void;
  disabled?: boolean;
};

function getPriorityColor(priorityId?: number) {
  if (!priorityId || !priorityDotColors[priorityId as 1 | 2 | 3 | 4]) {
    return priorityDotColors[1];
  }
  return priorityDotColors[priorityId as 1 | 2 | 3 | 4];
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  priorityId,
  priorityName,
  ticketId,
  onSave,
  onChange,
  disabled = false,
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
              className={`w-3 h-3 rounded-sm ${getPriorityColor(priority.id).bg}`}
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

  // Initialize selected option
  useEffect(() => {
    if (!options.length) return;

    let matchedOption: SelectOption | undefined;

    if (priorityId) {
      matchedOption = options.find((opt) => opt.id === priorityId);
    }

    if (!matchedOption && priorityName) {
      const matchPriority = priorities.find(
        (priority) => priority.name.toLowerCase() === priorityName.toLowerCase()
      );
      if (matchPriority) {
        matchedOption = options.find((opt) => opt.id === matchPriority.id);
      }
    }

    if (!matchedOption) matchedOption = options[0];

    setSelected(matchedOption);
    setHasChanged(false);

    if (!ticketId && onChange) {
      onChange(matchedOption.id);
    }
  }, [options, priorities, priorityId, priorityName, ticketId, onChange]);

  const handleChange = (opt: SelectOption) => {
    if (disabled) return;

    setSelected(opt);
    setHasChanged(ticketId ? opt.id !== priorityId : false);
    setSaveError(null);

    if (!ticketId && onChange) {
      onChange(opt.id);
    }
  };

  const handleSave = async () => {
    if (disabled) return;
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
    <div>
      <div className="flex flex-row gap-2 items-start">
        <div className="flex-1">
          <Listbox value={selected} onChange={handleChange} disabled={disabled}>
            <div className="relative w-full">

              <ListboxButton
                disabled={disabled}
                className={clsx(
                  "relative block ps-4 rounded-lg bg-white text-gray-900 outline outline-gray-300 text-left whitespace-nowrap",
                  "dark:bg-gray-800 dark:text-white dark:outline-gray-700",
                  disabled && "opacity-50 cursor-not-allowed",
                  "w-full py-1.5 pr-8 pl-3 text-sm"
                )}
              >
                {selected?.label}

                <ChevronDownIcon
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-2.5 size-4 text-gray-500 dark:fill-white/60"
                />
              </ListboxButton>

              {!disabled && (
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
              )}
            </div>
          </Listbox>
        </div>

        {hasChanged && ticketId && !disabled && (
          <div className="inline-flex rounded-lg dark:border-gray-600">
            <button
              onClick={handleSave}
              disabled={patchLoading}
              className={clsx(
                "p-2 transition-colors",
                "bg-green-400 text-green-800 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700",
                "disabled:bg-green-400 disabled:cursor-not-allowed",
                "first:rounded-l-md border-r border-gray-300 dark:border-gray-600"
              )}
              title="Save"
            >
              <CheckIcon className="h-4 w-4" />
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
                "p-2 transition-colors",
                "bg-red-400 text-red-800 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700",
                "disabled:bg-red-400 disabled:cursor-not-allowed",
                "last:rounded-r-md"
              )}
              title="Cancel"
            >
              <XMarkIcon className="h-4 w-4"/>
            </button>
          </div>
        )}
      </div>

      {saveError && (
        <div className="text-sm text-red-600 mt-1">
          {saveError}
        </div>
      )}
    </div>
  );
};
