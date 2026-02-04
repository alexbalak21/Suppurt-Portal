import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useState } from 'react'
import StatusBadge from './StatusBadge'
import clsx from 'clsx'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { BadgeColor } from '../features/theme/badgeColors'

interface Status {
  id: number
  name: string
  color: BadgeColor
}

const people: Status[] = [
  { id: 1, name: 'Open', color: 'blue' },
  { id: 2, name: 'In Progress', color: 'violet' },
  { id: 3, name: 'Waiting', color: 'yellow' },
  { id: 4, name: 'On Hold', color: 'orange' },
  { id: 5, name: 'Resolved', color: 'green' },
  { id: 6, name: 'Closed', color: 'gray' },
  { id: 7, name: 'Canceled', color: 'brown' },
]

export default function ListboxSelect() {
  const [selected, setSelected] = useState<Status>(people[0])

  return (
    <div className="relative w-35">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative w-full">

          {/* BUTTON */}
          <ListboxButton
            className={clsx(
              "relative block w-full ps-4 py-1.5 rounded-lg bg-white text-gray-900 outline outline-gray-300 text-left whitespace-nowrap",
              "dark:bg-gray-800 dark:text-white dark:outline-gray-700"
            )}
          >
            <StatusBadge text={selected.name} color={selected.color} />
            <ChevronDownIcon
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-2.5 size-4 text-gray-500 dark:fill-white/60"
            />
          </ListboxButton>

          {/* OPTIONS */}
          <ListboxOptions
            transition
            className={clsx(
              "absolute left-0 top-full mt-1 min-w-full rounded-xl border border-gray-200 bg-white p-1 shadow-md focus:outline-none z-10",
              "dark:border-white/5 dark:bg-gray-800",
              "transition duration-100 ease-in data-leave:data-closed:opacity-0"
            )}
          >
            {people.map((status) => (
              <ListboxOption
                key={status.id}
                value={status}
                className={clsx(
                  "group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none",
                  "data-focus:bg-gray-100 dark:data-focus:bg-white/10"
                )}
              >
                <StatusBadge text={status.name} color={status.color} />
              </ListboxOption>
            ))}
          </ListboxOptions>

        </div>
      </Listbox>
    </div>
  )
}
