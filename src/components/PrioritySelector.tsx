import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { priorityColors } from "@/utils/priorityColors"
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export type SelectOption = {
  id: 1 | 2 | 3 | 4
  label: ReactNode
}

type SelectProps = {
  options: SelectOption[]
  value?: SelectOption
  onChange?: (opt: SelectOption) => void
  className?: string
}

export default function Select({
  options,
  value,
  onChange,
  className,
}: SelectProps) {

  // Fully controlled: if parent gives a value, use it.
  // Otherwise fallback to first option.
  const selected = value ?? options[0]

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="w-full">
        <ListboxButton
          className={clsx(
            "relative block ps-4 w-full rounded-lg bg-white text-gray-900 outline outline-1 outline-gray-300 text-left",
            "dark:bg-gray-800 dark:text-white dark:outline-gray-700",
            priorityColors[selected.id].bg,
            className
          )}
        >
          {selected.label}

          <ChevronDownIcon
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-2.5 size-4 text-gray-500 dark:fill-white/60"
          />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-[var(--button-width)] rounded-xl border border-gray-200 bg-white p-1 shadow-md focus:outline-none",
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
