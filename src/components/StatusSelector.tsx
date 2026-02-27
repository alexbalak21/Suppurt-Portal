import React, { useMemo, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import {
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useStatuses } from "@features/ticket/useStatuses";
import { usePatchTicketStatus } from "@features/ticket/usePatchTicketStatus";
import StatusBadge from "@components/StatusBadge";
import type { BadgeColor } from "@features/theme/badgeColors";

type StatusOption = { id: number; name: string; color: BadgeColor };

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
  const [pendingStatus, setPendingStatus] = useState<StatusOption | null>(null);

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

  // The value shown in the listbox: pending selection or current
  const displayedStatus = pendingStatus ?? selected;

  const handleChange = (newStatus: StatusOption) => {
    if (newStatus.id !== statusId) {
      setPendingStatus(newStatus);
    }
  };

  const handleConfirm = async () => {
    if (!pendingStatus) return;
    try {
      const updatedId = await patchStatus({
        ticketId: ticketId!,
        statusId: pendingStatus.id,
      });

      onSave?.(updatedId);
      onChange?.(updatedId);
      (window as any).showToast?.(`Status changed to ${pendingStatus.name}`, 'success');
      setPendingStatus(null);
    } catch {
      /* error already handled in hook */
    }
  };

  const handleCancel = () => {
    setPendingStatus(null);
  };

  if (!selected) {
    return <div className="text-sm text-gray-500">Loading statuses...</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Listbox value={displayedStatus} onChange={handleChange} disabled={loading}>
          <div className="relative w-35">
            <ListboxButton
              className={clsx(
                "relative block w-full ps-4 py-1.5 rounded-lg bg-white text-gray-900 text-left whitespace-nowrap",
                "dark:bg-gray-800 dark:text-white dark:outline-gray-700",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <StatusBadge text={displayedStatus.name} color={displayedStatus.color} />
              <ChevronDownIcon
                className="pointer-events-none ps-1 absolute top-1/2 -translate-y-1/2 right-2.5 size-4 text-gray-500 dark:fill-white/60"
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

        {pendingStatus && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={clsx(
                "inline-flex items-center justify-center rounded-md p-1",
                "bg-green-500 text-white hover:bg-green-600",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors"
              )}
              title="Save status"
            >
              <CheckIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className={clsx(
                "inline-flex items-center justify-center rounded-md p-1",
                "bg-red-500 text-white hover:bg-red-600",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors"
              )}
              title="Cancel"
            >
              <XMarkIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default StatusSelector;
